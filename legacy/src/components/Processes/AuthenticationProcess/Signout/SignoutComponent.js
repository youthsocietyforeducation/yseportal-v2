import React from "react";
import { connect } from "react-redux";
import { signOut } from "../../../../redux/actions/authActions";

class SignoutComponent extends React.Component {
	componentDidMount = () => {
		this.props.signOut();
	};

	render() {
		return <></>;
	}
}

export default connect(() => {}, { signOut })(SignoutComponent);
