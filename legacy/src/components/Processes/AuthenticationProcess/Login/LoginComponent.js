import React from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { signIn } from "../../../../redux/actions/authActions";
import { Button } from "react-bootstrap";
import { validate } from "./validate";
import { Alert } from "react-bootstrap";
import { Spin } from "antd";
class LoginComponent extends React.Component {
  onSubmit = (formVals) => {
    if (formVals && formVals.email && formVals.password) {
      this.props.signIn(
        formVals.email.toString(),
        formVals.password.toString()
      );
    }
  };

  renderError({ error, touched }) {
    if (touched && error) {
      return (
        <Alert className="mt-2" variant="warning">
          {error}
        </Alert>
      );
    }
  }

  renderInput = ({ input, label, type, placeholder, meta }) => {
    return (
      <div className="form-group">
        <label>{label}</label>
        <input
          className="form-control"
          {...input}
          type={type}
          placeholder={placeholder}
          autoComplete="off"
        />
        {this.renderError(meta)}
      </div>
    );
  };

  render() {
    return (
      <Spin spinning={false}>
        <div className="i-auth-frame">
          <h2>Log In</h2>
          <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
            <Field
              name="email"
              label="Enter Email"
              type="email"
              component={this.renderInput}
            />

            <Field
              name="password"
              label="Enter Password"
              type="password"
              component={this.renderInput}
            />

            <div className="d-flex flex-column align-items-end">
              <Button variant="primary" type="submit">
                Login
              </Button>
              <Link to={`/password/reset`}>
                <span className="d-inline-block mt-2 text-link">
                  Forgot password?
                </span>
              </Link>
              <Link to={`/signup`}>
                <span className="d-inline-block mt-2 text-link">
                  Create New Account?
                </span>
              </Link>
            </div>
          </form>
        </div>
      </Spin>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    loading: state.system.loading,
  };
};
LoginComponent = connect(mapStateToProps, { signIn })(LoginComponent);

export default reduxForm({
  form: "LoginComponentForm",
  validate,
})(LoginComponent);
