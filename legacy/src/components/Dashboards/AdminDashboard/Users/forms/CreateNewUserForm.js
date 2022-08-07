import React from "react";
import { Form, Input, message } from "antd";
import {
	BSCancelButton,
	BSSubmitButton,
} from "../../../../ReusableComponents/Buttons/BSButton";
const CreateNewUserForm = ({ onFinish, onCancel }) => {
	const [form] = Form.useForm();

	return (
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
				name="displayName"
				label="Display Name"
				rules={[
					{ required: true, message: "Please input your current password!" },
				]}>
				<Input allowClear />
			</Form.Item>
			<Form.Item
				name="phoneNumber"
				label="Phone Number"
				rules={[
					{ required: true, message: "Please input your new password!" },
					({ getFieldValue }) => ({
						validator(rule, value) {
							console.log("validateFields rule", rule);
							let regNumber = /[0-9]/;
							let regUpper = /[A-Z]/;
							let regSpecial = /[!@#$%^&*(),.?":{}|<>]/;

							/** Uncomment these in production */
							// if (
							// 	!regUpper.test(value) ||
							// 	!regNumber.test(value) ||
							// 	!regSpecial.test(value)
							// ) {
							// 	return Promise.reject(
							// 		"Passwords must contain 1 Uppercase, 1 Number and 1 special character"
							// 	);
							// }

							// if (value.length < 8) {
							// 	return Promise.reject(
							// 		"Passwords must be longer than 8 characters"
							// 	);
							// }

							// if (value.length > 20) {
							// 	return Promise.reject(
							// 		"Passwords must be shorter than 20 characters"
							// 	);
							// }

							return Promise.resolve();
						},
					}),
				]}>
				<Input allowClear />
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

export default CreateNewUserForm;
