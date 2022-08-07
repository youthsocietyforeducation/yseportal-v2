import { db, fb } from "../../firebase";
import firebase from "firebase";
import history from "../../history";
import {
	getDefaultMetaFields,
	getUpdateMeta,
	uploadFileToFirebase,
} from "./util";
import {
	FETCHED_ACCOUNT_PROFILE,
	UPDATED_ACCOUNT_PROFILE,
	FETCHED_USERS,
	ACCOUNT_MANAGEMENT,
} from "../types";
import { removeEmptyKeyFromObj } from "../../utils";
import { getAuthAccountProfile, fetchedAuthUserProfile } from "./authActions";
import * as _ from "lodash";
import { logError, systemMessage, systemNotify } from "./commonActions";
export const getUsers = () => (dispatch) => {
	return db
		.collection("users")
		.get()
		.then((users) => {
			let userAccounts = [];
			console.log("aMActions: getUsers", users);

			userAccounts = users.docs.map((doc) => {
				let user = doc.data();
				return user;
			});

			dispatch({
				type: FETCHED_USERS,
				payload: userAccounts,
			});
		});
};

export const getAccountProfile = (userId) => (dispatch) => {
	let userRef = fb.firestore().collection("users").doc(userId);
	return userRef
		.get()
		.then((user) => {
			if (user.exists) {
				let data = user.data();
				return dispatch({
					type: FETCHED_ACCOUNT_PROFILE,
					payload: {
						data,
					},
				});
			} else {
				console.log("APE: No such document found!");
			}
		})
		.catch((err) => {
			alert("Error: getAccountProfile() account profile not found!", err);
		});
};

export const resetAccountProfile = () => (dispatch, getState) => {
	return dispatch({
		type: "SELECTED_ACCOUNT_PROFILE",
		payload: {
			data: {},
		},
	});
};

export const setupAccountProfile = (data) => (dispatch) => {
	dispatch(loadingAccountSetup(true));
	if (data) {
		const {
			profile,
			profile: { firstName, lastName },
		} = data;
		const displayName = `${firstName} ${lastName}`;
		const uid = fb.auth().currentUser.uid;
		const ref = db.collection("users").doc(uid);
		const newData = {
			...profile,
			displayName,
			isProfileSet: true,
			emailVerified: true,
		};
		return ref
			.set(newData, { merge: true })
			.then(() => {
				dispatch(accountProfileSetup(uid));
				history.push(`/account/profile/${uid}`);
			})
			.catch((err) => {
				console.log("Error: setupAccountProfile() failed", err);
			})
			.finally(() => {
				dispatch(loadingAccountSetup(false));
			});
	} else {
		console.log("setupAccountProfile: data obj is null");
	}
};

const loadingAccountSetup = (val) => {
	return {
		type: ACCOUNT_MANAGEMENT.LOADING_ACCOUNT_SETUP,
		payload: val,
	};
};

/**
 * this helper function is used to update the store about the current user
 * who has just completed their profile account.
 * @param {the uid of the user that just set up their profile} uid
 */
export const accountProfileSetup = (uid) => async (dispatch) => {
	const finalAuthUserObj = await getAuthAccountProfile(uid);
	dispatch(fetchedAuthUserProfile(finalAuthUserObj));
	dispatch(getAccountProfile(uid));
};

export const updateAccountProfile = (data) => async (dispatch) => {
	dispatch(updatingAcccontProfile(true));
	setTimeout(() => {
		dispatch(updatingAcccontProfile(false));
	}, 3000);
};

const updatingAcccontProfile = (val) => {
	return {
		type: ACCOUNT_MANAGEMENT.UPDATING_ACCOUNT_PROFILE,
		payload: val,
	};
};

/**
 * this function is used to update the auth profile on firebase.
 * use this function to ONLY update the displayName field.
 * we are not supporting other fields as of now.
 *
 * @param {data can contain displayName} data
 */
// export const updateFirebaseAuthProfile = (data) => {
// 	if (data) {
// 		return fb.auth().currentUser.updateProfile({ ...data });
// 	}
// };

// /**
//  * this function is used by both user and admin to update the account profile.
//  * empty keys will be removed before merging to the firestore.
//  * @param {data contains profile, previousAccount, image} data
//  */
// export const updateAccountProfile = (data) => async (dispatch) => {
// 	if (
// 		data &&
// 		data.profile &&
// 		data.previousAccount &&
// 		data.previousAccount.profile
// 	) {
// 		const email = data.previousAccount.profile.email;
// 		const uid = data.previousAccount.uid;
// 		const image = data.image;
// 		const newProfile = data.profile;
// 		const previousAccount = data.previousAccount;

// 		let filePath = `accounts/${email}_${uid}/profile/`;
// 		let userAccountRef = fb.firestore().collection('users').doc(uid);
// 		let newObj = {
// 			profile: { ...newProfile },
// 			meta: {
// 				...previousAccount.meta,
// 				lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
// 				updatedBy: db.auth().currentUser.email,
// 			},
// 		};

// 		if (db.auth().currentUser.uid === uid && image && image[0]) {
// 			await uploadFileToFirebase(image[0], filePath).then((result) => {
// 				newObj.profile.profileImageURL = result.fileUrl;
// 				newObj.profile.profileImageName = result.fileName;
// 			});
// 		}
// 		newObj.profile = { ...removeEmptyKeyFromObj(newObj.profile) };
// 		newObj.meta = { ...removeEmptyKeyFromObj(newObj.meta) };

