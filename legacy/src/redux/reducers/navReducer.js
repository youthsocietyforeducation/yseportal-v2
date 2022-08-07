import { LEFT_NAV } from "../../components/LeftNav/constants";
import {
	FETCHED_SYS_TABLES_USERS,
	FETCHED_SYS_TABLES_BRANCH,
	FETCHED_SYS_TABLES_DEPARTMENT,
	FETCHED_KEYED_SYS_TABLES_USERS,
	TOGGLED_DEBUG_MODE,
	TOGGLED_TEST_MODE,
	SYSTEM,
	NAV,
} from "../types";

const INITIAL_STATE = {
	leftNav: [],
	filteredLeftNav: [],
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case NAV.INITIATED_LEFT_NAV:
			return {
				...state,
				leftNav: [...action.payload],
				filteredLeftNav: [...action.payload],
			};
		case NAV.SEARCH.UPDATED_SEARCH_RESULTS:
			return {
				...state,
				filteredLeftNav: [...action.payload],
			};

		default:
			return state;
	}
};
