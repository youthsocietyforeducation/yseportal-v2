import React, { Component } from "react";
import { connect } from "react-redux";

import AccountProfileShow from "./AccountProfileShow";
import AccountProfileSetup from "../../Processes/AccountSetup/AccountSetupForm";

class AccountDashboard extends Component {
	componentDidMount() {}

	renderDisplay = (projectProposalScreen) => {
		// console.log("AccountDashboard COMP: renderDisplay(): ", projectProposalScreen);
		switch (projectProposalScreen) {
			case "LIST":
				return null;
			case "SETUP":
				return <AccountProfileSetup userId={this.props.match.params.id} />;
			case "SHOW":
				return <AccountProfileShow userId={this.props.match.params.id} />;
			default:
				console.log("called here", projectProposalScreen);
				return null;
		}
	};

	render() {
		console.log("INFO: render(): AccountDashboard: ", this.props);
		return (
			<div className="dashboard-frame m-auto">
				{this.renderDisplay(this.props.page)}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	// console.log("this is state: ", state);
	return {};
};

export default connect(mapStateToProps, {})(AccountDashboard);
