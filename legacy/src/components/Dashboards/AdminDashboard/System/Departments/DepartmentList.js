import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { insertOrUpdateSystemStaticVar } from "../../../../../redux/actions/systemActions";
import { PageTitle } from "../../../../ReusableComponents/Page";
import SystemStaticTable from "../ui/SystemStaticTable";

class DepartmentList extends React.Component {
	constructor(props) {
		super(props);
	}

	onCreate = (val) => {
		const { label } = val;
		console.log("DepartmentList onCreate", val);
		this.props.insertOrUpdateSystemStaticVar({
			collection: "departments",
			isInsert: true,
			...val,
		});
	};

	onEdit = (val) => {
		console.log("DepartmentList onEdit", val);
		// this.props.insertOrUpdateSystemStaticVar("departments", { ...val });
	};

	render = () => {
		const { departments, keyedDepartments } = this.props;
		console.log("insertStaticVariable DepartmentList", departments);
		return (
			<div>
				<SystemStaticTable
					onEdit={this.onEdit}
					onCreate={this.onCreate}
					collection={"departments"}
					dataSource={departments || []}
					keyedSource={keyedDepartments || {}}
				/>
			</div>
		);
	};
}

const mapStateToProps = (state) => {
	return {
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
	};
};

export default connect(mapStateToProps, { insertOrUpdateSystemStaticVar })(
	DepartmentList
);
