import {
	FETCHED_ACCOUNT_PROFILE,
	UPDATED_ACCOUNT_PROFILE,
	FETCHED_USERS,
	ACCOUNT_MANAGEMENT,
} from "../types";

const INITIAL_STATE = {
	selectedAccount: null,
	selectedAccountRoles: [],
	userAccounts: [],
	loading: {
		setup: false,
		profileSave: false,
	},
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case "SELECTED_ACCOUNT_PROFILE":
			return {
				...state,
				selectedAccount: action.payload.data,
			};
		case FETCHED_ACCOUNT_PROFILE:
			return {
				...state,
				selectedAccount: action.payload.data,
				isVerified: action.payload.isVerified,
				message: action.payload.message,
			};
		case FETCHED_USERS:
			return {
				...state,
				userAccounts: action.payload,
			};
		case UPDATED_ACCOUNT_PROFILE:
			return {
				...state,
				// selectedAccount: action.payload,
			};
		case ACCOUNT_MANAGEMENT.LOADING_ACCOUNT_SETUP:
			return {
				...state,
				loading: {
					...state.loading,
					setup: action.payload,
				},
			};
		case ACCOUNT_MANAGEMENT.UPDATING_ACCOUNT_PROFILE:
			return {
				...state,
				loading: {
					...state.loading,
					profileSave: action.payload,
				},
			};
		case ACCOUNT_MANAGEMENT.FETCHED_USER_ROLES:
			return {
				...state,
				selectedAccountRoles: [...action.payload],
			};
		default:
			return state;
	}
};
