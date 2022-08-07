import { db, fb } from "../../firebase";
import history from "../../history";
import { NAV } from "../types";
import { USERS } from "../../constants";
import { loading, receivedError, receivedMessage } from "./commonActions";
import { LEFT_NAV } from "../../components/LeftNav/constants";
import { LEFT_NAV_SEARCH_INDEX } from "../../redux/search";
import * as _ from "lodash";

export const setOriginalState = () => async (dispatch, getState) => {
	const {
		auth: { account },
	} = await getState();
	console.log("setLeftNavState account", account);

	const userRoles = account && account.private && account.private.roles;

	console.log("setOriginalState userRoles", userRoles);
	const leftNav = LEFT_NAV.filter((menu) => {
		const menuRoles = menu.roles || [];
		if (menuRoles.length === 0) {
			return true;
		}

		for (var i = 0; i < menuRoles.length; i++) {
			if (userRoles && userRoles.includes(menuRoles[i])) {
				return true;
			}
		}
	});
	buildLeftNavIndex(leftNav);

	console.log("setLeftNavState: leftNav", leftNav);
	dispatch({
		type: NAV.INITIATED_LEFT_NAV,
		payload: leftNav,
	});
};

const buildLeftNavIndex = (leftNav) => {
	leftNav.forEach((doc) => {
		let newObj = {
			..._.omit(doc, ["icon"]),
			children: doc.children && doc.children.map((e) => e.title),
		};
		console.log("lunr newObj", newObj);
		LEFT_NAV_SEARCH_INDEX.add({ ...newObj });
	});
};

export const updateSearchResults = (searchResults) => (dispatch, getState) => {
	console.log("lunr searchLeftNav", searchResults);
	const state = getState();
	const { nav } = state;
	console.log("lunr nav", nav);
	const leftNav = nav.leftNav;
	const filtered = leftNav.filter((menu) => {
		const title = menu.title;
		console.log("lunr title", title);
		const results = searchResults.map((searchItem) => {
			return searchItem.ref;
		});
		return results.includes(title);
	});

	dispatch({
		type: NAV.SEARCH.UPDATED_SEARCH_RESULTS,
		payload: filtered || [],
	});
};
