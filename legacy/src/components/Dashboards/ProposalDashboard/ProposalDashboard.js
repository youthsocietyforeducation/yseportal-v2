import React, { Component } from "react";
import { connect } from "react-redux";
import DashboardNavigator from "../DashboardNavigator";

import ProjectProposalList from "./ProjectProposal/ProjectProposalList";
import ProjectProposalCreate from "./ProjectProposal/ProjectProposalCreate";
import ProjectProposalEdit from "./ProjectProposal/ProjectProposalEdit";
import ProjectProposalShow from "./ProjectProposal/ProjectProposalShow";

class ProposalDashboard extends Component {
	componentDidMount() {}
	renderDisplay = (screen) => {
		// console.log("ProposalDashboard COMP: renderDisplay(): ", screen);
		switch (screen) {
			case "LIST":
				return <ProjectProposalList />;
			case "CREATE":
				return <ProjectProposalCreate />;
			case "EDIT":
				return <ProjectProposalEdit proposalId={this.props.match.params.id} />;
			case "SHOW":
				return <ProjectProposalShow proposalId={this.props.match.params.id} />;
			default:
				return <ProjectProposalList />;
		}
	};
	render() {
		console.log("INFO: render(): ProposalDashboard: ", this.props);
		return (
			<div className="dashboard-frame  m-auto">
				<DashboardNavigator />
				{this.renderDisplay(this.props.page)}
			</div>
		);
	}
}

export default ProposalDashboard;
