import history from "../../../../history";
import { ROUTES } from "../../../Routes/constants";
import lunr from "lunr-mutable-indexes";
import * as _ from "lodash";

export const NAV_SYSTEM_CONFIGURATIONS = [
	{
		title: "Branches",
		description: "Configure Yseportal's static branches",
		onClick: () => {
			history.push(ROUTES.ADMIN.BRANCHES.path);
		},
	},
	{
		title: "Departments",
		description: "Some Department Description",
		onClick: () => {
			history.push(ROUTES.ADMIN.DEPARTMENTS.path);
		},
	},
	{
		title: "Roles",
		description: "Some Roles Description",
		onClick: () => {
			history.push(ROUTES.ADMIN.ROLES.path);
		},
	},
	{
		title: "FAQs",
		description: "Create and edit FAQs for different applications",
		onClick: () => {
			history.push(ROUTES.ADMIN.FAQS.path);
		},
	},
	{
		title: "System Annoucement",
		description: "Create and edit FAQs for different applications",
		onClick: () => {
			history.push(ROUTES.ADMIN.BRANCHES.path);
		},
	},
];

export const ADMIN_SYSTEM_DASHBOARD_INDEX = lunr(function () {
	this.ref("title");
	this.field("title");
	this.field("description");
});

NAV_SYSTEM_CONFIGURATIONS.forEach((doc) => {
	ADMIN_SYSTEM_DASHBOARD_INDEX.add(doc);
});
