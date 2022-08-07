import React from "react";
import { connect } from "react-redux";
import { Table, Tag, Badge, Input, Space, Button } from "antd";
import { PageTitle } from "../../../../ReusableComponents/Page";
import {
	BSNewButton,
	BSViewButton,
} from "../../../../ReusableComponents/Buttons/BSButton";
import { getDateAndTime } from "../../../../../utils/dateUtils";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
class RoleManagerUI extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchText: "",
			searchedColumn: "",
			columns: [
				{
					title: "Label",
					dataIndex: "label",
					sorter: (a, b) => {
						return a.label.localeCompare(b.label);
					},
					// render: (text, record) => {
					// 	return (
					// 		<Badge size="small" count={count ? count : null}>
					// 			<a className="p-2">{text}</a>
					// 		</Badge>
					// 	);
					// },
					render: (text, record) => {
						const { users } = record;
						let count = users && users.length;
						const isEqual = this.state.searchedColumn === "label";
						return (
							<Badge size="small" count={count ? count : null}>
								{isEqual ? (
									<Highlighter
										className="p-3"
										highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
										searchWords={[this.state.searchText]}
										autoEscape
										textToHighlight={text ? text.toString() : ""}
									/>
								) : (
									<span className="p-3">{text}</span>
								)}
							</Badge>
						);
					},
					...this.getColumnSearchProps("label"),
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
					title: "Updated By",
					dataIndex: "updatedBy",
					render: (text) => {
						console.log("RoleManagerUI Updated By text", text);
						if (text === "system") {
							return <a>{text}</a>;
						} else {
							const { keyedUsers } = this.props;
							const keyedUser = keyedUsers[text];
							return (
								<a>
									{keyedUser &&
										keyedUser.displayName &&
										keyedUser.displayName.toString()}
								</a>
							);
						}
					},
					sorter: (a, b) => {
						return a.updatedBy.localeCompare(b.updatedBy);
					},
				},
				{
					title: "Action",
					key: "action",
					render: (text, record) => (
						<>
							{true ? (
								<BSViewButton
									onClick={() => {
										console.log(text.uid);
									}}
								/>
							) : null}
						</>
					),
				},
			],
		};
	}

	componentDidMount = () => {};

	handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		this.setState({
			searchText: selectedKeys[0],
			searchedColumn: dataIndex,
		});
	};

	handleReset = (clearFilters) => {
		clearFilters();
		this.setState({ searchText: "" });
	};

	getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
		}) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={(node) => {
						this.searchInput = node;
					}}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() =>
						this.handleSearch(selectedKeys, confirm, dataIndex)
					}
					style={{ width: 188, marginBottom: 8, display: "block" }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}>
						Search
					</Button>
					<Button
						onClick={() => this.handleReset(clearFilters)}
						size="small"
						style={{ width: 90 }}>
						Reset
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered) => (
			<SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
		),
		onFilter: (value, record) =>
			record[dataIndex]
				? record[dataIndex]
						.toString()
						.toLowerCase()
						.includes(value.toLowerCase())
				: "",
		onFilterDropdownVisibleChange: (visible) => {
			if (visible) {
				setTimeout(() => this.searchInput.select(), 100);
			}
		},
	});

	expandedRowRender = (record) => {
		const { keyedUsers } = this.props;
		const users = record.users;
		return users
			? users.map((user) => {
					const displayName =
						keyedUsers[user] &&
						keyedUsers[user].displayName &&
						keyedUsers[user].displayName.toString();

					const email =
						keyedUsers[user] &&
						keyedUsers[user].email &&
						keyedUsers[user].email.toString();
					return (
						<Tag key={`user-${user}`} color={"magenta"}>
							{displayName ? displayName : email}
						</Tag>
					);
			  })
			: null;
	};

	render = () => {
		const { roles: dataSource } = this.props;
		const { columns } = this.state;
		return (
			<div>
				<PageTitle title={"Roles"} />
				<BSNewButton />
				<Table
					size={"small"}
					rowKey={"value"}
					dataSource={dataSource || []}
					columns={columns}
					expandable={{
						expandedRowRender: this.expandedRowRender,
					}}
					pagination={{ showSizeChanger: true, position: ["topRight"] }}
				/>
			</div>
		);
	};
}

const mapStateToProps = (state) => {
	return {
		roles: (state.system.roles && state.system.roles.data) || [],
		keyedRoles: (state.system.roles && state.system.roles.keyed) || {},
		keyedUsers: (state.system.users && state.system.users.keyed) || {},
	};
};

export default connect(mapStateToProps, {})(RoleManagerUI);
