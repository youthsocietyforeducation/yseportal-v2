import React from 'react';
import PropTypes from 'prop-types';

import { Navigate } from 'react-router-dom';

import { ROUTES } from 'src/constants/RoutesConstants';

const propTypes = {
  component: PropTypes.node.isRequired,
  pathToRedirect: PropTypes.string,
  reverse: PropTypes.bool,
};
const defaultProps = {
  pathToRedirect: ROUTES.LOG_IN,
  reverse: false,
};

const AuthCheck = ({ component, pathToRedirect, reverse }) => {
  // TODO: retrieve state from redux inside `AuthCheck`
  const loggedIn = true;

  if (reverse) {
    return loggedIn ? <Navigate replace={true} to={pathToRedirect} /> : component;
  }

  return loggedIn ? component : <Navigate replace={true} to={pathToRedirect} />;
};

AuthCheck.propTypes = propTypes;
AuthCheck.defaultProps = defaultProps;

export default AuthCheck;
