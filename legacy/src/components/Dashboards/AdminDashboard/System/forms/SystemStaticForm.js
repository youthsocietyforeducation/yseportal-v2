import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { Form, Checkbox, Input, Button, Switch } from "antd";
const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 },
};
const tailLayout = {
	wrapperCol: { offset: 8, span: 16 },
};
class SystemStaticForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			label: "",
		};
	}

	onFinish = (vals) => {
		console.log("onFinish", vals);
		const { onFinish, onCancel } = this.props;
		onFinish && onFinish({ ...vals, label: vals.label.toString().trim() });
		onCancel && onCancel();
	};

	onFinishFailed = () => {};

	render = () => {
		const { initialValues, formControls } = this.props;
		return (
			<div>
				<Form
					{...layout}
					name="basic"
					initialValues={{ ...initialValues }}
					onFinish={this.onFinish}
					onFinishFailed={this.onFinishFailed}>
					<Form.Item
						label="Label"
						name="label"
						rules={[{ required: true, message: "Please fill out Label" }]}>
						<Input
							autoComplete="off"
							onChange={(e) => {
								this.setState({ label: e.target.value });
							}}
						/>
					</Form.Item>

					<Form.Item label="Active" name="active" valuePropName="checked">
						<Switch />
					</Form.Item>
					<div className="d-flex justify-content-end">
						{/* <Button
							onClick={() => onCancel && onCancel()}
							className="mr-2"
							htmlType="reset">
							Cancel
						</Button>
						<Button type="primary" htmlType="submit">
							Submit
						</Button> */}
						{formControls ? formControls : null}
					</div>
				</Form>
			</div>
		);
	};
}

const mapStateToProps = (state) => {
	return {};
};

SystemStaticForm = connect(mapStateToProps, {})(SystemStaticForm);
export default reduxForm({
	form: "systemStatic",
	// validate,
})(SystemStaticForm);
