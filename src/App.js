import React, { useState } from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";

import AlertSnackbar from "./components/Alert";

export default function App() {
  const [auth, setAuth] = useState(false);
  // eslint-disable-next-line
  const [admin, setAdmin] = useState(null);
  const [hasError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  
  const updateAuth = (user) => {
    setAuth(true);
    setAdmin(user);
  };

  const exitApp = () => {
    setAuth(false);
    setAdmin(null);
  };

  const handleErrorClick = () => {
    setError(false);
    setErrorMessage(null);
  };

  const handleError = (message) => {
    setError(true);
    setErrorMessage(message);
  };

  return (
    <Router>
      <AlertSnackbar isType="error" isOpen={hasError} handleClick={handleErrorClick} message={errorMessage} />
      <Switch>
        {auth ? (
          <Route exact path="/">
            <Dashboard exitApp={exitApp} />
          </Route>
        ) : (
          <Route exact path="/">
            <SignIn updateAuth={updateAuth} handleError={handleError} />
          </Route>
        )}
      </Switch>
    </Router>
  );
}
