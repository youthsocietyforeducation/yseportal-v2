import { fb, db, auth } from "../../firebase";
import * as firebase from "firebase";
import history from "../../history";
import * as _ from "lodash";
import { TOGGLED_TEST_MODE, SYSTEM } from "../types";
import { SYSTEM_TABLES } from "../../constants";
import {
	loading,
	logError,
	receivedError,
	receivedMessage,
	resetMessage,
	systemNotify,
} from "./commonActions";
import { signOut } from "./authActions";
import { result } from "lodash";
import {
	getUpdateMeta,
	getDefaultMetaFields,
	getUserRolesFromState,
} from "./util";
import { hasOneOfTheRoles } from "../../utils";
const pC = "systemActions";

export const activateSystem = () => (dispatch) => {
	return fb
		.functions()
		.httpsCallable("activateSystem")()
		.then((res) => {
			console.log("activateSystem res", res);
			console.log("activateSystem waiting  res", res);
			let message = "";
			if (res.data && res.data.message === "SUCCESS") {
				message = "You will be logged out in 5 seconds ... ";
			}
			dispatch(
				receivedMessage(SYSTEM.MESSAGES.ACTIVATED_SYSTEM_SUCCESSFULLY, {
					message,
				})
			);
		})
		.catch((err) => {
			console.log("Error: actions activateSystem", err);
			const { code, message } = err;
			dispatch(
				receivedError(SYSTEM.ERRORS.RECEIVED_SYSTEM_ACTIVATION_ERROR, {
					code,
					message,
				})
			);
		})
		.finally(() => {
			setTimeout(() => {
				dispatch(
					receivedMessage(SYSTEM.MESSAGES.ACTIVATED_SYSTEM_SUCCESSFULLY, {
						message: "",
					})
				);
				dispatch(signOut());
			}, 5000);
		});
};

/**
 * reads the system readonly data on firestore
 */
export const getSystemMetaData = () => async (dispatch) => {
	const ref = db.doc("system/meta");
	return ref
		.get()
		.then((doc) => {
			const meta = doc.data() || {};
			console.log("getSystemMetaData", meta);
			dispatch({
				type: SYSTEM.FETCHED_SYSTEM_META_DATA,
				payload: meta || {},
			});
		})
		.catch((err) => {
			console.log("Error: getSystemMetaData", err.code, err.message);
		});
};

export const triggerSetup = () => (dispatch, getState) => {
	const unsubs = [];
	for (const table in SYSTEM_TABLES) {
		let val = SYSTEM_TABLES[table];
		const ref = db.collection(val);
		const unSub = ref.onSnapshot((snapshot) => {
			var results = [];
			snapshot.forEach((doc) => {
				results.push(doc.data());
			});
			console.log("triggerSetup realtime ", table, results);
			dispatch(
				fetchedSystemData({
					table: val,
					data: { results: results, keyed: { ..._.keyBy(results, "uid") } },
				})
			);
		});
		unsubs.push(unSub);
	}
	console.log("unSub", unsubs);
	dispatch({ type: SYSTEM.HOOKED_SYSTEM_LISTENER, payload: unsubs || [] });
	dispatch(fetchSysRoles());
};

export const fetchSysRoles = () => (dispatch, getState) => {
	const userRoles = getUserRolesFromState(getState());
	if (
		userRoles &&
		hasOneOfTheRoles(["super_admin", "admin", "user_admin"], userRoles)
	) {
		db.collection("roles")
			.get()
			.then((snapshot) => {
				const roles = snapshot.docs.map((doc) => {
					return doc.data();
				});
				console.log("fetchSysRoles roles", roles);
				const data = {
					// results: [..._.filter(roles, (o) => o.value != "super_admin")],
					// keyed: { ..._.omit(_.keyBy(roles, "value"), ["super_admin"]) },
					results: [...roles],
					keyed: { ..._.keyBy(roles, "value") },
				};
				dispatch({
					type: SYSTEM.FETCHED_ROLES_DATA,
					payload: { ...data },
				});
			})
			.catch((err) => {
				dispatch(logError("get-roles-failed", err));
			});
	}
};

