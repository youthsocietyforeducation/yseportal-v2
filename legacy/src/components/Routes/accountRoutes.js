import React from 'react';
import { Route } from 'react-router-dom';
import AccountSetupForm from '../Processes/AccountSetup/AccountSetupForm';
import AccountDashboard from '../Dashboards/AccountDashboard/AccountDashboard';
export default [
  <Route
    key="1"
    path="/account/profile/setup/:id"
    exact
    component={(props) => <AccountSetupForm {...props} page={'SETUP'} />}
  />,
  <Route
    key="2"
    path="/account/profile/:id"
    exact
    component={(props) => <AccountDashboard {...props} page={'SHOW'} />}
  />,
  <Route
    key="3"
    path="/account/profile/:id/edit"
    exact
    component={(props) => <AccountDashboard {...props} page={'EDIT'} />}
  />,
  <Route
    key="4"
    path="/account/profile/setting/:id/changepassword"
    exact
    component={(props) => (
      <AccountDashboard {...props} page={'CHANGE_PASSWORD'} />
    )}
  />,
];
