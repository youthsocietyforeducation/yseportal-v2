import React from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { signOut, sendVerify } from "../../../redux/actions/authActions";
import { Alert } from "react-bootstrap";
/**
 * Updated: August 5th 2020
 * Author: Elizabeth, Kaung
 *
 * This component is a component that verifies the user's email address is indeed valid
 * It checks the firebase user data 'emailVerified' to see if the user is verified.
 */

class VerifyEmailComponent extends React.Component {
	constructor(props) {
		super(props);
	}

	logInAfterVerified = () => {
		this.props.signOut();
	};

	sendVerificationEmail = () => {
		this.props.sendVerify();
	};

	renderAlert = () => {
		var defaultMessage =
			"Please check your inbox or click send verification email again";

		const {
			emailVerificationMessage: { message },
		} = this.props;
		return (
			<>
				<Alert variant={message ? "success" : "warning"}>
					<Alert.Heading>
						{message ? "Email sent!" : "You have not verified your email yet."}
					</Alert.Heading>

					{message ? <div className="mb-3">{message}</div> : defaultMessage}
				</Alert>
			</>
		);
	};

	render() {
		return (
			<div className="i-auth-frame">
				{this.renderAlert()}
				<div className="btn-frame">
					<Button variant="primary" onClick={this.sendVerificationEmail}>
						Send verification email again
					</Button>
					<Button
						className="mt-3"
						variant="outline-primary"
						onClick={this.logInAfterVerified}>
						Back to Login
					</Button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		emailVerificationMessage: state.auth.messages.emailVerificationMessage,
	};
};

export default connect(mapStateToProps, {
	signOut,
	sendVerify,
})(VerifyEmailComponent);
