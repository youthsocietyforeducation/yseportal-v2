import React from "react";
import { connect } from "react-redux";
import { Card, Row, Col, Tabs, Tab } from "react-bootstrap";
import { TABS, APPS, ADMIN_APPS } from "./apps_constants";
import { Link } from "react-router-dom";
import { hasOneOfTheRoles } from "../../../utils";

/**
 * UPDATED: August 2nd 2020
 * Author: Kaung Yang
 * HomeDashboard is the entry point for all the users. It is a tabbed window where
 * users can see Applications available for them. Some applications may include
 * Project Proposal, Scholarship Applications and so on.
 *
 * If you are an admin, you will have access to the Administration Tabs
 */
class HomeDashboard extends React.Component {
	renderDisplay = (tabs) => {
		switch (tabs) {
			case TABS.APPLICATIONS:
				return <Row>{this.renderApps({ apps: APPS, color: "primary" })}</Row>;
			case TABS.ADMINISTRATION:
				return (
					<Row>{this.renderApps({ apps: ADMIN_APPS, color: "danger" })}</Row>
				);
		}
	};

	renderApps = (data) => {
		const { apps, color } = data;
		return apps.map((app, ind) => {
			const { title, text, link } = app;
			return (
				<Col key={ind} xs={4} className="mt-3">
					<Link to={link}>
						<Card className="i-app-icon hvr-shrink w-100">
							<Card.Body>
								<Card.Title className={`text-${color}`}>{title}</Card.Title>
								<Card.Subtitle className="mb-2 text-muted">
									<small>{text}</small>
								</Card.Subtitle>
							</Card.Body>
						</Card>
					</Link>
				</Col>
			);
		});
	};

	checkIsAdmin = () => {
		let isAdmin;
		const { account } = this.props;
		if (account && account.roles) {
			isAdmin = hasOneOfTheRoles(["admin"], account.roles);
		}
		return isAdmin;
	};

	render() {
		const { account } = this.props;
		const isAdmin = this.checkIsAdmin();
		account && account.roles && hasOneOfTheRoles(["admin"], account.roles);
		return (
			<div className="dashboard-frame m-auto">
				<Tabs
					defaultActiveKey={TABS.APPLICATIONS}
					id="uncontrolled-tab-example">
					<Tab eventKey={TABS.APPLICATIONS} title={TABS.APPLICATIONS}>
						{this.renderDisplay(TABS.APPLICATIONS)}
					</Tab>
					{isAdmin ? (
						<Tab eventKey="administration" title="Administration">
							{this.renderDisplay(TABS.ADMINISTRATION)}
						</Tab>
					) : (
						<></>
					)}
				</Tabs>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		account: state.auth.account,
	};
};

export default connect(mapStateToProps, {})(HomeDashboard);
