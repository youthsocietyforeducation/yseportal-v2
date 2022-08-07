import React from "react";
import { Route } from "react-router-dom";
import AdminDashboard from "../Dashboards/AdminDashboard/AdminDashboard";
import { ROUTES } from "./constants";

export default [
	<Route
		key="10"
		path="/admin"
		exact
		component={(props) => <AdminDashboard {...props} page={"HOME"} />}
	/>,
	<Route
		key="20"
		path="/admin/dashboard"
		exact
		component={(props) => <AdminDashboard {...props} page={"HOME"} />}
	/>,
	<Route
		key="30"
		path="/admin/dashboard/users"
		exact
		component={(props) => (
			<AdminDashboard {...props} page={ROUTES.ADMIN.USERS.page} />
		)}
	/>,
	<Route
		key={ROUTES.ADMIN.SYSTEM.path}
		path="/admin/dashboard/system"
		exact
		component={(props) => (
			<AdminDashboard {...props} page={ROUTES.ADMIN.SYSTEM.page} />
		)}
	/>,
	<Route
		key={ROUTES.ADMIN.BRANCHES.path}
		path={ROUTES.ADMIN.BRANCHES.path}
		exact
		component={(props) => (
			<AdminDashboard {...props} page={ROUTES.ADMIN.BRANCHES.page} />
		)}
	/>,
	<Route
		key={ROUTES.ADMIN.DEPARTMENTS.path}
		path={ROUTES.ADMIN.DEPARTMENTS.path}
		exact
		component={(props) => (
			<AdminDashboard {...props} page={ROUTES.ADMIN.DEPARTMENTS.page} />
		)}
	/>,
	<Route
		key={ROUTES.ADMIN.ROLES.path}
		path={ROUTES.ADMIN.ROLES.path}
		exact
		component={(props) => (
			<AdminDashboard {...props} page={ROUTES.ADMIN.ROLES.page} />
		)}
	/>,
	<Route
		key={ROUTES.ADMIN.FAQS.path}
		path={ROUTES.ADMIN.FAQS.path}
		exact
		component={(props) => (
			<AdminDashboard {...props} page={ROUTES.ADMIN.FAQS.page} />
		)}
	/>,

	<Route
		key="50"
		path="/admin/manage/users/new"
		exact
		component={(props) => (
			<AdminDashboard {...props} page={"MANAGE_USERS_CREATE"} />
		)}
	/>,

	// Add By May For FAQ Admin Route
	<Route
        key={ROUTES.ADMIN.FAQS.path}
        path={ROUTES.ADMIN.FAQS.path}
        exact
        component={(props) => (
            <AdminDashboard {...props} page={ROUTES.ADMIN.FAQS.page} />
		)}
	/>,
];
