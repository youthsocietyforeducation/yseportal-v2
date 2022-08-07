import React, { Component } from 'react'; 
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { createUser } from '../../../../../redux/actions';
import { Button, Loading, Dialog } from 'element-react';
import ProjectProposalForm from '../forms/ProjectProposalForm';

class ProjectProposalCreateDialog extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false, 
    }
  }

  componentDidMount = () => {
    this.setState({}); 
  }

  setLoading = (val) => {
    this.setState({ loading: val })
  }

  // onSubmit = (formVals) => {
  //   let email = formVals.email.toString().toLowerCase(); 
  //   this.setLoading(true);
  //   this.props.createUser(email).then(() => {
  //     this.setLoading(false); 
  //     this.props.onCancel(); 
  //   })
  // }

  render() {
    const { loading } = this.state;
    const { dialogVisible, dialogTitle, dialogSize, onCancel, proposal } = this.props;
    console.log("ProposalDialog: proposal", proposal)
    return (
      <div className="">
          <Dialog
            size={dialogSize || "small"}
            title={dialogTitle || "Create a New Proposal" }// <i className="fas fa-user-plus mr-2 h2"></i>
            visible={ dialogVisible }
            onCancel={ onCancel }
          >
          <Loading loading={loading}>
          <Dialog.Body>
            <ProjectProposalForm proposalId={this.props.proposalId} initialValues={proposal} onDialogCancel={onCancel}/>
          </Dialog.Body>
          </Loading>

          {/* <Dialog.Footer className="dialog-footer">
            <Button onClick={ onCancel }>Cancel</Button>
            <Button type="primary" nativeType="submit">Submit</Button>
          </Dialog.Footer> */}
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {}
}

ProjectProposalCreateDialog = connect(
  mapStateToProps, { createUser }
)(ProjectProposalCreateDialog); 

export default reduxForm({
  form: 'signupForm',
// validate
})(ProjectProposalCreateDialog)
