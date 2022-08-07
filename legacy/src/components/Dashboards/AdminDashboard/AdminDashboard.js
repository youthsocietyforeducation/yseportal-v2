import React, { Component } from "react";
import { connect } from "react-redux";

import DashboardNavigator from "../DashboardNavigator";
import AdminUserManagementDashboard from "./Users/AdminUserManagementDashboard";
import AdminSystemDashboard from "./System/AdminSystemDashboard";
import { Row, Col, Container } from "react-bootstrap";
import { ROUTES } from "../../Routes/constants";
import BranchList from "./System/Branches/BranchList";
import DepartmentList from "./System/Departments/DepartmentList";
import RoleManagerUI from "./System/Roles/RoleManagerUI";
import FAQList from "../../../components/Features/Faqs/Admin/FAQList";
class AdminDashboard extends Component {
	componentDidMount() {
		console.log("AdminDashboard ComponentDidMount");
		console.log(this.props.page);
	}

	renderDisplay = (screen) => {
		console.log("AdminDashboard COMP: renderDisplay(): ", screen);
		switch (screen) {
			case ROUTES.ADMIN.USERS.page:
				return <AdminUserManagementDashboard />;
			case ROUTES.ADMIN.BRANCHES.page:
				return <BranchList />;
			case ROUTES.ADMIN.DEPARTMENTS.page:
				return <DepartmentList />;
			case ROUTES.ADMIN.ROLES.page:
				return <RoleManagerUI />;
			case ROUTES.ADMIN.SCHOLARSHIP.page:
				return null;
			case ROUTES.ADMIN.FAQS.page:
				return <FAQList />;
			case ROUTES.ADMIN.SYSTEM.page:
				return <AdminSystemDashboard />;

			default:
				return null;
		}
	};

	render() {
		console.log("INFO: render(): AdminDashboard: ", this.props);
		return (
			<div className="dashboard-frame m-auto">
				<Row>
					<Col>{this.renderDisplay(this.props.page)}</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {};
};

export default connect(mapStateToProps, {})(AdminDashboard);
