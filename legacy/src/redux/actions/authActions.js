// import fb from "../../components/FirebaseAuth/config/firebase";
import { db, fb } from "../../firebase";
import firebase from "firebase";
import history from "../../history";
import { getAccountProfile } from "./accountManagementActions";
import { User } from "../models/User";
import {
	FETCHED_ACCOUNT_PROFILE,
	FETCHED_USER_PROFILE,
	SIGNED_IN,
	SIGNED_OUT,
	CREATED_ACCOUNT,
	DELETED_UNVERIFIED_USERS,
	AUTH_LOADING,
	CREATED_NEW_USER,
	FOUND_ERROR_DURING_SIGN_UP,
	FOUND_ERROR_DURING_LOGIN,
	ATTEMPTED_LOGIN,
	ATTEMPTED_SIGN_UP,
	AUTH,
	LOADING,
	SYSTEM,
} from "../types";
import { NOTIFY_TYPES, USERS } from "../../constants";
import {
	loading,
	logError,
	receivedError,
	receivedMessage,
	systemNotify,
	systemMessage,
} from "./commonActions";
import { triggerSetup } from "./systemActions";
import { notification } from "antd";
import { getUnSubsFromState, getUserRolesFromState } from "./util";
import * as _ from "lodash";
export const changeUserPassword = (currentPassword, newPassword) => (
	dispatch
) => {
	console.log("changeUserPassword curr, new", currentPassword, newPassword);
	let user = fb.auth().currentUser;
	let credential = firebase.auth.EmailAuthProvider.credential(
		user.email,
		currentPassword
	);
	console.log("changeUserPassword credential", credential);
	return user
		.reauthenticateWithCredential(credential)
		.then(() => {
			return user.updatePassword(newPassword).then(() => {
				systemMessage("success", "Password changed successfully!");
				dispatch({
					type: "CHANGED_PASSWORD",
					payload: { authFrame: "login" },
				});
				setTimeout(() => {
					history.go();
				}, 500);
			});
		})
		.catch((err) => {
			console.log("changeUserPasswor", err.code, err.message);
			systemMessage("error", err.message);
		});

	// if (fb.User) {
	// 	console.log("changeChangePassword emailVerified", fb.User.emailVerified);
	// }
	// let user = fb.auth().currentUser;
	// let credential = fb.auth.EmailAuthProvider.credential(
	// 	user.email,
	// 	currentPassword
	// );
	// console.log("changeChangePassword", credential);
	// return user
	// 	.reauthenticateWithCredential(credential)
	// 	.then(() => {
	// 		user
	// 			.updatePassword(newPassword)
	// 			.then(() => {
	// 				window.alert("Password Updated SUCCESSFULLY!");
	// 				dispatch({
	// 					type: "CHANGED_PASSWORD",
	// 					payload: { authFrame: "login" },
	// 				});
	// 				history.push(`/account/profile/${uid}`);
	// 			})
	// .catch((error) => {
	// 	window.alert("FAILED To Update Your Password. Please Try Again!");
	// });
	// 	})
	// 	.catch((error) => {
	// 		window.alert("Your current password is wrong. Please try again!");
	// 	});
};

export const sendVerificationEmail = () => (dispatch) => {
	let user = fb.auth().currentUser;

	return user.sendEmailVerification().then(function () {
		dispatch(
			getAccountProfile(
				fb.auth().currentUser.uid,
				"Verification Email Has Been Sent."
			)
		);
	});
};

export const onAuthStateChanged = () => (dispatch) => {
	fb.auth().onAuthStateChanged(async (user) => {
		if (user) {
			console.log("onAuthStateChanged: ", user);
			console.log("onAuthStateChanged: uid", user.uid);

			dispatch({
				type: SIGNED_IN,
				payload: { user },
			});
			const finalUserObj = await getAuthAccountProfile(user.uid);
			dispatch(fetchedAuthUserProfile(finalUserObj));
			dispatch(triggerSetup());
			dispatch(fetchNotifications());
		} else {
			// leave as type: SIGNED_OUT or will get infinite loop
			dispatch({ type: SIGNED_OUT });
		}
	});
	return Promise.resolve();
};

