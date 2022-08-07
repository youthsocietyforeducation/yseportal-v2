import React from "react";
import { connect } from "react-redux";
import { PageTitle } from "../../../../ReusableComponents/Page";
import { Table, Space, Tag, List, Modal, Spin } from "antd";
import {
	getDateAndTimeAndZone,
	getDateAndTime,
} from "../../../../../utils/dateUtils";
import SystemStaticForm from "../forms/SystemStaticForm";
import { Container, Row, Col, Button } from "react-bootstrap";
import {
	BSNewButton,
	BSEditButton,
	BSViewButton,
} from "../../../../ReusableComponents/Buttons/BSButton";
import * as _ from "lodash";
const ACTIONS = {
	CREATE: "Create",
	EDIT: "Edit",
	VIEW: "View",
};

class SystemStaticTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			modalVisible: false,
			selectedBranch: {},
			selectedRecord: {},
			action: "",
			columns: [
				{
					title: "Label",
					dataIndex: "label",
					sorter: (a, b) => {
						return a.label.localeCompare(b.label);
					},
					render: (text) => <a>{text}</a>,
				},
				{
					title: "Active",
					dataIndex: "active",
					render: (text, record) => {
						const active = record.active;
						return (
							<Tag color={active ? "green" : "red"}>
								{record.active.toString().toUpperCase()}
							</Tag>
						);
					},
					filters: [
						{
							text: "Active",
							value: true,
						},
						{
							text: "Inactive",
							value: false,
						},
					],
					onFilter: (value, record) => record.active === value,
				},
				{
					title: "Value",
					dataIndex: "value",
					render: (text) => <a>{text}</a>,
				},
				{
					title: "Updated",
					dataIndex: "updated",
					render: (text) => {
						const date = new Date(text).toString();
						return getDateAndTime(date);
					},
					sorter: (a, b) => {
						const newDateA = new Date(a.updated).getTime();
						const newDateB = new Date(b.updated).getTime();
						return newDateA - newDateB;
					},
				},
				{
					title: "Action",
					key: "action",
					render: (text, record) => (
						<Space size="middle">
							<BSViewButton
								onClick={() => {
									this.setState({
										selectedRecord: record,
										modalVisible: true,
										action: ACTIONS.VIEW,
									});
								}}
							/>
							{this.props.isAdmin ? (
								<BSEditButton
									onClick={() => {
										console.log(text.uid);
										this.setState({
											selectedRecord: record,
											modalVisible: true,
											action: ACTIONS.EDIT,
										});
									}}
								/>
							) : null}
						</Space>
					),
				},
			],
		};
	}

	handleOk = () => {
		this.setState({ modalVisible: false });
	};

	handleCancel = () => {
		this.setState({ modalVisible: false, action: "" });
	};

	renderModalTitle = (action) => {
		const { selectedRecord } = this.state;
		switch (action) {
			case ACTIONS.CREATE:
				return "Create";
			case ACTIONS.EDIT:
				return "Edit";
			case ACTIONS.VIEW:
				return selectedRecord.label || "View";
		}
	};

	onCreate = (vals) => {
		this.setState({ loading: true });
		console.log("onFinish onCreate", vals);
		let newObj = {
			...vals,
			value:
				vals.label && vals.label.toString().toLowerCase().replace(/ /g, "_"),
		};
		console.log("onFinish onCreate newObj", newObj);
		setTimeout(() => {
			this.setState({ loading: false });
		}, 3000);
	};

	renderModalBody = (action) => {
		let { selectedRecord, loading } = this.state;
		console.log("selectedRecord branch,record, action", selectedRecord, action);
		const { onCreate, onEdit, keyedSource } = this.props;
		switch (action) {
			case ACTIONS.CREATE:
				return (
					<Spin spinning={loading}>
						<SystemStaticForm
							initialValues={{ active: true }}
							onCancel={this.handleCancel}
							onFinish={onCreate && onCreate}
							formControls={this.getFormControls()}
						/>
					</Spin>
				);
			case ACTIONS.EDIT:
				return (
					<Spin spinning={loading}>
						<SystemStaticForm
							initialValues={selectedRecord}
							onCancel={this.handleCancel || null}
							onFinish={(onEdit && onEdit) || null}
							formControls={this.getFormControls()}
						/>
					</Spin>
				);

			case ACTIONS.VIEW:
				const { uid } = selectedRecord;
				return (
					<List
						size="small"
						bordered
						dataSource={_.toPairs(
							_.pick(keyedSource[uid], [
								"label",
								"value",
								"created",
								"createdBy",
								"updated",
								"updatedBy",

								"active",
							])
						)}
						renderItem={(item) => (
							<List.Item>
								<span className="mr-2">{item[0].toString()}</span>
								<span>{item[1].toString()}</span>
							</List.Item>
						)}
					/>
				);
		}
	};

	getFormControls = () => {
		return (
			<>
				<Button
					variant="default"
					className="mr-2"
					key="back"
					type="reset"
					onClick={this.handleCancel}>
					Cancel
				</Button>
				<Button key="submit" type="submit" type="primary">
					Submit
				</Button>
			</>
		);
	};

	renderModal = () => {
		const { modalVisible, loading, action } = this.state;
		return (
			<Modal
				width={"50%"}
				visible={modalVisible}
				title={this.renderModalTitle(action)}
				onCancel={this.handleCancel}
				footer={null}>
				{this.renderModalBody(action)}
			</Modal>
		);
	};

	renderTableView = () => {
		const { dataSource } = this.props;
		const { columns } = this.state;
		return (
			<Table
				size={"small"}
				rowKey={"label"}
				dataSource={dataSource || []}
				columns={columns}
				pagination={{ showSizeChanger: true, position: ["topRight"] }}
			/>
		);
	};

	render = () => {
		const { view } = this.state;
		console.log("SystemStaticTable state", this.state);
		console.log("SystemStaticTable props", this.props);
		const { collection } = this.props;
		return (
			<Row>
				<Container>
					<Col>
						<PageTitle title={collection.toString().toUpperCase()} />
						<div className="d-flex justify-content-start">
							<BSNewButton
								onClick={() => {
									this.setState({ modalVisible: true, action: ACTIONS.CREATE });
								}}
								className="mr-2"></BSNewButton>
						</div>
						<div className="mt-3">{this.renderTableView()}</div>
						{this.renderModal()}
					</Col>
				</Container>
			</Row>
		);
	};
}

const mapStateToProps = (state) => {
	return {
		isAdmin: false,
	};
};

export default connect(mapStateToProps, {})(SystemStaticTable);
