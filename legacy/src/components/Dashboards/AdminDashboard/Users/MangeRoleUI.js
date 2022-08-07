import React from "react";
import { connect } from "react-redux";
import { Table, Modal, Transfer, Select, Form, Tag, Tooltip } from "antd";
import {
	fetchUserRoles,
	updateUserRoles,
	fetchSysRoles,
} from "../../../../redux/actions";
import { sortByDate } from "../../../../utils/SortStrategies";
import {
	BSNewButton,
	BSCancelButton,
	BSSubmitButton,
	BSEditButton,
} from "../../../ReusableComponents/Buttons/BSButton";
const { Option } = Select;
class ManageRoleUI extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			loading: false,
			action: "",
			columns: [
				{
					title: "Role",
					dataIndex: "role",
					sorter: (a, b) => {
						return a.role.localeCompare(b.role);
					},
					render: (text) => <a>{text}</a>,
				},
				{
					title: "Assigned By",
					dataIndex: "createdBy",
					sorter: (a, b) => {
						return sortByDate(a, b);
					},
					render: (text) => {
						console.log("ManageRoleUI AssignedBy text", text);
						if (text === "system") {
							return <a>{text}</a>;
						} else {
							const { keyedUsers } = this.props;
							const keyedUser = keyedUsers[text];
							return (
								<a>
									{keyedUser &&
										keyedUser.displayName &&
										keyedUser.displayName.toString()}
								</a>
							);
						}
					},
				},
				{
					title: "Updated",
					dataIndex: "updated",
					sorter: (a, b) => {
						return sortByDate(a, b);
					},
					render: (text) => <a>{text}</a>,
				},
			],
		};
	}

	componentDidMount = () => {
		// this.props.fetchSysRoles();
		this.props.fetchUserRoles(this.props.userId);
	};

	handleCancel = () => {
		this.setState({ modalVisible: false });
	};

	handleChange = (value) => {
		console.log(`ManageRoleUI selected ${value}`);
	};

	onDeselect = (value) => {
		console.log(`ManageRoleUI deselected ${value}`);
	};

	onFinish = (vals) => {
		console.log("ManageRoleUI onFinish", vals);
		const { selectedAccountRoles, userId } = this.props;
		console.log("ManageRoleUI previous roles", selectedAccountRoles);
		this.props.updateUserRoles({
			...vals,
			prevRoles: selectedAccountRoles.map((role) => role.role),
			userId: userId,
		});
	};

	renderModalBody = () => {
		const { roles, selectedAccountRoles } = this.props;
		return (
			<>
				<Form layout="vertical" size="large" onFinish={this.onFinish}>
					<Form.Item
						name="roles"
						label="Roles"
						initialValue={[
							...(selectedAccountRoles &&
								selectedAccountRoles.map((role) => role.role)),
						]}>
						<Select
							mode="multiple"
							style={{ width: "75%" }}
							placeholder="Please select"
							onChange={this.handleChange}
							tagRender={(props) => {
								const { label, value, closable, onClose } = props;
								const isSuperAdmin = value === "super_admin";
								return (
									<Tooltip
										placement="top"
										title={isSuperAdmin ? "You cannot delete super_admin" : ""}>
										<Tag
											color={isSuperAdmin ? "red" : "default"}
											closable={isSuperAdmin ? false : true}
											onClose={onClose}>
											{label}
										</Tag>
									</Tooltip>
								);
							}}
							onDeselect={this.onDeselect}>
							{roles &&
								roles.map((role) => {
									return <Option key={role.value}>{role.label}</Option>;
								})}
						</Select>
					</Form.Item>
					<div className="d-flex justify-content-end">
						<BSCancelButton
							onClick={() => this.setState({ modalVisible: false })}
							className="mr-2"
						/>
						<BSSubmitButton
							onClick={() => this.setState({ modalVisible: false })}
						/>
					</div>
				</Form>
			</>
		);
	};

	renderModal = () => {
		const { modalVisible, loading, action } = this.state;
		return (
			<Modal
				width={"50%"}
				visible={modalVisible}
				title={"Add a role"}
				onCancel={this.handleCancel}
				footer={null}>
				{this.renderModalBody(action)}
			</Modal>
		);
	};

	render = () => {
		const { selectedAccountRoles } = this.props;
		console.log("ManageRoleUI userId", this.props.userId);
		console.log("ManageRoleUI selectedAccountRoles", this.props);

		return (
			<div>
				<BSEditButton onClick={() => this.setState({ modalVisible: true })} />
				{selectedAccountRoles && selectedAccountRoles.length > 0 ? (
					<Table
						pagination={{ showSizeChanger: true, position: ["topRight"] }}
						size="small"
						rowKey="role"
						columns={this.state.columns || []}
						dataSource={selectedAccountRoles || []}
					/>
				) : null}
				{this.renderModal()}
			</div>
		);
	};
}

const mapStateToProps = (state) => {
	return {
		selectedAccountRoles: state.accountManagement.selectedAccountRoles || [],
		roles: (state.system.roles && state.system.roles.data) || [],
		keyedUsers: (state.system.users && state.system.users.keyed) || {},
	};
};

export default connect(mapStateToProps, {
	fetchSysRoles,
	fetchUserRoles,
	updateUserRoles,
})(ManageRoleUI);
