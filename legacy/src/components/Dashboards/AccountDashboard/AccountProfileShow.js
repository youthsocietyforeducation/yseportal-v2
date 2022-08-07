import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { PageTitle } from "../../ReusableComponents/Page";
import DashboardNavigator from "../DashboardNavigator";

import {
	Tabs,
	Divider,
	List,
	Image,
	Modal,
	Form,
	Input,
	message,
	Spin,
} from "antd";
import ManageRoleUI from "../AdminDashboard/Users/MangeRoleUI";
import * as _ from "lodash";
import { hasOneOfTheRoles } from "../../../utils";
import {
	getAccountProfile,
	changeUserPassword,
	uploadProfilePicture,
} from "../../../redux/actions";
import {
	BSCancelButton,
	BSEditButton,
	BSSubmitButton,
} from "../../ReusableComponents/Buttons/BSButton";
import UserEditProfileForm from "./forms/UserEditProfileForm";
import AdminEditProfileForm from "./forms/AdminEditProfileForm";
import { AntDProfileUploadBtn } from "./ui/AntDProfileUploadBtn";
const { TabPane } = Tabs;

const ACTIONS = {
	USER_CHANGE_PASSWORD: "USER_CHANGE_PASSWORD",
	ADMIN_CHANGE_PASSWORD: "ADMIN_CHANGE_PASSWORD",
	USER_EDIT_PROFILE: "USER_EDIT_PROFILE",
	ADMIN_EDIT_PROFILE: "ADMIN_EDIT_PROFILE",
};
class AccountProfileShow extends React.Component {
	constructor(props) {
		super();
		this.state = {
			action: "",
			modalVisible: false,
			loading: false,
		};
	}
	componentDidMount = () => {
		this.props.getAccountProfile(this.props.userId);
	};

	renderRestrictedTabs = () => {
		return (
			<Row className="mt-3">
				<Divider />
				<Col>
					<Tabs defaultActiveKey="1" type="card" size={"small"}>
						<TabPane tab="Roles" key="1">
							<ManageRoleUI userId={this.props.userId} />
						</TabPane>
					</Tabs>
				</Col>
			</Row>
		);
	};

	submitPasswordChange = (vals) => {
		console.log("submitPassworChange", vals);
		const { currPassword, newPassword } = vals;

		this.props.changeUserPassword(currPassword, newPassword).then(() => {
			this.setState({
				modalVisible: false,
			});
		});
	};

	onSendPasswordResetLinkClicked = () => {
		console.log("onSendPasswordResetLinkClicked");
	};

	renderSecurityTab = (passedObj) => {
		const { isCurrentUser, isAdmin } = passedObj;
		return (
			<TabPane tab="Security" key="2">
				{isCurrentUser ? (
					<Button
						size={"sm"}
						onClick={() => {
							this.setState({
								modalVisible: true,
								action: ACTIONS.USER_CHANGE_PASSWORD,
							});
						}}>
						Change Password
					</Button>
				) : (
					<Button onClick={this.onSendPasswordResetLinkClicked}>
						Send Password Reset Link
					</Button>
				)}
			</TabPane>
		);
	};

	handleModalCancel = () => {
		this.setState({
			modalVisible: false,
		});
	};

	renderModalTitle = (action) => {
		switch (action) {
			case ACTIONS.USER_CHANGE_PASSWORD:
				return "Change Password";
			case ACTIONS.USER_EDIT_PROFILE:
				return "Edit Your Profile";
			case ACTIONS.ADMIN_EDIT_PROFILE:
				return "Edit User's Profile";
		}
	};

	renderModalBody = (action) => {
		switch (action) {
			case ACTIONS.USER_CHANGE_PASSWORD:
				return (
					<ChangeUserPasswordForm
						onFinish={this.submitPasswordChange}
						onCancel={this.handleModalCancel}
					/>
				);
			case ACTIONS.USER_EDIT_PROFILE:
				return (
					<UserEditProfileForm
						onFinish={this.submitPasswordChange}
						onCancel={this.handleModalCancel}
					/>
				);
			case ACTIONS.ADMIN_EDIT_PROFILE:
				return (
					<AdminEditProfileForm
						onFinish={this.submitPasswordChange}
						onCancel={this.handleModalCancel}
					/>
				);
		}
	};

