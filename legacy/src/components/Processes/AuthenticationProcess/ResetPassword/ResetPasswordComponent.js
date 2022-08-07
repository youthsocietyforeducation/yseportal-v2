import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { sendResetPasswordLink } from "../../../../redux/actions/authActions";
import { PageTitle } from "../../../ReusableComponents/Page";
class ResetPasswordComponent extends Component {
	constructor(props) {
		super(props);
	}

	onSubmit = (formVals) => {
		let email = formVals.email.toString().trim();
		this.props.sendResetPasswordLink(email);
	};

	renderInput = ({ input, label, type, placeholder }) => {
		return (
			<div className="form-group">
				<label>{label}</label>
				<input
					{...input}
					type={type}
					placeholder={placeholder}
					autoComplete="off"
					className="form-control"
				/>
			</div>
		);
	};

	render() {
		return (
			<div className="i-auth-frame">
				<PageTitle title={"Reset Password"} />
				<form
					className="mt-3"
					onSubmit={this.props.handleSubmit(this.onSubmit)}>
					<div className="row">
						<div className="col-sm-12">
							<Field
								name="email"
								label="Email Address"
								type="email"
								component={this.renderInput}
							/>
						</div>
					</div>

					<div>
						<div className="d-flex justify-content-end">
							<button
								className="btn btn-primary"
								type="submit"
								data-toggle="modal"
								data-target="#showMessage">
								Send Link
							</button>
						</div>

						<Link to={`/login`}>
							<p className="text-right mt-2 mb-0">
								<span className="text-link">Login?</span>
							</p>
						</Link>

						<Link to={`/signup`}>
							<p className="text-right mt-2 mb-0">
								<span className="text-link">Create New Account?</span>
							</p>
						</Link>
					</div>
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {};
};

ResetPasswordComponent = connect(mapStateToProps, { sendResetPasswordLink })(
	ResetPasswordComponent
);

export default reduxForm({
	form: "resetForm",
})(ResetPasswordComponent);
