import {
	TOGGLED_DEBUG_MODE,
	TOGGLED_TEST_MODE,
	SYSTEM,
	LOADING,
} from "../types";

const INITIAL_STATE = {
	branches: {
		data: [],
		keyed: {},
	},
	faqs: {
		data: []
	},
	departments: {
		data: [],
		keyed: {},
	},
	users: {
		data: [],
		keyed: {},
	},
	roles: {
		data: [],
		keyed: {},
	},
	meta: {
		isSetupComplete: false,
	},
	loading: {
		system: false,
	},
	messages: {
		system: "",
	},
	error: {
		system: {
			code: "",
			message: "",
		},
	},
	// add by Kin
	proposalFaq: [],
	scholarshipFaq: [],

	unsubs: [],
	defaultProfileURL:
		"https://firebasestorage.googleapis.com/v0/b/yse-portal.appspot.com/o/public_access%2Fyselogo.png?alt=media&token=8a9b8be5-8a46-40b7-bf01-8149ad630f6b",
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SYSTEM.FETCHED_BRANCHES_DATA:
			var { results, keyed } = action.payload;
			return {
				...state,
				branches: {
					...state.branches,
					data: results && [...results],
					keyed: keyed && { ...keyed },
				},
			};
		case SYSTEM.FETCHED_DEPARMENTS_DATA:
			var { results, keyed } = action.payload;
			return {
				...state,
				departments: {
					...state.departments,
					data: results && [...results],
					keyed: keyed && { ...keyed },
				},
			};
		case SYSTEM.FETCHED_ROLES_DATA:
			var { results, keyed } = action.payload;
			return {
				...state,
				roles: {
					...state.roles,
					data: results && [...results],
					keyed: keyed && { ...keyed },
				},
			};
		case SYSTEM.FETCHED_USERS_DATA:
			var { results, keyed } = action.payload;
			return {
				...state,
				users: {
					...state.users,
					data: results && [...results],
					keyed: keyed && { ...keyed },
				},
			};
		case SYSTEM.FETCHED_SYSTEM_META_DATA:
			return {
				...state,
				meta: {
					...action.payload,
				},
			};
		case LOADING.SYSTEM:
			return {
				...state,
				loading: {
					...state.loading,
					system: action.payload,
				},
			};
		case SYSTEM.HOOKED_SYSTEM_LISTENER:
			return {
				...state,
				unsubs: [...state.unsubs, ...action.payload],
			};

		// add by Kin
		case SYSTEM.PROPOSAL_FAQ.FETCHED_PROPOSAL_FAQ_SUCCESS:
			return {
				...state,
				proposalFaq: action.payload
			};
		case SYSTEM.PROPOSAL_FAQ.CREATED_PROPOSAL_FAQ_SUCCESS:
			return {
				...state,
				proposalFaq: [...state.proposalFaq, action.payload]
			};
		case SYSTEM.PROPOSAL_FAQ.UPDATED_PROPOSAL_FAQ_SUCCESS:
			return {
				...state,
				proposalFaq: [...state.proposalFaq.filter(obj => obj.uid !== action.payload.uid), action.payload]
			};
		case SYSTEM.PROPOSAL_FAQ.DELETED_PROPOSAL_FAQ_SUCCESS:
			return {
				...state,
				proposalFaq: [...state.proposalFaq.filter(obj => obj.uid !== action.uid)]
			};
		case SYSTEM.SCHOLARSHIP_FAQ.FETCHED_SCHOLARSHIP_FAQ_SUCCESS:
			return {
				...state,
				scholarshipFaq: action.payload
			};
		case SYSTEM.SCHOLARSHIP_FAQ.CREATED_SCHOLARSHIP_FAQ_SUCCESS:
			return {
				...state,
				scholarshipFaq: [...state.scholarshipFaq, action.payload]
			};
		case SYSTEM.SCHOLARSHIP_FAQ.UPDATED_SCHOLARSHIP_FAQ_SUCCESS:
			return {
				...state,
				scholarshipFaq: [...state.scholarshipFaq.filter(obj => obj.uid !== action.payload.uid), action.payload]
			};
		case SYSTEM.SCHOLARSHIP_FAQ.DELETED_SCHOLARSHIP_FAQ_SUCCESS:
			return {
				...state,
				scholarshipFaq: [...state.scholarshipFaq.filter(obj => obj.uid !== action.uid)]
			}
		default:
			return state;
	}
};
