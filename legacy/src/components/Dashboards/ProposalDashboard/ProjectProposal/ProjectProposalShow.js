import React from "react";
import { Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { fetchProposal } from "../../../../redux/actions";
import { Typography, Tag, Card, List } from "antd";
import {
	BranchesOutlined,
	ApartmentOutlined,
	SmileTwoTone,
	FilePdfOutlined,
} from "@ant-design/icons";
import CommentList from "./views/CommentList";
import ProposalSteps from "./views/ProposalSteps";
import { ProposalCard } from "./views/ProposalCard";
const { Title, Paragraph, Text } = Typography;

class ProjectProposalShow extends React.Component {
	componentDidMount = () => {
		console.log("PPS this.props", this.props);
		this.props.fetchProposal(this.props.proposalId).then(() => {});
	};

	renderDate = (stringDate) => {
		console.log("renderDate", stringDate);
		if (stringDate) {
			const timezone = stringDate.substring(
				stringDate.indexOf("(") - 1,
				stringDate.indexOf(")") + 1
			);
			console.log("renderDate timezone", timezone);

			const parsedDate = Date.parse(stringDate);
			if (parsedDate) {
				const newDateObj = new Date(parsedDate);
				return (
					<>
						<b>{newDateObj.toDateString()}</b>
						<br />
						<span className="text-primary" style={{ fontSize: "11px" }}>
							{newDateObj.toLocaleTimeString()}
						</span>{" "}
						{timezone || "(No timezone)"}
					</>
				);
			}
		}
		return "Invalid Date";
	};

	render = () => {
		const {
			selectedProposal: proposal,
			keyedBranches,
			keyedDepartments,
			keyedUsers,
		} = this.props;
		const config = {
			keyedBranches,
			keyedDepartments,
			keyedUsers,
			proposal,
		};
		return (
			<Row>
				<Col className="i-proposal w-100" xs={8}>
					<ProposalCard page={""} {...config} />
					<div className="mt-3">
						<ProposalSteps
							proposalId={this.props.proposalId}
							proposal={this.props.selectedProposal || {}}
							activities={this.props.activities || {}}
						/>
					</div>
				</Col>
				<Col className="pl-0" xs={4}>
					<div>
						<CommentList
							proposal={this.props.selectedProposal || {}}
							comments={this.props.comments || []}
							proposalId={this.props.proposalId}
						/>
					</div>
				</Col>
			</Row>
		);
	};
}

const mapStateToProps = (state) => {
	return {
		authAccount: (state.auth && state.auth.account) || {},
		selectedProposal:
			(state.proposal &&
				state.proposal.selectedProposal &&
				state.proposal.selectedProposal.proposal) ||
			{},
		comments:
			(state.proposal &&
				state.proposal.selectedProposal &&
				state.proposal.selectedProposal.comments) ||
			{},
		activities:
			(state.proposal &&
				state.proposal.selectedProposal &&
				state.proposal.selectedProposal.activities) ||
			{},
		branches:
			(state.system && state.system.branches && state.system.branches.data) ||
			[],
		keyedBranches:
			(state.system && state.system.branches && state.system.branches.keyed) ||
			{},
		departments:
			(state.system &&
				state.system.departments &&
				state.system.departments.data) ||
			[],

		keyedDepartments:
			(state.system &&
				state.system.departments &&
				state.system.departments.keyed) ||
			{},
		users:
			(state.system && state.system.users && state.system.users.data) || [],
		keyedUsers:
			(state.system && state.system.users && state.system.users.keyed) || {},
	};
};

export default connect(mapStateToProps, { fetchProposal })(ProjectProposalShow);
