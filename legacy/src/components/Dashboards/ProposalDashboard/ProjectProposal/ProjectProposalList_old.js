import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import history from "../../../../history";
import {
	changeView,
	getProjectProposals,
	getProjectProposal,
	setFilteredProposal,
	setSearchVal,
	search,
} from "../../../../redux/actions";

import ElementTableView from "./views/ElementTableView";
import BootstrapTable from "../../../ReusableComponents/Tables/BootstrapTable";
import { Button, Loading, Tooltip, Tag, Collapse } from "element-react";
import { sortByDate } from "../../../../utils/SortStrategies";
import { Status, ViewTypes, StatusCBs } from "./constants";
import { NewButton } from "../../../ReusableComponents/Buttons/NewButton";
import ProposalDialog from "./views/ProposalDialog";
import ProposalCard from "./views/ProposalCard";

class ProjectProposalList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			dialogVisible: false,
			selectedView: ViewTypes.LIST,
			searchBank: [],
			reuslts: [],
			filteredProposal: [],
			searchValue: "",
			searched: false,
			searchCheckboxes: {
				branch: [],
				department: [],
				status: [],
			},
		};
	}

	onDialogCancel = () => {
		this.setState({
			dialogVisible: false,
		});
	};

	componentDidMount = () => {
		console.log("PPL cDM");
		this.setState({ loading: true });
		this.props.getProjectProposals().then(() => {
			this.setState({
				loading: false,
			});
		});
	};

	onNewButtonClicked = () => {
		this.setState({
			dialogVisible: true,
		});
	};

	setSearchValue = (val) => {
		this.props.setSearchVal(val);
		// this.setState({ searchValue: val });
		setTimeout(() => {
			if (this.props.searchVal === val) {
				this.invokeSearch();
			}
		}, 300);
	};

	setFilteredProposal = (filteredProposal) => {
		this.props.setFilteredProposal(filteredProposal);
		// this.setState({ filteredProposal: [...filteredProposal] });
	};

	setSearchCheckboxes = (checkVal, type) => {
		let options = {
			branch: [...this.state.searchCheckboxes.branch],
			department: [...this.state.searchCheckboxes.department],
			status: [...this.state.searchCheckboxes.status],
		};

		if (type === "branch") {
			if (options.branch.includes(checkVal)) {
				options.branch = options.branch.filter((el) => el !== checkVal);
			} else {
				options.branch.push(checkVal);
			}
		} else if (type === "department") {
			if (options.department.includes(checkVal)) {
				options.department = options.department.filter((el) => el !== checkVal);
			} else {
				options.department.push(checkVal);
			}
		} else if (type === "status") {
			if (options.status.includes(checkVal)) {
				options.status = options.status.filter((el) => el !== checkVal);
			} else {
				options.status.push(checkVal);
			}
		}

		this.setState({ searchCheckboxes: options });

		setTimeout(() => {
			this.invokeSearch();
		}, 300);
	};

	// listens to Enter key and invokes search
	_handleKeyDown = (e) => {
		if (e.key === "Enter") {
			this.invokeSearch();
		}
	};

	invokeSearch = () => {
		let filter = this.props.searchVal.toLowerCase();
		let boxArray = this.state.searchCheckboxes;

		if (!this.state.searched) {
			this.setState({ searched: true });
		}

		if (
			filter !== "" ||
			boxArray.branch.length > 0 ||
			boxArray.department.length > 0 ||
			boxArray.status.length > 0
		) {
			let cbTypes = ["branch", "department", "status"];
			let tmpFilter = [];

			if (filter !== "") {
				tmpFilter = this.props.proposals.readableProposals.filter((v) => {
					console.log("PPL: filter", JSON.stringify(v).toLowerCase());
					return JSON.stringify(v).toLowerCase().includes(filter);
				});

				console.log("PPL: filter", tmpFilter);
			}

			cbTypes.forEach((type) => {
				if (boxArray[type].length > 0) {
					if (tmpFilter.length === 0) {
						tmpFilter = this.props.proposals.readableProposals.filter((v) => {
							return boxArray[type].includes(v[type].toLowerCase());
						});
					} else {
						tmpFilter = tmpFilter.filter((v) => {
							return boxArray[type].includes(v[type].toLowerCase());
						});
					}
				}
			});

			this.setFilteredProposal(tmpFilter);
		} else {
			this.setFilteredProposal(this.props.proposals.readableProposals);
		}
	};

	onClear = () => {
		this.setSearchValue("");

		setTimeout(() => {
			this.invokeSearch();
		}, 100);
	};

	onChangeViewClicked = (view) => {
		this.setState({
			selectedView: view,
		});
	};

	onViewClicked = (event) => {
		event.persist();
		let id = event.target.id;
		this.props.getProjectProposal(id);
	};

	renderCheckbox = (boxOptions, type) => {
		return boxOptions.map((box) => {
			return (
				<div className="custom-control custom-checkbox" key={box.value}>
					<input
						type="checkbox"
						className="custom-control-input"
						id={`customCheck${box.value}`}
						value={box.value}
						onChange={(e) => this.setSearchCheckboxes(e.target.value, type)}
					/>
					<label
						className="custom-control-label text-lowercase text-capitalize"
						htmlFor={`customCheck${box.value}`}>
						{box.label}
					</label>
				</div>
			);
		});
	};

	renderFilterPanel = () => {
		const { branches, departments } = this.props;
		return (
			<Collapse value={"1"}>
				<Collapse.Item
					title={
						<span>
							<i className="fas fa-filter mr-2"></i>Filters
						</span>
					}
					name="1">
					<div>
						<span>
							<i className="fas fa-code-branch mr-2"></i>Branch
						</span>
						{this.renderCheckbox(branches, "branch")}
					</div>
					<hr />
					<div>
						<span>
							<i className="fas fa-building mr-2"></i>Department
						</span>
						{this.renderCheckbox(departments, "department")}
					</div>
					<hr />
					<div>
						<span>
							<i className="fas fa-sync-alt mr-2"></i>Status
						</span>
						{this.renderCheckbox(StatusCBs, "status")}
					</div>
				</Collapse.Item>
			</Collapse>
		);
	};

	helperRender = (proposals) => {
		return (
			<div className="row">
				<div className="col-3 border-right mt-2">
					{this.renderFilterPanel()}
				</div>
				<div className="col-sm-9">
					{proposals.length > 0 ? (
						proposals.map((proposal, ind) => {
							console.log("helperRender", proposal);
							let status = proposal.status.toString().toUpperCase();
							return (
								<ProposalCard
									proposal={proposal}
									key={ind}
									sysUsers={this.props.sysUsers}
									keyedSysUsers={this.props.keyedSysUsers}
									showView={true}></ProposalCard>
							);
						})
					) : (
						<div className="projectProposal border mt-1 rounded p-3">
							No results found!
						</div>
					)}
				</div>
			</div>
		);
	};

	sorted = (proposals) => {
		return proposals.sort((a, b) => {
			if (
				a &&
				a.meta &&
				a.meta.updatedDate &&
				b &&
				b.meta &&
				b.meta.updatedDate
			) {
				sortByDate(a.meta.updatedDate, b.meta.updatedDate);
			} else {
				return -1;
			}
		});
	};

	renderContent = (view) => {
		let proposals = [];
		switch (view) {
			case ViewTypes.LIST:
				return this.renderListView(proposals);

			case ViewTypes.TABLE:
				return this.renderTableView();
		}
	};

	renderListView = (proposals) => {
		if (this.state.searched) {
			proposals = this.sorted(this.props.filteredProposals);
			return this.helperRender(proposals);
		} else if (this.props.proposals.readableProposals) {
			proposals = this.sorted(this.props.proposals.readableProposals);
			return this.helperRender(proposals);
		} else {
			return <Loading text="Loading..."></Loading>;
		}
	};

	renderTableView = () => {
		const { readableProposals } = this.props.proposals;
		this.props.search();
		return (
			<div className="mt-2">
				{/* <BootstrapTable /> */}
				<ElementTableView
					proposals={
						this.state.searched
							? this.props.filteredProposals
							: this.props.filteredProposals
					}
				/>
			</div>
		);
	};

	routeTo = (path) => {
		history.push(path);
	};

	renderCreateButton = () => {
		return (
			<span className="d-inline-block">
				<NewButton
					content="Create a New Proposal"
					onClick={this.onNewButtonClicked}></NewButton>
			</span>
		);
	};

	/**
	 * TODO: In the future, implement a way for people to view both the table view and list view
	 */
	renderViewTypes = () => {
		return (
			<>
				<Tooltip
					className="item ml-2"
					effect="dark"
					content="View data in table format"
					placement="top">
					<button
						className="btn btn-outline-secondary"
						onClick={() => this.onChangeViewClicked(ViewTypes.TABLE)}>
						<i className="fas fa-th-list"></i>
					</button>
				</Tooltip>
				<Tooltip
					className="item ml-2"
					effect="dark"
					content="View data in card list format "
					placement="top">
					<button
						className="btn btn-outline-secondary"
						onClick={() => this.onChangeViewClicked(ViewTypes.LIST)}>
						<i className="fas fa-bars"></i>
					</button>
				</Tooltip>
			</>
		);
	};
	renderSearchBar = () => {
		return (
			<div className="input-group">
				<input
					className="form-control"
					type="search"
					placeholder="Search..."
					value={this.props.searchVal}
					onChange={(e) => this.setSearchValue(e.target.value)}
					onKeyDown={(e) => this._handleKeyDown(e)}
				/>
				{this.props.searchVal !== "" && (
					<div className="input-group-append">
						<button
							className="btn btn-outline-secondary"
							onClick={() => this.onClear()}>
							<i className="fa fa-times" />
						</button>
					</div>
				)}
			</div>
		);
	};

	renderTopHeader = () => {
		return (
			<div className="row mb-2">
				<div className="col-sm-3">{this.renderCreateButton()}</div>
				<div className="col-sm-3 d-flex justify-content-end">
					{this.renderViewTypes()}
				</div>
				<div className="col-sm-6">{this.renderSearchBar()}</div>
			</div>
		);
	};

	openEditDialog = (val) => {
		this.setState({
			dialogVisible: val,
		});
	};

	render = () => {
		const { account } = this.props;
		const { dialogVisible } = this.state;
		if (account) {
			return (
				<div>
					{this.renderTopHeader()}
					{this.renderContent(this.state.selectedView)}
					<ProposalDialog
						proposalId={this.props.proposalId}
						onCancel={() => this.openEditDialog(false)}
						proposal={this.props.proposal}
						dialogTitle={"Create New Proposal"}
						dialogVisible={this.state.dialogVisible}
					/>
					{/* <ProposalDialog onCancel={this.onDialogCancel} dialogVisible={dialogVisible}></ProposalDialog> */}
				</div>
			);
		} else {
			return <Loading className="m-5" text="Loading..."></Loading>;
		}
	};
}

const mapStateToProps = (state) => {
	console.log(pC, "mapStateToProps", state);
	return {
		proposals: state.proposal,
		branches:
			(state.system && state.system.branches && state.system.branches.data) ||
			[],
		departments:
			(state.system &&
				state.system.departments &&
				state.system.departments.data) ||
			[],
		proposalFrame: state.proposal.proposalFrame,
		account: state.auth.account,
		filteredProposals: state.proposal.filteredProposals,
		sysUsers: state.system.sysUsers,
		searchVal: state.proposal.searchVal,
	};
};

export default connect(mapStateToProps, {
	getProjectProposals,
	getProjectProposal,
	changeView,
	setFilteredProposal,
	setSearchVal,
	search,
})(ProjectProposalList);

const pC = "ProjectProposalList";