export const fetchNotifications = () => (dispatch) => {
	const currUserId = fb.auth().currentUser.uid;
	const unSub = db
		.collection("notifications")
		.where("targetedUser", "==", currUserId)
		.where("viewed", "==", false)
		.onSnapshot((snapshot) => {
			var results = [];
			snapshot.forEach((doc) => {
				results.push(doc.data());
			});
			console.log("fetchNotifications", results);
			dispatch({
				type: AUTH.FETCHED_NOTIFICATIONS,
				payload: _.sortBy(results, (notification) => {
					return Date.parse(notification.created);
				}).reverse(),
			});
			dispatch({
				type: SYSTEM.HOOKED_SYSTEM_LISTENER,
				payload: [unSub] || [],
			});
		});
};

export const fetchedAuthUserProfile = (finalUserObj) => (dispatch) => {
	dispatch({
		type: AUTH.FETCHED_AUTH_ACCOUNT_PROFILE,
		payload: finalUserObj || {},
	});
};

export const signIn = (email, password) => (dispatch, getState) => {
	if (email && password) {
		return fb
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then(async (user) => {
				let userId = user.user.uid;
				let finalUserObj = await getAuthAccountProfile(userId);
				return Promise.resolve(finalUserObj);
			})
			.then((finalUserObj) => {
				const { isProfileSet, uid } = finalUserObj;
				if (!isProfileSet) {
					history.push(`/account/profile/setup/${uid}`);
				} else {
					history.push("/");
				}
			})
			.catch((err) => {
				systemNotify(
					NOTIFY_TYPES.ERROR,
					"Something Went Wrong!",
					"Please double check that your email and password are correct"
				);
				dispatch(
					logError(AUTH.ERRORS.RECEIVED_LOGIN_ERROR, {
						code: err.code,
						message: err.message,
					})
				);
			});
	}
};

export const signOut = () => (dispatch, getState) => {
	console.log("signout getState", getState());
	const unsubs = getUnSubsFromState(getState());
	unsubs.forEach((unsubscribe) => unsubscribe());
	return fb
		.auth()
		.signOut()
		.then(() => {
			history.push("/login");
			window.location.reload();
			dispatch({ type: SIGNED_OUT });
		})
		.catch((err) => {
			console.log("Error: sign out was not successful", err);
		});
};

export const createUser = (email) => async (dispatch) => {
	dispatch({ type: AUTH_LOADING });
	if (email) {
		return fb
			.functions()
			.httpsCallable("createUser")({ email })
			.then((res) => {
				console.log("createUser res", res);
				const uid = res.data;
				if (uid) {
					history.push(`/account/profile/${uid}/edit`);
					dispatch({
						type: CREATED_NEW_USER,
						payload: uid,
					});
				}
			});
	}
};

export const signUp = (data) => (dispatch) => {
	const { email, password } = data;
	dispatch(attemptedSignUp(true));
	if (email && password) {
		return createNewUser(email, password)
			.then((user) => {
				console.log("createNewUser: success!", user);
				console.log("createNewUser: user.uid!", user.user.uid);
				dispatch(sendVerify());
			})
			.catch((err) => {
				console.log(
					"Error: Creating user with email and password failed!",
					err
				);
				dispatch({
					type: FOUND_ERROR_DURING_SIGN_UP,
					payload: err.message,
				});
			})
			.finally(() => {
				dispatch(attemptedSignUp(false));
			});
	}
};

const attemptedSignUp = (val) => {
	return {
		type: ATTEMPTED_SIGN_UP,
		payload: val,
	};
};

// const createUserProfile = (data) => (dispatch) => {
//   const { firstName, lastName, displayName, email, uid } = data;
//   let newUser = new User();
//   console.log('createUserProfile: ' + JSON.stringify(newUser));
//   console.log('createUserProfile: data' + JSON.stringify(data));
//   if (firstName && lastName && displayName && email && uid) {
//     const userRef = db.collection(USERS).doc(uid);
//     const uid = userRef.id;
//     newUser.firstName = firstName;
//     newUser.lastName = lastName;
//     newUser.displayName = displayName;
//     newUser.email = email;

