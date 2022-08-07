import React from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";

import Header from "./Header";
import SignupComponent from "./Processes/AuthenticationProcess/Signup/SignupComponent";
import LoginComponent from "./Processes/AuthenticationProcess/Login/LoginComponent";
import SignoutComponent from "./Processes/AuthenticationProcess/Signout/SignoutComponent";
import ResetPasswordComponent from "./Processes/AuthenticationProcess/ResetPassword/ResetPasswordComponent";
import VerifyEmailComponent from "./Processes/AuthenticationProcess/VerifyEmailComponent";
import HomeDashboard from "./Dashboards/HomeDashboard/HomeDashboard";
import { ROUTES } from "./Routes/constants";
import { Alert, Row, Col, Container } from "react-bootstrap";
import {
  signIn,
  signOut,
  onAuthStateChanged,
  getAuthAccountProfile,
  getSystemMetaData,
  triggerSetup,
} from "../redux/actions";

import { Spin } from "antd";
import "element-theme-default";
import proposalRoutes from "./Routes/proposalRoutes";
import adminRoutes from "./Routes/adminRoutes";
import accountRoutes from "./Routes/accountRoutes";
import LeftNav from "./LeftNav/LeftNav";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
    };
  }

  componentDidMount = () => {
    this.props
      .onAuthStateChanged()
      .then(() => {
        return this.props.getSystemMetaData();
      })
      .then(() => {
        this.setState({
          fetching: false,
        });
      });
  };

  renderContent = () => {
    const {
      isLoggedIn,
      systemMeta: { isSetupComplete },
    } = this.props;
    const { fetching } = this.state;
    if (fetching) {
      return (
        <Spin size={"large"} tip={"Loading ..."} spinning={true}>
          <div></div>
        </Spin>
      );
    }

    // if you are not logged in
    if (!fetching && !isLoggedIn) {
      return (
        <div className="">
          <Switch>
            <Route path="/" exact component={LoginComponent} />
            <Route path="/login" exact component={LoginComponent} />
            <Route path="/signup" exact component={SignupComponent} />
            <Route
              path="/password/reset"
              exact
              component={ResetPasswordComponent}
            />
            <Route
              component={() => {
                return <></>;
              }}
            />
          </Switch>
        </div>
      );
    }

    if (!fetching && !isSetupComplete) {
      return (
        <Container>
          <Alert className="mt-3" variant={"danger"}>
            The system is not ready for you yet
          </Alert>
        </Container>
      );
    }

    // if it's not fetching && you are loggedin
    if (!fetching && isLoggedIn) {
      const emailVerified = this.props.user && this.props.user.emailVerified;
      if (!emailVerified) {
        // if email has not been verified
        return <VerifyEmailComponent />;
      } else {
        // email is already verified
        if (!fetching && !isSetupComplete) {
          // if system is not set up, activate the system
        } else {
          return (
            <Row>
              <LeftNav />
              <Col id="dashboardPane" className="">
                <Switch>
                  <Route
                    path={ROUTES.BASE.ENTRY}
                    exact
                    component={HomeDashboard}
                  />
                  {proposalRoutes}
                  {adminRoutes}
                  {accountRoutes}
                  <Route path="/signout" exact component={SignoutComponent} />
                </Switch>
              </Col>
            </Row>
          );
        }
      }
    }
  };

  render() {
    const {
      loading: { system },
    } = this.props;
    return (
      <div>
        <Header />
        <Spin spinning={system}>
          <div className="i-display-root-frame">{this.renderContent()}</div>
        </Spin>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log("App.js state", state);
  return {
    isLoggedIn: state.auth.isLoggedIn,
    user: state.auth.user,
    authAccount: state.auth.account,
    systemReadonly: state.system.readonly,
    systemMeta: state.system.meta,
    loading: state.system.loading,
  };
};

export default connect(mapStateToProps, {
  signIn,
  signOut,
  onAuthStateChanged,
  getAuthAccountProfile,
  getSystemMetaData,
  triggerSetup,
})(App);