export const getSystemStaticData = async (table) => {
	let snapshot = await db.collection(table).get();
	let results = snapshot.docs.map((doc) => {
		return doc.data();
	});
	return results;
};

export const getSystemUserProfiles = async () => {
	console.log("getSystemUserProfiles, hi there");
	const snapshot = await db.collection("users").get();
	let results = snapshot.docs.map((doc) => {
		console.log("getSystemUserProfiles", doc.data());
		return doc.data();
	});
	return results;
};

const fetchedSystemData = (dataObj) => (dispatch) => {
	let { table, data } = dataObj;
	console.log("fetchedSystemData data", data);
	let type = "";
	switch (table) {
		case SYSTEM_TABLES.BRANCHES:
			type = SYSTEM.FETCHED_BRANCHES_DATA;
			break;
		case SYSTEM_TABLES.DEPARTMENTS:
			type = SYSTEM.FETCHED_DEPARMENTS_DATA;
			break;
			// data = {
			// 	...data,
			// 	results: [
			// 		..._.filter(data.results, (o) => {
			// 			return o.value !== "super_admin";
			// 		}),
			// 	],
			// 	keyed: { ..._.omit(data.keyed, ["super_admin"]) },
			// };
			break;
		case SYSTEM_TABLES.USERS:
			type = SYSTEM.FETCHED_USERS_DATA;
			break;
	}

	dispatch({
		type: type,
		payload: data,
	});
};

export const insertOrUpdateSystemStaticVar = (dataObj) => (dispatch) => {
	const { collection, label, active, isInsert } = dataObj;

	if (!(collection && label)) {
		throw new Error();
	}

	const value = label && label.toString().toLowerCase().replace(/ /g, "_");
	console.log("insertStaticVariable", collection, label, value, active);
	const ref = db.collection(collection).doc(value);
	const meta = isInsert ? getDefaultMetaFields() : getUpdateMeta();

	ref
		.set({ label, value, active, ...meta }, { merge: true })
		.then(() => {
			dispatch({ type: "" });
		})
		.catch((err) => {
			systemNotify("error", err.code, "");
			dispatch(logError("insert-or-update-failure", err));
		});
};

// Add by Kin
export const getProposalFaqData = () => dispatch => {
	const ref = db.collection("faqs").where("section", "==", "proposal");

	return ref.get().then(snapshot => {
		let faqs = [];
		faqs = snapshot.docs.map(doc => {
			return doc.data();

		})
		dispatch(fetchedProposalFaqSuccess(faqs))
	}).catch(err => {
		systemNotify("error", err.code, "Error in getting proposal document from database");
	});
}

export const getScholarshipFaqData = () => dispatch => {
	const ref = db.collection("faqs").where("section", "==", "scholarship");

	return ref.get().then(snapshot => {
		let faqs = [];
		faqs = snapshot.docs.map(doc => {
			return doc.data();
		})
		dispatch(fetchedScholarshipFaqSuccess(faqs))
	}).catch(err => {
		systemNotify("error", err.code, "Error in getting scholarship document from database");
	});
}

export const insertProposalFaqData = (dataObj) => dispatch => {
	const ref = db.collection("faqs").doc();
	dataObj.uid = ref.id;

	return ref.set(dataObj).then(() => {
		dispatch(createdProposalFaqSuccess(dataObj))
	}).catch(err => {
		systemNotify("error", err.code, "Error in adding proposal FAQ document to database");
	})
}

export const insertScholarshipFaqData = (dataObj) => dispatch => {
	const ref = db.collection("faqs").doc();
	dataObj.uid = ref.id;

	return ref.set(dataObj).then(() => {
		dispatch(createdScholarshipFaqSuccess(dataObj))
	}).catch(err => {
		systemNotify("error", err.code, "Error in adding scholarship FAQ document to database");
	})
}


