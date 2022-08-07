import { ROUTES } from "../../Routes/constants";

/**
 * Updated: August 2nd 2020
 * Author: Kaung Yang
 *
 * HomeDashboard constants page is used to configure the tabs seen on
 * the home dashboard.
 */

export const TABS = {
	APPLICATIONS: "Applications",
	ADMINISTRATION: "Administration",
};

export const APPS = [
	{
		title: "Project Proposals",
		text: "Submit Proposals",
		link: ROUTES.PROPOSALS.LIST,
	},
];

export const ADMIN_APPS = [
	{
		title: "System Management",
		text: "Manage system related features",
		link: "/admin/dashboard",
	},
	{
		title: "User Management",
		text: "Control users using roles",
		link: "/admin/manage/users",
	},
];
