import React from "react";
import { connect } from "react-redux";
import { PageTitle } from "../../../ReusableComponents/Page";
import {
	Tabs,
	Tab,
	Card,
	Button,
	Row,
	Col,
	Container,
	Form,
} from "react-bootstrap";
import {
	NAV_SYSTEM_CONFIGURATIONS,
	ADMIN_SYSTEM_DASHBOARD_INDEX,
} from "./constants";
import { getFilteredResults } from "../../../../search/searchUtil";
import { List, Table } from "antd";
class AdminSystemDashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cards: NAV_SYSTEM_CONFIGURATIONS,
			filteredCards: [...NAV_SYSTEM_CONFIGURATIONS],
			columns: [
				{
					title: "Title",
					dataIndex: "title",
					sorter: (a, b) => {
						return a.title.localeCompare(b.title);
					},
					render: (text) => {
						return <a>{text}</a>;
					},
				},
				{
					title: "Description",
					dataIndex: "description",
					sorter: (a, b) => {
						return a.description.localeCompare(b.description);
					},
					render: (text) => {
						return <a>{text}</a>;
					},
				},
				{
					title: "Action",
					render: (text, record) => (
						<>
							<Button
								size={"sm"}
								onClick={() => {
									record.onClick && record.onClick();
								}}>
								Configure
							</Button>
						</>
					),
				},
			],
		};
	}

	renderCard = () => {
		const { filteredCards, columns } = this.state;
		return (
			<Table
				size={"small"}
				rowKey={"title"}
				pagination={{
					showSizeChanger: true,
					position: ["topRight"],
					defaultPageSize: 25,
				}}
				columns={columns || []}
				dataSource={filteredCards || []}
			/>
		);
		// return (
		// 	<List
		// 		dataSource={filteredCards}
		// 		renderItem={(item) => (
		// 			// <List.Item>
		// 			// 	<List.Item.Meta
		// 			// 		title={<a href="https://ant.design">{item.title}</a>}
		// 			// 		description={item.description}
		// 			// 	/>
		// 			// </List.Item>
		// 			<List.Item>
		// 				<span className="mr-2">{item.title}</span>
		// 				<span>{item.description}</span>
		// 				<Button variant={"primary"}>Configure</Button>
		// 			</List.Item>
		// 		)}
		// 	/>
		// );
		// return filteredCards.map((obj, index) => {
		// 	const { onClick } = obj;
		// 	return (
		// 		<Col xs={3} key={`${obj.title}-${index}`}>
		// 			<Card>
		// 				<Card.Body>
		// 					<Card.Title>{obj.title || "Title"}</Card.Title>
		// 					<Card.Text>{obj.description || "No Description ..."}</Card.Text>
		// 					<Button
		// 						onClick={() => {
		// 							onClick && onClick();
		// 						}}
		// 						variant="light"
		// 						block>
		// 						Configure
		// 					</Button>
		// 				</Card.Body>
		// 			</Card>
		// 		</Col>
		// 	);
		// });
	};

	onSearch = (e) => {
		const { cards } = this.state;
		const filtered = getFilteredResults(
			e,
			ADMIN_SYSTEM_DASHBOARD_INDEX,
			cards,
			"title"
		);
		this.setState({
			filteredCards: [...filtered],
		});
	};

	render = () => {
		return (
			<div className="">
				<Container>
					<PageTitle title={"System Configurations"} />
					<Row>
						<Col>
							<Form.Group>
								<Form.Control
									onChange={(e) => this.onSearch(e)}
									type="text"
									placeholder="Search ..."
								/>
							</Form.Group>
						</Col>
					</Row>
					<Row>
						<Col>{this.renderCard()}</Col>
					</Row>
				</Container>
			</div>
		);
	};
}

const mapStateToProps = (state) => {
	return {};
};
export default connect(mapStateToProps, {})(AdminSystemDashboard);
