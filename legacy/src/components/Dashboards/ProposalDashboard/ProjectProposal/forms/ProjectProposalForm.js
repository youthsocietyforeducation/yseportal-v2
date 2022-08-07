import React from "react";
import { Component } from "react";
import { Field, reduxForm, reset } from "redux-form";
import { connect } from "react-redux";
import { FieldArray } from "redux-form";
import {
	submitProposal as submit,
	updateProposal as update,
	fetchProposal,
	differenceTest,
} from "../../../../../redux/actions/proposalActions";
import { unmountForm } from "../../../../../redux/actions/";
import validate from "../controls/validate";
import { renderField, initializeAuthors } from "../controls/renderField";
import { Loading } from "element-react";
import { Button } from "react-bootstrap";
import { initial } from "lodash";

class ProjectProposalForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			allowSubmit: false,
			defaultValues: {},
			initAuthors: [],
		};
	}

	componentDidMount() {
		const { proposalId } = this.props;
		if (proposalId) {
			this.props.fetchProposal(proposalId).then((res) => {
				if (res) {
					console.log("PPForm getProjectProposal", res);
					console.log("PPForm cDM", this.props);
					this.init();
					this.setState({ loading: false });
				}
			});
		}
	}

	setLoading = (val) => {
		this.setState({ loading: val });
	};

	init = () => {
		let obj = {
			authors: [...this.initAuthors()],
		};

		this.setState({
			defaultValues: obj,
		});

		console.log("PPFORM init() obj", obj);
		console.log("PPFORM init() state", this.state);
	};

	initAuthors = () => {
		const {
			sysUsers,
			initialValues: { authors },
		} = this.props;
		const initAuthors = initializeAuthors(sysUsers, authors);
		console.log("PPForm: initAuthors", initAuthors);
		return initAuthors;
	};

	setAllowSubmit = (val) => {
		this.setState({ allowSubmit: val });
	};

	onSubmit = (vals) => {
		console.log("ppform onsubmit vals", vals);
		console.log("ppform onsubmit initialVals", this.props.initialValues);
		const { initialValues } = this.props;
		console.log("PPF: vals", vals);
		// this.props.update({ initialValues, vals });
		this.setLoading(true);
		console.log("PPF: vals", vals);

		if (!initialValues) {
			return this.props.submit(vals).then(() => {
				this.setLoading(false);
				// this.props.onDialogCancel();
			});
		}
		// else if (initialValues && initialValues.isEditable) {
		//   return this.props.update(this.props.proposalId, vals).then(() => {
		//     this.setLoading(false);
		//   });
		// }
	};

	removeCurrentUser = (sysUsers) => {
		if (sysUsers) {
			const { currUserId } = this.props;
			const retVal = sysUsers.filter((user) => {
				return user.uid !== currUserId;
			});
			return retVal;
		}
		return sysUsers;
	};

	render() {
		const { loading, defaultValues } = this.state;
		const { initialValues, onDialogCancel } = this.props;
		console.log("proposalForm initialValues", initialValues);
		console.log("proposalForm", this.props);
		return (
			<Loading loading={loading} text={"Please wait..."}>
				<form
					onSubmit={this.props.handleSubmit(this.onSubmit)}
					onKeyPress={(e) => {
						if (e.key === "Enter") e.preventDefault();
					}}>
					<Field
						name="title"
						label="Title"
						type="text"
						component={renderField}
					/>
					<Field
						name="description"
						label="Description"
						type="textarea"
						component={renderField}
					/>
					<Field
						name="branch"
						label="Branch"
						type="select"
						otherData={this.props.branches}
						component={renderField}
					/>
					<Field
						name="department"
						label="Department"
						type="select"
						otherData={this.props.departments}
						component={renderField}
					/>
					<FieldArray
						name="authors"
						label="Co-Author(s)"
						type="input"
						placeholder="Select Author(s)"
						defaultValues={
							defaultValues && defaultValues.authors ? defaultValues : null
						}
						initialValues={this.props.initialValues}
						otherData={this.removeCurrentUser(this.props.sysUsers)}
						component={renderField}
					/>
					<Field
						name="files"
						label="Upload Related Files"
						type="file"
						initialValues={this.props.initialValues}
						component={renderField}
						onChange={(e) => this.setAllowSubmit(e.length > 0)}
					/>
					<div>
						<div className="d-flex justify-content-end">
							<Button
								className="mr-2"
								variant="light"
								type="reset"
								onClick={onDialogCancel}>
								Cancel
							</Button>
							<Button variant="primary" type="submit">
								Submit
							</Button>
						</div>
					</div>
				</form>
			</Loading>
		);
	}

	componentWillUnmount = () => {
		this.props.unmountForm(reset, "projectProposal");
	};
}

const mapStateToProps = (state) => {
	return {
		auth: state.auth,
		selectedAuthors: state.proposal.selectedAuthors,
		branches: state.system.branches.data || [],
		departments: state.system.departments.data || [],
		sysUsers: state.system.users.data || [],
		currUserId: state.auth.user.uid,
	};
};

ProjectProposalForm = connect(mapStateToProps, {
	submit,
	update,
	getProjectProposal: fetchProposal,
	unmountForm,
	differenceTest,
})(ProjectProposalForm);

export default reduxForm({
	form: "projectProposal",
	validate,
})(ProjectProposalForm);