//     console.log('createUserProfile: after' + newUser.toString());
//     return userRef.set({ ...newUser }, { merge: true });
//   }
// };

/**
 * this function creates a user with firebase's createUserWithEmailAndPassword
 * @param {email for new user} email
 * @param {password for new user} password
 */
export const createNewUser = (email, password) => {
	return fb.auth().createUserWithEmailAndPassword(email, password);
};

export const sendVerify = () => (dispatch) => {
	return fb
		.auth()
		.currentUser.sendEmailVerification()
		.then(() => {
			dispatch(
				receivedMessage(AUTH.MESSAGES.SENT_EMAIL_VERIFICATION, {
					message:
						"An email verification has been sent to you. You will be logged out in 10 seconds ...",
				})
			);
		})
		.catch((err) =>
			console.log("Error: sending email verification failed!", err)
		)
		.finally(() => {
			setTimeout(() => {
				dispatch(
					receivedMessage(AUTH.MESSAGES.SENT_EMAIL_VERIFICATION, {
						message: "",
					})
				);
				dispatch(signOut());
			}, 10000);
		});
};

export const getAuthAccountProfile = async (userId) => {
	console.log("getAuthAccountProfile", userId);
	const userRef = db.doc(`users/${userId}`);
	const user = await userRef.get();
	let userData = user.data() || {};
	const userPrivateRef = userRef.collection("private").doc("data");
	const privateObj = await userPrivateRef.get();
	const privateData = privateObj.data() || {};

	const finalUserObj = { ...userData, private: { ...privateData } };
	console.log("getAuthAccountProfile userData", finalUserObj);
	return finalUserObj || {};
};

export const deleteUnverifiedUsers = () => async (dispatch) => {
	console.log("getting reached");
	return await fb
		.functions()
		.httpsCallable("deleteUnverifiedUsers")({})
		.then((res) => {
			console.log("Success! deleteUnverifiedUsers", res);
			dispatch(deletedUnverifiedUsers(res.data.markedForDelete));
		})
		.catch((err) => {
			console.log("Error: deleteUnverifiedUsers failed", err);
		});
};

const deletedUnverifiedUsers = (userIdList) => {
	console.log("deletedUnverifiedUsers userIdList", userIdList);
	return {
		type: DELETED_UNVERIFIED_USERS,
		payload: userIdList,
	};
};

/**
 * use this function to get specific collection with specific document id
 * @param {firebase collection} collection
 * @param {the id of the document} documentId
 */
export const getCollection = (collection, documentId) => {
	return fb.firestore().collection(collection).doc(documentId).get();
};

/**
 * use this function to set specific collection with specific document id
 * to data object that has been passed in
 * @param {firebase collection} collection
 * @param {the id of the document} documentId
 * @param {data object to be set for the document} data
 */
export const updateCollection = (collection, documentId, data) => {
	return fb
		.firestore()
		.collection(collection)
		.doc(documentId)
		.set(data, { merge: true });
};

/**
 * this action sends reset password link through firebase
 * and navigate the user back to the login page
 * @param {*} email
 */
export const sendResetPasswordLink = (email) => (dispatch) => {
	dispatch(loading(LOADING.SYSTEM, true));
	const message = "Reset Link Requested!";
	const description = `A password reset link will be sent to ${email}`;
	return fb
		.auth()
		.sendPasswordResetEmail(email)
		.catch((err) => {
			dispatch(
				logError(AUTH.ERRORS.RECEIVED_RESET_PASSWORD_LINK_ERROR, {
					code: err.code,
					message: err.message,
				})
			);
		})
		.finally(() => {
			systemNotify(NOTIFY_TYPES.INFO, message, description);
			setTimeout(() => {
				history.push("/login");
			}, 500);
			dispatch(loading(LOADING.SYSTEM, false));
		});
};

export const loadAccountProfile = (user) => {
	return {
		type: FETCHED_ACCOUNT_PROFILE,
		payload: user,
	};
};

export const loadUserProfile = (user) => {
	return {
		type: FETCHED_USER_PROFILE,
		payload: user,
	};
};

export const loadFirebaseUser = (user) => {
	return {
		type: CREATED_ACCOUNT,
		payload: user,
	};
};
