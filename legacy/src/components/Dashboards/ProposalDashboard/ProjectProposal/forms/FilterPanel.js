import React from "react";
import { Form, Input, message, Upload, Select, Button, Checkbox } from "antd";
import {
	BSCancelButton,
	BSSubmitButton,
} from "../../../../ReusableComponents/Buttons/BSButton";
import * as _ from "lodash";
const { Option } = Select;
const FilterPanel = ({ onFinish, dataObj }) => {
	const { branches, departments, status } = dataObj;
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

	return (
		<>
			<Form
				onFieldsChange={(changedFields, allFields) => {
					console.log("onFilter, onChange changedFields", changedFields);
					console.log("onFilter, onChange allFields", allFields);
				}}
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
				<Form.Item name="branches" label="Branches">
					<Checkbox.Group className="mb-2 d-flex flex-column">
						{branches &&
							branches.map((o, i) => (
								<Checkbox
									className="m-0"
									value={o.value}
									key={`${o.label}-${i}`}>
									{o.label}
								</Checkbox>
							))}
					</Checkbox.Group>
				</Form.Item>
				<Form.Item name="departments" label="Departments">
					<Checkbox.Group className="mb-2 d-flex flex-column">
						{departments &&
							departments.map((o, i) => (
								<Checkbox
									className="m-0"
									value={o.value}
									key={`${o.label}-${i}`}>
									{o.label}
								</Checkbox>
							))}
					</Checkbox.Group>
				</Form.Item>
				<Form.Item name="status" label="Status">
					<Checkbox.Group className="mb-2 d-flex flex-column">
						{status &&
							status.map((o, i) => (
								<Checkbox
									className="m-0"
									value={o.value}
									key={`${o.label}-${i}`}>
									{o.label}
								</Checkbox>
							))}
					</Checkbox.Group>
				</Form.Item>
				{/* <div className="mt-3 d-flex justify-content-end">
					<BSCancelButton
						onClick={() => {
							onCancel && onCancel();
							form.resetFields();
						}}
						className="mr-2"
					/>
					<BSSubmitButton />
				</div> */}
			</Form>
		</>
	);
};

export default FilterPanel;