export const editProposalFaqData = (dataObj, uid) => (dispatch, getState) => {
	
	const oldObj = getState().system.proposalFaq.find(obj => obj.uid === uid)
	const updatedObj = {...oldObj, ...dataObj}

	const ref = db.collection("faqs").doc(uid);
	return ref.update(dataObj).then(() => {
		console.log("updated the document in database");
		dispatch(updatedProposalFaqSuccess(updatedObj, uid))
	}).catch(err => {
		systemNotify("error", err.code, "Error in updating proposal FAQ document to database");
	})
}

export const editScholarshipFaqData = (dataObj, uid) => (dispatch, getState) => {
	
	const oldObj = getState().system.scholarshipFaq.find(obj => obj.uid === uid)
	const updatedObj = {...oldObj, ...dataObj}
	
	const ref = db.collection("faqs").doc(uid);
	return ref.update(dataObj).then(() => {
		console.log("updated the document in database");
		dispatch(updatedScholarshipFaqSuccess(updatedObj, uid))
	}).catch(err => {
		systemNotify("error", err.code, "Error in updating scholarship FAQ document to database");
	})
}

export const removeProposalFaqData = (uid) => dispatch => {
	return db.collection("faqs").doc(uid).delete().then(() => {
		console.log("Document successfully deleted!");
		dispatch(deletedProposalFaqSuccess(uid))
	}).catch(err => {
		systemNotify("error", err.code, "Error in deleting proposal FAQ document to database");
	});
}
export const removeScholarshipFaqData = (uid) => dispatch => {
	return db.collection("faqs").doc(uid).delete().then(() => {
		console.log("Document successfully deleted!");
		dispatch(deletedScholarshipFaqSuccess(uid))
	}).catch(err => {
		systemNotify("error", err.code, "Error in deleting scholarship FAQ document to database");
	});
}

export const fetchedProposalFaqSuccess = (dataObj) => {
	return {
		type: SYSTEM.PROPOSAL_FAQ.FETCHED_PROPOSAL_FAQ_SUCCESS,
		payload: dataObj
	}
}

export const createdProposalFaqSuccess = (dataObj) => {
	return {
		type: SYSTEM.PROPOSAL_FAQ.CREATED_PROPOSAL_FAQ_SUCCESS,
		payload: dataObj
	}
}

export const updatedProposalFaqSuccess = (dataObj, uid) => {
	return {
		type: SYSTEM.PROPOSAL_FAQ.UPDATED_PROPOSAL_FAQ_SUCCESS,
		payload: dataObj,
		uid: uid
	}
}

export const deletedProposalFaqSuccess = (uid) => {
	return {
		type: SYSTEM.PROPOSAL_FAQ.DELETED_PROPOSAL_FAQ_SUCCESS,
		uid: uid
	}
}


export const fetchedScholarshipFaqSuccess = (dataObj) => {
	return {
		type: SYSTEM.SCHOLARSHIP_FAQ.FETCHED_SCHOLARSHIP_FAQ_SUCCESS,
		payload: dataObj

	}
}

export const createdScholarshipFaqSuccess = (dataObj) => {
	return {
		type: SYSTEM.SCHOLARSHIP_FAQ.CREATED_SCHOLARSHIP_FAQ_SUCCESS,
		payload: dataObj
	}
}

export const updatedScholarshipFaqSuccess = (dataObj, uid) => {
	return {
		type: SYSTEM.SCHOLARSHIP_FAQ.UPDATED_SCHOLARSHIP_FAQ_SUCCESS,
		payload: dataObj,
		uid: uid
	}
}

export const deletedScholarshipFaqSuccess = (uid) => {
	return {
		type: SYSTEM.SCHOLARSHIP_FAQ.DELETED_SCHOLARSHIP_FAQ_SUCCESS,
		uid: uid
	}
}