	renderModal = () => {
		const { modalVisible, loading, action } = this.state;
		return (
			<Modal
				width={"50%"}
				visible={modalVisible}
				title={this.renderModalTitle(action)}
				onCancel={this.handleModalCancel}
				footer={null}>
				{this.renderModalBody(action)}
			</Modal>
		);
	};

	editProfileClicked = (passedObj) => {
		const { isCurrentUser, isAdmin } = passedObj;
		if ((isCurrentUser && isAdmin) || (isAdmin && !isCurrentUser)) {
			this.setState({ modalVisible: true, action: ACTIONS.ADMIN_EDIT_PROFILE });
		} else if (isCurrentUser && !isAdmin) {
			this.setState({ modalVisible: true, action: ACTIONS.USER_EDIT_PROFILE });
		} else {
			console.log("editProfileClicked: no Options");
		}
	};

	onProfileUpload = ({ file }) => {
		const { account } = this.props;
		const userId = account && account.uid;
		const displayName = (account && account.displayName) || account.firstName;
		console.log("Upload onProfileUpload file", file);
		this.setState({ loading: true });
		this.props
			.uploadProfilePicture({ file, userId, displayName })
			.finally(() => {
				this.setState({ loading: false });
			});
	};

	render = () => {
		const { account, userId, keyedUsers, authAccount } = this.props;
		console.log("AccountProfileShow userId", userId);
		const userRoles =
			(authAccount && authAccount.private && authAccount.private.roles) || [];
		const isCurrentUser = authAccount && authAccount.uid === userId;
		const isAdmin = hasOneOfTheRoles(
			["admin", "super_admin", "user_admin"],
			userRoles
		);
		const displayName =
			account && account.displayName && account.displayName.toString();
		const profileImageURL = account && account.profileImageURL;
		const { loading } = this.state;
		return (
			<div>
				<Container>
					{/* <PageHeader
						className="site-page-header"
						title="User Profile"
						subTitle="Kaung Yang"
						extra={[
							<Button key="3">Operation</Button>,
							<Button key="2">Operation</Button>,
							<Button key="1" type="primary">
								Primary
							</Button>,
						]}
					/> */}
					<DashboardNavigator />
					<PageTitle title={displayName ? displayName : "User Profile"} />
					<Container>
						<Row>
							<Col>
								<Tabs tabPosition={"left"} defaultActiveKey="1" size={"small"}>
									<TabPane tab="Profile" key="1">
										<Row>
											<Col sm={4} className="d-flex justify-content-center">
												<div className="i-profile-image d-flex flex-column align-items-center">
													<Spin spinning={loading}>
														<Image
															className="fluid"
															preview={false}
															src={
																profileImageURL || this.props.defaultProfileURL
															}
														/>
													</Spin>
													<AntDProfileUploadBtn
														onChange={this.onProfileUpload}
														className="mt-3"
													/>
												</div>
											</Col>
											<Col sm={8}>
												<List
													header={
														isCurrentUser || isAdmin ? (
															<div className="d-flex justify-content-end">
																<BSEditButton
																	onClick={() => {
																		this.editProfileClicked({
																			isCurrentUser,
																			isAdmin,
																		});
																	}}
																/>
															</div>
														) : null
													}
													size="small"
													bordered
													dataSource={_.toPairs(
														_.pick(keyedUsers[userId], [
															"email",
															"displayName",
															"firstName",
															"lastName",
															"branch",
															"department",
															"phoneNumber",
															"uid",
														])
													)}
													renderItem={(item) => (
														<List.Item>
															<span className="mr-2">{item[0]}</span>
															<span>{item[1]}</span>
														</List.Item>
													)}
												/>
											</Col>
										</Row>
									</TabPane>
									{isCurrentUser || isAdmin
										? this.renderSecurityTab({ isCurrentUser, isAdmin })
										: null}
								</Tabs>
							</Col>
						</Row>
						{isAdmin ? this.renderRestrictedTabs() : null}
					</Container>
					{/* <PageTitle title={"User Profile"} />
					<Tab.Container id="left-tabs-example" defaultActiveKey="first">
						<Row>
							<Col sm={3}>
								<Nav variant="pills" className="flex-column">
									<Nav.Item>
										<Nav.Link eventKey="first">Profile</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey="second">Security</Nav.Link>
									</Nav.Item>
								</Nav>
							</Col>
							<Col sm={9}>
								<Tab.Content>
									<Tab.Pane eventKey="first">Contente 1</Tab.Pane>
									<Tab.Pane eventKey="second">Contente 2</Tab.Pane>
								</Tab.Content>
							</Col>
						</Row>
					</Tab.Container> */}
				</Container>
				{this.renderModal()}
			</div>
			// <AccountProfileForm initialValues={account} userId={this.props.userId} />
		);
	};
}

