import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ROUTES } from 'src/constants/RoutesConstants';

import LogIn from 'src/pages/LogIn';
import SignIn from 'src/pages/SignIn';
import Home from 'src/pages/Home';
import Counter from 'src/pages/Counter';
import NotFoundPage from 'src/pages/NotFoundPage';

import AuthCheck from './AuthCheck';

const routes = () => (
  <Router>
    <Routes>
      <Route
        path={ROUTES.LOG_IN}
        element={<AuthCheck component={<LogIn />} pathToRedirect={ROUTES.HOME} reverse={true} />}
      />
      <Route
        path={ROUTES.SIGN_IN}
        element={<AuthCheck component={<SignIn />} pathToRedirect={ROUTES.HOME} reverse={true} />}
      />

      <Route
        path="/"
        element={<AuthCheck component={<Navigate replace={true} to={ROUTES.HOME} />} />}
      />
      <Route path={ROUTES.HOME} element={<AuthCheck component={<Home />} />} />
      <Route path={ROUTES.COUNTER} element={<AuthCheck component={<Counter />} />} />

      {/** 404 * */}
      <Route path={ROUTES.ALL} element={<AuthCheck component={<NotFoundPage />} />} />
    </Routes>
  </Router>
);

export default routes;
