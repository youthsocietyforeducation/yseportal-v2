import {
	ADDED_TO_SELECTED_AUTHORS,
	CHANGED_VIEW,
	CHANGED_STATUS,
	// SHOW_PROPOSAL, // not used
	// GET_PROJECT_PROPOSAL, // not used
	FETCHED_PROJECT_PROPOSALS,
	FETCHED_COMMENTS,
	REMOVED_FROM_SELECTED_AUTHORS,
	SUBMITTED_PROPOSAL,
	FETCHED_PROPOSAL_ADMIN_PERMISSION,
	FETCHED_PROPOSAL_ACTIVITIES,
	UNMOUNTED_PROPOSAL_DATA,
	FILTERED_PROPOSAL,
	SET_SEARCH_VAL,
	PROPOSAL,
} from "../types";

const INITIAL_STATE = {
	proposalFrame: null,
	selectedProposal: {
		proposal: {},
		activities: [],
		comments: [],
	},
	activities: [],
	comments: [],
	selectedProposalId: null,
	searchVal: "",
	readableProposals: [],
	filteredProposals: [],
	selectedAuthors: [],
	readableComments: [],
	isAdmin: false,
	error: null,
	proposals: [],
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ADDED_TO_SELECTED_AUTHORS:
			return {
				...state,
				selectedAuthors: [...state.selectedAuthors, action.payload],
			};
		case CHANGED_STATUS:
			return {
				...state,
			};
		case REMOVED_FROM_SELECTED_AUTHORS:
			// console.log("REMOVED_FROM_SELECTED_AUTHORS", action.payload);
			return {
				...state,
				selectedAuthors: action.payload,
			};

		// case FETCHED_COMMENTS: // to be deleted: july 4th 2020
		// 	let comments = action.payload;
		// 	// console.log("Inside Actions: FETCHED_COMMENTS", comments);

		// 	// let selectedProposal = state.selectedProposal;
		// 	// console.log("FETCHED_COMMENTS: ", selectedProposal);

		// 	return {
		// 		...state,
		// 		proposalFrame: "SHOW",
		// 		readableComments: comments,
		// 	};
		case PROPOSAL.FETCHED_PROPOSAL_COMMENTS:
			let { comments } = action.payload;
			return {
				...state,
				selectedProposal: {
					...state.selectedProposal,
					comments: [...comments],
				},
			};
		case PROPOSAL.FETCHED_PROPOSAL_ACTIVITIES:
			let { activities } = action.payload;
			return {
				...state,
				selectedProposal: {
					...state.selectedProposal,
					activities: [...activities],
				},
			};
		case PROPOSAL.FETCHED_PROJECT_PROPOSALS:
			// console.log("Inside Actions: SUBMITTED_COMMENT", action.payload);
			return {
				...state,
				proposals: action.payload,
				filteredProposals: action.payload,
			};
		case PROPOSAL.FETCHED_PROJECT_PROPOSAL:
			// console.log("Inside Actions: FETCHED_PROJECT_PROPOSAL", action.payload);
			// console.log(selectedProposal);
			let { proposal } = action.payload;
			return {
				...state,
				selectedProposal: {
					...state.selectedProposal,
					proposal: { ...proposal },
				},
			};
		case SUBMITTED_PROPOSAL:
			// console.log("SUBMITTED_PROPOSAL: ", action.payload);
			// console.log(selectedProposal);
			return {
				...state,
				proposalFrame: "LIST",
			};
		case FETCHED_PROPOSAL_ADMIN_PERMISSION:
			console.log("FETCHED_PROPOSAL_ADMIN_PERMISSION: ", action.payload);
			return {
				...state,
				isAdmin: action.payload,
			};
		case FETCHED_PROPOSAL_ACTIVITIES:
			console.log("FETCHED_PROPOSAL_ACTIVITIES", state);
			return {
				...state,
				activities: action.payload,
			};
		case UNMOUNTED_PROPOSAL_DATA:
			console.log("FETCHED_PROPOSAL_ACTIVITIES", state);
			return {
				...state,
				selectedProposal: null,
			};
		case FILTERED_PROPOSAL:
			return {
				...state,
				filteredProposals: action.payload,
			};
		case SET_SEARCH_VAL:
			return {
				...state,
				searchVal: action.payload,
			};
		default:
			return state;
	}
};
