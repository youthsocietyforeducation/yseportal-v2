import React from "react";
import { Component } from "react";
import { connect } from "react-redux";

import ProjectProposalForm from "./forms/ProjectProposalForm";

import { fetchProposal, changeStatus } from "../../../../redux/actions";

class ProjectProposalEdit extends Component {
	componentDidMount = () => {
		this.props.fetchProposal(this.props.proposalId);
	};

	render() {
		console.log("PPEdit render() this.props", this.props);
		if (this.props.proposals.selectedProposal) {
			let proposal = this.props.proposals.selectedProposal;
			console.log("proposalEdit", proposal);
			return (
				<div>
					<h3 className="mb-4">
						<i className="fas fa-pencil-alt font-large mr-3"></i>
						Edit your proposal
					</h3>

					<ProjectProposalForm
						proposalId={this.props.proposalId}
						initialValues={proposal ? proposal : {}}
					/>
				</div>
			);
		} else {
			return <div>Loading...</div>;
		}
	}
}

const mapStateToProps = (state) => {
	return {
		proposals: state.proposal,
	};
};

export default connect(mapStateToProps, {
	getProjectProposal: fetchProposal,
	changeStatus,
})(ProjectProposalEdit);
