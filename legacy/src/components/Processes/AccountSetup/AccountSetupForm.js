import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { setupAccountProfile } from '../../../redux/actions/accountManagementActions';
import AccountSetupFirstPage from './AccountSetupFirstPage';
import AccountSetupSecondPage from './AccountSetupSecondPage';
import { Loading } from 'element-react';
class AccountSetupForm extends Component {
  constructor(props) {
    super(props);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.state = {
      page: 1,
    };
  }

  nextPage() {
    this.setState({ page: this.state.page + 1 });
  }

  previousPage() {
    this.setState({ page: this.state.page - 1 });
  }

  onSubmit = (formVals) => {
    console.log('AccountSetupForm ', this.props);
    let data = {
      profile: {
        firstName: formVals.firstName.trim(),
        lastName: formVals.lastName.trim(),
        phoneNumber: formVals.phoneNumber.trim(),
      },
    };

    console.log('AccountSetupForm: ', data);
    this.props.setupAccountProfile(data);
  };

  render() {
    const { page } = this.state;
    const { loading } = this.props;

    return (
      <Loading loading={loading}>
        <div className="i-account-setup-frame">
          <h4>Complete your profile!</h4>
          <div>
            {page === 1 && <AccountSetupFirstPage onSubmit={this.onSubmit} />}
            {/* {page === 2 && (
            <AccountSetupSecondPage
              previousPage={this.previousPage}
              onSubmit={this.onSubmit}
            />
          )} */}
          </div>
        </div>
      </Loading>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.accountManagement.loading.setup,
  };
};

export default AccountSetupForm = connect(mapStateToProps, {
  setupAccountProfile,
})(AccountSetupForm);
