import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import authReducer from "./authReducer";
import proposalReducer from "./proposalReducer";
import accountManagementReducer from "./accountManagementReducer";
import systemReducer from "./systemReducer";
import { SIGNED_OUT } from "../types";
import navReducer from "./navReducer";

const appReducer = combineReducers({
	form: formReducer,
	auth: authReducer,
	proposal: proposalReducer,
	accountManagement: accountManagementReducer,
	system: systemReducer,
	nav: navReducer,
});

const rootReducer = (state, action) => {
	if (action.type === SIGNED_OUT) {
		state = {};
		console.log("This State xxx", state);
	}
	return appReducer(state, action);
};

export default rootReducer;
