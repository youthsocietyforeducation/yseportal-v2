import React from 'react';
import { Route } from 'react-router-dom';
import ProposalDashboard from '../Dashboards/ProposalDashboard/ProposalDashboard';
export default [
  <Route
    key="1"
    path="/proposals"
    exact
    component={(props) => <ProposalDashboard {...props} page={'LIST'} />}
  />,
  <Route
    key="2"
    path="/proposals/new"
    exact
    component={(props) => <ProposalDashboard {...props} page={'CREATE'} />}
  />,
  <Route
    key="3"
    path="/proposals/:id"
    exact
    component={(props) => <ProposalDashboard {...props} page={'SHOW'} />}
  />,
  <Route
    key="4"
    path="/proposals/:id/edit"
    exact
    component={(props) => <ProposalDashboard {...props} page={'EDIT'} />}
  />,
];
