import React from "react";
import { Form, Input, message, Upload, Select, Button } from "antd";
import {
	BSCancelButton,
	BSSubmitButton,
} from "../../../../ReusableComponents/Buttons/BSButton";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import AntDUploadPreview from "../../../../ReusableComponents/Upload/AntDUploadPreview";
import * as _ from "lodash";
const { Option } = Select;
const ProjectProposalCreateForm = ({ onFinish, onCancel, dataObj }) => {
	const { branches, departments, users } = dataObj;
	const [form] = Form.useForm();
	console.log("renderOptions", dataObj);
	const renderOptions = (options) => {
		console.log("renderOptions", options);
		return (
			options &&
			options.map((opt, index) => {
				return (
					<Option key={`${opt.value}`}>
						{opt.label ? opt.label.toString() : "No Label"}
					</Option>
				);
			})
		);
	};

	const processFiles = (e) => {
		console.log("Proposal processFiles", e);
		return e && e.fileList;
	};

	const onFill = () => {
		const date = new Date().toString();
		const randomBranchInt = Math.floor(Math.random() * branches.length) || 0;
		const randomDepartmentInt =
			Math.floor(Math.random() * departments.length) || 0;
		const randomUserNumber = Math.floor(Math.random() * users.length) || 0;
		let randomUserInts = [];
		for (var i = 0; i < randomUserNumber; i++) {
			const randomUserInt = Math.floor(Math.random() * users.length) || 0;
			randomUserInts.push(randomUserInt);
		}
		form.setFieldsValue({
			title: "test title " + date,
			description: "test description " + date,
			branch: branches[randomBranchInt].value,
			department: departments[randomDepartmentInt].value,
			coAuthors: [..._.map(randomUserInts, (e) => users[e].uid)] || [],
		});
	};

	return (
		<>
			<Button danger className="mb-2" onClick={onFill}>
				TEST: Fill Form{" "}
			</Button>
			<Form
				form={form}
				onFinish={(vals) => {
					form
						.validateFields()
						.then((res) => {
							// const { currPassword, newPassword, newPasswordAgain } = res;
							// if (newPassword !== newPasswordAgain) {
							// 	return Promise.reject({
							// 		code: "failed-condition",
							// 		message: "passwords aren't the same",
							// 	});
							// } else {
							// 	console.log("validateFields res", res);
							// 	form.resetFields();
							// 	onFinish(vals);
							// }
							onFinish(vals);
						})
						.catch((err) => {
							message.error(`${err.message}`);
						});
				}}
				layout="vertical"
				size="default">
				<Form.Item
					name="title"
					label="Title"
					rules={[{ required: true, message: "Title cannot be empty" }]}>
					<Input autoComplete="off" allowClear />
				</Form.Item>
				<Form.Item
					name="description"
					label="Description"
					rules={[
						{ required: true, message: "Description cannot be empty!" },
						({ getFieldValue }) => ({
							validator(rule, value) {
								console.log("validateFields rule", rule);
								return Promise.resolve();
							},
						}),
					]}>
					<Input.TextArea allowClear />
				</Form.Item>
				<Form.Item
					name="branch"
					label="Branch"
					rules={[
						{ required: true, message: "Please input your current password!" },
					]}>
					<Select placeholder="Please select a branch">
						{renderOptions(branches || [])}
					</Select>
				</Form.Item>
				<Form.Item
					name="department"
					label="Department"
					rules={[
						{ required: true, message: "Please input your current password!" },
					]}>
					<Select placeholder="Please select a department">
						{renderOptions(departments || [])}
					</Select>
				</Form.Item>
				<Form.Item
					name="coAuthors"
					label="Co-Author(s)"
					rules={[
						{ required: false, message: "Please input your current password!" },
					]}>
					<Select
						mode="multiple"
						placeholder="Please select"
						filterOption={(input, option) => {
							console.log("filterOption input", input);
							console.log("filterOption option", option);
							return (
								option.props.children
									.toLowerCase()
									.indexOf(input.toLowerCase()) >= 0
							);
						}}
						// tagRender={(props) => {
						// 	const { label, value, closable, onClose } = props;
						// 	const isSuperAdmin = value === "super_admin";
						// 	return (
						// 		<Tooltip
						// 			placement="top"
						// 			title={isSuperAdmin ? "You cannot delete super_admin" : ""}>
						// 			<Tag
						// 				color={isSuperAdmin ? "red" : "default"}
						// 				closable={isSuperAdmin ? false : true}
						// 				onClose={onClose}>
						// 				{label}
						// 			</Tag>
						// 		</Tooltip>
						// 	);
						// }}
						// onDeselect={this.onDeselect}>
					>
						{users &&
							users.map((user) => {
								return (
									<Option
										key={`${user.uid}-${user.displayName}`}
										value={user.uid}>
										{user.displayName || user.email}
									</Option>
								);
							})}
					</Select>
				</Form.Item>
				<Form.Item
					name="files"
					label="Files"
					valuePropName="fileList"
					getValueFromEvent={processFiles}
					rules={[
						{ required: true, message: "Please upload at least 1 file!" },
					]}>
					{/* <Upload.Dragger
						accept={
							".jpg, .png, .jpeg, application/doc, application/docx, application/pdf"
						}
						previewFile={(props) => {
							console.log("previewFile props", props);
						}}
						showUploadList={true}
						customRequest={processFiles}
						name="files"
						multiple>
						<p className="ant-upload-drag-icon">
							<InboxOutlined />
						</p>
						<p className="ant-upload-text">
							Click or drag file to this area to upload
						</p>
						<p className="ant-upload-hint">
							Support for a single or bulk upload.
						</p>
					</Upload.Dragger> */}
					<AntDUploadPreview customRequest={processFiles} />
				</Form.Item>

				<div className="mt-3 d-flex justify-content-end">
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
		</>
	);
};

export default ProjectProposalCreateForm;
