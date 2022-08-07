import React from "react";
import { connect } from "react-redux";
import { PageTitle } from "../../../ReusableComponents/Page";
import { BSNewButton } from "../../../ReusableComponents/Buttons/BSButton";
import { Table, Tag, Space, Modal, Spin } from "antd";
import { Button } from "react-bootstrap";
import {
	getDateAndTimeAndZone,
	getDateAndTime,
	toLocaleDateString,
} from "../../../../utils/dateUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import * as _ from "lodash";
import AccountProfileShow from "../../AccountDashboard/AccountProfileShow";
import { BSViewButton } from "../../../ReusableComponents/Buttons/BSButton";
import history from "../../../../history";
import CreateNewUserForm from "./forms/CreateNewUserForm";
const ACTIONS = {
	VIEW: "View",
	CREATE_USER: "CREATE_USER",
	EDIT: "Edit",
};
class AdminUserManagementDashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			action: "",
			loading: false,
			selectedRecord: {},
			columns: [
				{
					title: "Updated",
					dataIndex: "updated",
					render: (text) => {
						const date = new Date(text).toString();
						return toLocaleDateString(date);
					},
					sorter: (a, b) => {
						const newDateA = new Date(a.updated).getTime();
						const newDateB = new Date(b.updated).getTime();
						return newDateA - newDateB;
					},
				},
				{
					title: "Email",
					dataIndex: "email",
					sorter: (a, b) => {
						return a.email.localeCompare(b.email);
					},
					render: (text, record) => {
						const verified = record.emailVerified;
						return (
							<>
								<a className="mr-2">{text}</a>
								{!verified ? <Tag color={"red"}>UNVERIFIED</Tag> : null}
							</>
						);
					},
				},
				{
					title: "Display Name",
					dataIndex: "displayName",
					sorter: (a, b) => {
						return a.displayName.localeCompare(b.displayName);
					},
					render: (text) => <a>{text}</a>,
				},
				{
					title: "Phone Number",
					dataIndex: "phoneNumber",
					sorter: (a, b) => {
						return a.displayName.localeCompare(b.displayName);
					},
					render: (text) => <a>{text}</a>,
				},
				{
					title: "Branch",
					dataIndex: "branch",
					sorter: (a, b) => {
						return a.branch.localeCompare(b.branch);
					},
					filters: [
						..._.map(this.props.branches, (e) => {
							console.log("filtering e", e);
							const obj = _.pick(e, ["value", "label"]);
							return {
								text: obj.label || "Label",
								value: obj.value || "",
							};
						}),
					],
					onFilter: (value, record) => record.branch.indexOf(value) === 0,
					render: (text) => <a>{text}</a>,
				},
				{
					title: "Department",
					dataIndex: "department",
					filters: [
						..._.map(this.props.departments, (e) => {
							console.log("filtering department", e);
							const obj = _.pick(e, ["value", "label"]);
							return {
								text: obj.label || "Label",
								value: obj.value || "",
							};
						}),
					],
					onFilter: (value, record) => record.department.indexOf(value) === 0,
					sorter: (a, b) => {
						return a.department.localeCompare(b.department);
					},
					render: (text) => <a>{text}</a>,
				},

				{
					title: "Active",
					dataIndex: "active",
					render: (text, record) => {
						const active = record.active;
						const verified = record.emailVerified;
						return (
							<Tag color={active ? "green" : "red"}>
								{record.active.toString().toUpperCase()}
							</Tag>
						);
					},
				},
				{
					title: "Action",
					key: "action",
					render: (text, record) => (
						<Space size="middle">
							<BSViewButton
								onClick={() => {
									this.setState({
										...this.state,
										modalVisible: true,
										selectedRecord: { ...record },
										action: ACTIONS.VIEW,
									});
									history.push(`/account/profile/${record.uid}`);
								}}
							/>
						</Space>
					),
				},
			],
		};
	}
	onTableChange = (e) => {
		console.log("onTableChange users", e);
	};

	renderModalTitle = (action) => {
		switch (action) {
			case ACTIONS.VIEW:
				return "Create Branch";
			case ACTIONS.EDIT:
				return "Edit Branch";
			case ACTIONS.CREATE_USER:
				return "Create New User";
		}
	};

	handleCancel = () => {
		this.setState({ modalVisible: false, action: "" });
	};

	renderModal = () => {
		const { modalVisible, loading, action } = this.state;
		return (
			<Modal
				width={"50%"}
				visible={modalVisible}
				title={this.renderModalTitle(action)}
				onCancel={this.handleCancel}
				footer={null}>
				{this.renderModalBody(action)}
			</Modal>
		);
	};

	renderModalBody = (action) => {
		const { selectedRecord, loading } = this.state;
		console.log("selectedRecord", selectedRecord);
		switch (action) {
			case ACTIONS.VIEW:
				return (
					<Spin spinning={loading}>
						{<pre>{JSON.stringify(selectedRecord, null, 2)}</pre>}
					</Spin>
				);
			case ACTIONS.CREATE_USER:
				return (
					<Spin spinning={loading}>
						<CreateNewUserForm onFinish={null} onCancel={this.handleCancel} />
						{/* <AccountProfileShow userId={selectedRecord && selectedRecord.uid} /> */}
					</Spin>
				);
		}
	};

	renderTableView = () => {
		const { users } = this.props;
		const { columns } = this.state;
		return (
			<Table
				pagination={{
					showQuickJumper: true,
					showSizeChanger: true,
					position: ["topRight"],
					defaultPageSize: 25,
				}}
				onChange={(e) => {
					this.onTableChange(e);
				}}
				size="small"
				rowKey={"uid"}
				dataSource={users || []}
				columns={columns || []}
			/>
		);
	};

	onCreateNewUser = () => {
		this.setState({ modalVisible: true, action: ACTIONS.CREATE_USER });
	};

	render = () => {
		console.log("AdminUserManagementDashboard", this.props);
		const { users, keyedUsers } = this.props;
		return (
			<div>
				<PageTitle title={"Users"} />
				<BSNewButton onClick={this.onCreateNewUser} />

				<div className="mt-3">{this.renderTableView()}</div>
				{this.renderModal()}
			</div>
		);
	};
}

const mapStateToProps = (state) => {
	console.log("AdminUserManagementDashboard state", state);
	return {
		users: state.system.users && state.system.users.data,
		keyedUsers: state.system.users && state.system.users.keyed,
		branches: state.system.branches && state.system.branches.data,
		departments: state.system.departments && state.system.departments.data,
	};
};
export default connect(mapStateToProps, {})(AdminUserManagementDashboard);