// 		return userAccountRef
// 			.set(newObj, { merge: true })
// 			.then(() => {
// 				dispatch(updatedAccountProfile(uid));
// 				history.push(`/account/profile/${uid}`);
// 			})
// 			.catch((err) => {
// 				alert('Error: unable to update profile');
// 				console.log('Error: unable to update profile', err);
// 			});
// 	}
// };

/**
 * this helper function is used to trigger store changes
 * if the current user is updating their own profile, update the auth store
 * but update the account store no matter what
 * @param {uid of the account that was updated} uid
 */
export const updatedAccountProfile = (uid) => (dispatch) => {
	if (db.auth().currentUser.uid === uid) {
		dispatch(getAuthAccountProfile(uid));
	}
	dispatch(getAccountProfile(uid));
};

export const uploadFile = (files, file_path) => {
	let storageRef = db.storage().ref();
	let promises = [];

	for (let i = 0; i < files.length; i++) {
		promises.push(
			storageRef.child(`${file_path}/${files[i].name}`).put(files[i])
		);
	}
	return Promise.all(promises)
		.then((res) => {
			promises = [];
			for (let i = 0; i < files.length; i++) {
				promises.push(res[i].ref.getDownloadURL());
			}
			return Promise.all(promises);
		})
		.then((res) => {
			let dbFilesRef = [];
			for (let i = 0; i < files.length; i++) {
				dbFilesRef.push({
					file_name: files[i].name,
					download_url: res[i],
				});
			}
			return dbFilesRef;
		})
		.catch((err) => {
			console.log("Error: uploading files failed", err);
		});
};

export const fetchUserRoles = (userId) => (dispatch) => {
	console.log("fetchUserRoles userId", userId);
	const ref = db.collection(`user_has_roles`).where("user", "==", userId);
	return ref.get().then((snap) => {
		const results = snap.docs.map((doc) => {
			console.log("fetchUserRoles", doc.data());
			return doc.data();
		});
		console.log("fetchUserRoles", results);
		dispatch({
			type: ACCOUNT_MANAGEMENT.FETCHED_USER_ROLES,
			payload: results || [],
		});
	});
};

const getToAddAndToDeleteRoles = (dataObj) => {
	const { roles, prevRoles } = dataObj;
	// to add roles
	let unioned = _.union(roles, prevRoles);
	let toAddRoles = _.difference(unioned, prevRoles);
	console.log("updateUserRoles toAdd'", toAddRoles);
	// to delete roles
	let intersected = _.intersection(roles, prevRoles);
	let toDeleteRoles = _.difference(prevRoles, intersected);
	console.log("updateUserRoles toDelete'", toDeleteRoles);
	return {
		toAddRoles: [...toAddRoles] || [],
		toDeleteRoles: [...toDeleteRoles] || [],
	};
};

export const updateUserRoles = (dataObj) => async (dispatch) => {
	const { roles, prevRoles, userId } = dataObj;
	console.log("updateUserRoles", dataObj);
	const retObj = getToAddAndToDeleteRoles({ roles, prevRoles });
	const { toAddRoles, toDeleteRoles } = retObj;

	// perform delete first
	await toDeleteRoles.forEach(async (role) => {
		try {
			await db
				.collection("user_has_roles")
				.where("role", "==", role)
				.where("user", "==", userId)
				.get()
				.then((userRoles) => {
					userRoles &&
						userRoles.forEach(async (userRole) => {
							const roleData = userRole.data();
							console.log("toDeleteRoles", roleData);
							await db
								.doc(`user_has_roles/${roleData.uid}`)
								.delete()
								.then(() => {
									systemNotify(
										"success",
										"Success!",
										`Deleted ${roleData.role}`
									);
								})
								.catch(() => {
									systemNotify(
										"error",
										"Failed!",
										`You cannot delete ${roleData.role}`
									);
								});
						});
				});
		} catch (err) {
			dispatch(logError("failed-delete", err));
		}
	});
	await toAddRoles.forEach(async (role) => {
		try {
			const ref = db.collection("user_has_roles").doc();
			await ref
				.set({
					...getDefaultMetaFields(),
					role: role,
					user: userId,
					active: true,
					uid: ref.id,
				})
				.then(async () => {
					await systemNotify("success", "Success!", `Created ${role}`);
				})
				.catch(async (err) => {
					await systemNotify(
						"error",
						"Error!",
						`Failed to create  ${role} ${err.code} ${err.message}`
					);
				});
		} catch (err) {
			dispatch(logError("failed-insert", err));
		}
	});

	dispatch(fetchUserRoles(userId));
	setTimeout(() => {
		history.go();
	}, 750);
};

export const uploadProfilePicture = (dataObj) => async (dispatch) => {
	const { file, userId, displayName } = dataObj;
	console.log("Upload, uploadProfilePicture", file);
	if (file && userId && displayName) {
		const authUserId = fb.auth().currentUser.uid;
		const pathName = `${displayName.replace(/ /g, "_")}_profileImage`;
		const ref = fb.storage().ref();
		return ref
			.child(`users/${userId}/${pathName}`)
			.put(file)
			.then((result) => {
				return result.ref.getDownloadURL();
			})
			.then((url) => {
				// got the url
				return db
					.doc(`users/${userId}`)
					.set({ profileImageURL: url, ...getUpdateMeta() }, { merge: true });
			})
			.then(() => {
				console.log("firebase analytics profile_upload");
				firebase.analytics().logEvent("profile_uploaded");
			})
			.catch((err) => {
				systemMessage("error", "Uploading profile pic failed");
				console.log("Error! uploadProfilePicture err", err);
			});
	}
};
