import React from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { signUp, signOut } from "../../../../redux/actions/authActions";
import { validate } from "./validate";
import { renderField } from "./renderField";
import { Alert, Button, Container, Modal } from "react-bootstrap";
import { Loading } from "element-react";
class SignupComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  setShow = (val) => {
    this.setState({ ...this.state, show: val });
  };

  handleClose = () => {
    this.setState(false);
  };

  onModalLogoutClicked = () => {
    this.props.signOut();
  };

  renderAlert = (err) => {
    const hasError = err && err.length > 0;
    if (hasError) {
      return <Alert variant={"danger"}>{err}</Alert>;
    }
  };

  renderEmailVerificationModal = () => {
    const { show } = this.state;
    return (
      <Modal show={show} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Email Verification Sent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          An email verification has been sent! Please verify your email and log
          in again.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => this.onModalLogoutClicked()}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  onSubmit = (formVals) => {
    let data = {
      email: formVals.email.toString().toLowerCase(),
      password: formVals.password.toString().trim(),
    };
    this.props.signUp(data);
  };

  render() {
    const {
      errMessage,
      loading,
      systemMeta: { isSetupComplete },
    } = this.props;
    const hasError = errMessage && errMessage.length > 0;
    if (isSetupComplete) {
      return (
        <Loading loading={loading}>
          <div className="i-auth-frame">
            <h2>Sign Up</h2>
            {this.renderAlert(errMessage)}
            <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
              <Field
                name="email"
                label="Email"
                type="email"
                component={renderField}
              />
              <Field
                name="emailAgain"
                label="Confirm Email"
                type="email"
                component={renderField}
              />
              <Field
                name="password"
                label="Password"
                type="password"
                component={renderField}
              />
              <Field
                name="passwordAgain"
                label="Confirm Password"
                type="password"
                component={renderField}
              />

              <div>
                <div className="d-flex justify-content-end">
                  <Button variant="success" type="submit">
                    Create Account
                  </Button>
                </div>

                <div>
                  <Link to={`/login`}>
                    <p className="float-right mt-2">
                      <span className="text-link">
                        Already Have an Account?
                      </span>
                    </p>
                  </Link>
                </div>
              </div>
            </form>
            {this.renderEmailVerificationModal()}
          </div>
        </Loading>
      );
    } else {
      return (
        <Container>
          <Alert className="mt-3" variant={"danger"}>
            The system is not ready for you yet
          </Alert>
        </Container>
      );
    }
  }
}

const mapStateToProps = (state) => {
  console.log("SignupComponent: ", state);
  return {
    errMessage: state.auth.errors.signUp,
    loading: state.auth.loading.signUp,
    systemReadonly: state.system.readonly,
    systemMeta: state.system.meta,
  };
};

SignupComponent = connect(mapStateToProps, { signUp, signOut })(
  SignupComponent
);

export default reduxForm({ form: "signupForm", validate })(SignupComponent);
