import history from "../../history";
import {
	faTachometerAlt as faDashboard,
	faUser,
	faCogs,
	faDatabase,
} from "@fortawesome/free-solid-svg-icons";
import {
	AppstoreOutlined,
	DashboardOutlined,
	TeamOutlined,
	ClusterOutlined,
} from "@ant-design/icons";
import { getEffectiveConstraintOfTypeParameter } from "typescript";
export const NAV_ITEM = {
	DASHBOARD: "Dashboards",
	USER_ADMINISTRATION: "User Administration",
};
export const LEFT_NAV = [

	{
		order: 100,
		title: NAV_ITEM.DASHBOARD,
		icon: () => {
			return <DashboardOutlined />;
		},
		path: "/",
		onClick: () => {
			history.push("/");
		},
		roles: ["admin", "super_admin"],
	},
	// {
	// 	order: 200,
	// 	title: "My Account",
	// 	icon: faUser,
	// 	children: [
	// 		{
	// 			title: "Settings",
	// 			onClick: (data) => {
	// 				if (data) {
	// 					const { userId } = data;
	// 					history.push(`/account/profile/${userId ? userId : ""}`);
	// 				}
	// 			},
	// 		},
	// 		{
	// 			title: "Signout",
	// 			onClick: () => {
	// 				history.push(`/signout`);
	// 			},
	// 		},
	// 	],
	// },
	{
		title: NAV_ITEM.USER_ADMINISTRATION,
		icon: () => {
			return <TeamOutlined />;
		},
		path: "/admin/dashboard/users",
		onClick: () => {
			history.push("/admin/dashboard/users");
		},
		roles: ["admin", "super_admin", "user_admin"],
	},
	{
		order: 300,
		title: "System Management",
		icon: () => {
			return <ClusterOutlined />;
		},
		children: [
			{
				title: "System",
				path: "/admin/dashboard/system",
				onClick: () => {
					history.push("/admin/dashboard/system");
				},
			},
		],

		roles: ["admin", "super_admin"],
	},
	{
		order: 400,
		title: "Applications",
		icon: () => {
			return <AppstoreOutlined />;
		},
		children: [
			{
				title: "Proposals",
				path: "/proposals",
				onClick: () => {
					history.push("/proposals");
				},
			},
			{
				title: "Scholarships",
				path: "/scholarships",
				onClick: () => {
					history.push("/scholarships");
				},
			},
		],
	},
];

export const getIcon = (navItem) => {
	switch (navItem) {
		case NAV_ITEM.DASHBOARD:
			return <DashboardOutlined />;
	}
};
