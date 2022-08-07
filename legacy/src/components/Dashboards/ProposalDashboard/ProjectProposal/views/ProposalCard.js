import React from "react";
import { Card, Tag, Typography } from "antd";
import {
	UserOutlined,
	ApartmentOutlined,
	EnvironmentOutlined,
} from "@ant-design/icons";
import { Row, Col, Button } from "react-bootstrap";
import history from "../../../../../history";

const { Title, Text, Paragraph, Link } = Typography;
const renderDate = (stringDate) => {
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
export const ProposalCard = (configs) => {
	const { proposal, keyedUsers, keyedBranches, keyedDepartments } = configs;

	if (proposal) {
		return (
			<Card>
				<Row>
					<Col xs={9}>
						<Title
							className="d-flex justify-content-between"
							level={4}
							ellipsis={{
								rows: 1,
								expandable: true,
								symbol: "more",
							}}>
							{proposal.title}
						</Title>
					</Col>
					<Col xs={3} className="text-right">
						<Tag className="m-0 " color={"green"}>
							New
						</Tag>
					</Col>
				</Row>
				<Row>
					<Col>
						<div className="d-flex flex-wrap">
							<Tag
								className="my-1"
								color={"cyan"}
								icon={<EnvironmentOutlined />}>
								{(keyedBranches[proposal.branch] &&
									keyedBranches[proposal.branch].label) ||
									"unknown branch"}
							</Tag>
							<Tag
								className="my-1"
								color={"purple"}
								icon={<ApartmentOutlined />}>
								{(keyedDepartments[proposal.department] &&
									keyedDepartments[proposal.department].label) ||
									"unknown department"}
							</Tag>
						</div>
						<Row>
							<Col xs={9}>
								{proposal.coAuthors &&
									proposal.coAuthors.map((authorUid, i) => {
										return (
											<Tag
												key={`${authorUid}-${i}-tag`}
												className="my-1"
												color={
													authorUid === proposal.createdBy ? "volcano" : "blue"
												}
												icon={<UserOutlined />}>
												{(keyedUsers[authorUid] &&
													keyedUsers[authorUid].displayName) ||
													(keyedUsers[authorUid] &&
														keyedUsers[authorUid].email)}
											</Tag>
										);
									})}
							</Col>
						</Row>
						<Paragraph
							ellipsis={{
								rows: 2,
								expandable: true,
								symbol: "more",
							}}>
							{proposal.description || "no description"}
						</Paragraph>
					</Col>
					<Col xs={3} className="d-flex flex-column">
						<Button
							onClick={() => history.push(`/proposals/${proposal.uid}`)}
							size={"sm"}>
							View
						</Button>
					</Col>
				</Row>
				<div className="d-flex justify-content-between">
					<span>Submitted on: {renderDate(proposal.created)}</span>
					<span className="text-right">
						Last Updated: {renderDate(proposal.updated)}
					</span>
				</div>
			</Card>
		);
	} else {
		return null;
	}
};
