import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { insertOrUpdateSystemStaticVar } from "../../../../../redux/actions/systemActions";
import { PageTitle } from "../../../../ReusableComponents/Page";
import SystemStaticTable from "../ui/SystemStaticTable";

class BranchList extends React.Component {
	constructor(props) {
		super(props);
	}

	onCreate = (val) => {
		const { label } = val;
		console.log("BranchList onCreate", val);
		this.props.insertOrUpdateSystemStaticVar({
			collection: "branches",
			isInsert: true,
			...val,
		});
	};

	onEdit = (val) => {
		console.log("BranchList onEdit", val);
		// this.props.insertOrUpdateSystemStaticVar("branches", { ...val });
	};

	render = () => {
		const { branches: dataSource, keyedBranches: keyedSource } = this.props;
		return (
			<div>
				<SystemStaticTable
					onEdit={this.onEdit}
					onCreate={this.onCreate}
					collection={"branches"}
					dataSource={dataSource || []}
					keyedSource={keyedSource || {}}
				/>

			</div>
		);
	};
}

const mapStateToProps = (state) => {
	return {
		branches:
			(state.system && state.system.branches && state.system.branches.data) ||
			[],
		keyedBranches:
			(state.system && state.system.branches && state.system.branches.keyed) ||
			{},
	};
};

export default connect(mapStateToProps, { insertOrUpdateSystemStaticVar })(
	BranchList
);