const ChangeUserPasswordForm = ({ onFinish, onCancel }) => {
	const [form] = Form.useForm();

	return (
		<Form
			form={form}
			onFinish={(vals) => {
				form
					.validateFields()
					.then((res) => {
						const { currPassword, newPassword, newPasswordAgain } = res;
						if (newPassword !== newPasswordAgain) {
							return Promise.reject({
								code: "failed-condition",
								message: "passwords aren't the same",
							});
						} else {
							console.log("validateFields res", res);
							form.resetFields();
							onFinish(vals);
						}
					})
					.catch((err) => {
						message.error(`${err.message}`);
					});
			}}
			layout="vertical"
			size="default">
			<Form.Item
				name="currPassword"
				label="Current Password"
				rules={[
					{ required: true, message: "Please input your current password!" },
				]}>
				<Input.Password allowClear />
			</Form.Item>
			<Form.Item
				name="newPassword"
				label="New Password"
				rules={[
					{ required: true, message: "Please input your new password!" },
					({ getFieldValue }) => ({
						validator(rule, value) {
							console.log("validateFields rule", rule);
							let regNumber = /[0-9]/;
							let regUpper = /[A-Z]/;
							let regSpecial = /[!@#$%^&*(),.?":{}|<>]/;

							/** Uncomment these in production */
							if (
								!regUpper.test(value) ||
								!regNumber.test(value) ||
								!regSpecial.test(value)
							) {
								return Promise.reject(
									"Passwords must contain 1 Uppercase, 1 Number and 1 special character"
								);
							}

							if (value.length < 8) {
								return Promise.reject(
									"Passwords must be longer than 8 characters"
								);
							}

							if (value.length > 20) {
								return Promise.reject(
									"Passwords must be shorter than 20 characters"
								);
							}

							return Promise.resolve();
						},
					}),
				]}>
				<Input.Password allowClear />
			</Form.Item>
			<Form.Item
				name="newPasswordAgain"
				label="Re-Enter New Password"
				rules={[
					{ required: true, message: "Please re-neter your new password!" },

					({ getFieldValue }) => ({
						validator(rule, value) {
							if (!value || getFieldValue("newPassword") === value) {
								return Promise.resolve();
							}
							return Promise.reject("The password must be the same!");
						},
					}),
				]}>
				<Input.Password allowClear />
			</Form.Item>

			<div className="mt-2 d-flex justify-content-end">
				<BSCancelButton
					onClick={() => {
						onCancel && onCancel();
						form.resetFields();
					}}
					className="mr-2"
				/>
				<BSSubmitButton />
			</div>
		</Form>
	);
};

const mapStateToProps = (state) => {
	console.log("AccountProfileShow.js", state);
	return {
		authAccount: state.auth.account,
		account: state.accountManagement.selectedAccount,
		keyedUsers: (state.system.users && state.system.users.keyed) || {},
		defaultProfileURL: state.system.defaultProfileURL,
	};
};

AccountProfileShow = connect(mapStateToProps, {
	getAccountProfile,
	changeUserPassword,
	uploadProfilePicture,
})(AccountProfileShow);

export default AccountProfileShow;
