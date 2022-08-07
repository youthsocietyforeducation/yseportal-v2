import {
	CREATED_ACCOUNT,
	// UPDATED_ACCOUNT_PROFILE,
	// FETCHED_ACCOUNT_PROFILE,
	FETCHED_USER_PROFILE,
	FETCHED_USERS,
	// SIGNED_UP,
	SIGNED_IN,
	SIGNED_OUT,
	DELETED_UNVERIFIED_USERS,
	AUTH_LOADING,
	CREATED_NEW_USER,
	FOUND_ERROR_DURING_SIGN_UP,
	FOUND_ERROR_DURING_LOGIN,
	ATTEMPTED_LOGIN,
	ATTEMPTED_SIGN_UP,
	AUTH,
} from "../types";

const INITIAL_STATE = {
	isLoggedIn: false,
	userId: null,
	userName: null,
	user: null,
	user_profile: null,
	account: null,
	sysUsers: [],
	loading: false,
	deletedUnverifiedUsers: [],
	createdUser: "",
	errors: {
		signUp: "",
		login: "",
	},
	loading: {
		login: false,
		signUp: false,
	},
	messages: {
		emailVerificationMessage: "",
	},
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case CREATED_ACCOUNT:
			console.log("CREATED_ACCOUNT: ", action.payload);
			return {
				...state,
				user: action.payload,
			};
		case "CHANGED_PASSWORD":
			return {
				...state,
				authFrame: action.payload.authFrame,
			};
		case "EMAIL_SENT":
			return {
				...state,
				isSignedIn: true,
				authFrame: "verifyandlogin",
				isVerified: action.payload.isVerified,
			};
		case "AUTH_UPDATE":
			return {
				...state,
				account: {
					...state.account,
					profile: {
						...state.account.profile,
						...action.profile,
						image: { ...action.profile.image },
					},
				},
			};
		case SIGNED_IN:
			return {
				...state,
				isLoggedIn: true,
				user: action.payload.user,
			};
		case FETCHED_USER_PROFILE /* basically same as account profile; use fetched account profile*/:
			return {
				...state,
				user: action.payload,
			};
		case AUTH.FETCHED_AUTH_ACCOUNT_PROFILE:
			console.log("FETCHED_AUTH_ACCOUNT_PROFILE", action.payload);
			return {
				...state,
				isLoggedIn: true,
				account: { ...action.payload },
			};
		case AUTH.FETCHED_NOTIFICATIONS:
			return {
				...state,
				notifications: action.payload,
			};
		case FETCHED_USERS:
			return {
				...state,
				sysUsers: action.payload,
			};
		case AUTH_LOADING:
			return {
				...state,
				loading: true,
			};
		case CREATED_NEW_USER:
			return {
				...state,
				loading: false,
				createdUser: action.payload,
			};
		case DELETED_UNVERIFIED_USERS:
			return {
				...state,
				deletedUnverifiedUsers: action.payload,
			};
		case FOUND_ERROR_DURING_SIGN_UP:
			return {
				...state,
				errors: {
					...state.errors,
					signUp: action.payload,
				},
			};
		case FOUND_ERROR_DURING_LOGIN:
			return {
				...state,
				errors: {
					...state.errors,
					login: action.payload,
				},
			};
		case ATTEMPTED_LOGIN:
			return {
				...state,
				loading: {
					...state.login,
					login: action.payload,
				},
			};
		case ATTEMPTED_SIGN_UP:
			return {
				...state,
				loading: {
					...state.login,
					signUp: action.payload,
				},
			};
		case AUTH.MESSAGES.SENT_EMAIL_VERIFICATION:
			return {
				...state,
				messages: {
					...state.messages,
					emailVerificationMessage: action.payload,
				},
			};
		default:
			return state;
	}
};
