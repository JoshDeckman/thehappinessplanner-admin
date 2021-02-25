import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import firebase from "firebase/app";

import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";

import AlertSnackbar from "./components/Alert";

export default function App() {
  const [auth, setAuth] = useState(false);
  // eslint-disable-next-line
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState(null);
  const [requiredError, setRequiredError] = useState(null);
  
  const updateAuth = (user) => {
    setAuth(true);
    setAdmin(user);
  };

  const exitApp = () => {
    setAuth(false);
    setAdmin(null);
  };

  const handleError = (message) => {
    if (message) {
      setError(message);
    } else {
      setError(null);
    }
  };

  const handleRequiredError = (message) => {
    if (message) {
      setRequiredError(message);
    } else {
      setRequiredError(null);
    }
  };

  return (
    <Router>
      <AlertSnackbar 
        isType="error" 
        isOpen={error || requiredError} 
        handleClick={() => { setError(null); setRequiredError(null); }} 
        message={error? error : requiredError? requiredError: null} 
      />
      <Switch>
        {auth ? (
          <Route exact path="/">
            <Dashboard  
              firebase={firebase} 
              exitApp={exitApp} 
              handleError={handleError} 
              error={error}
              handleRequiredError={handleRequiredError} 
              requiredError={requiredError}
            />
          </Route>
        ) : (
          <Route exact path="/">
            <SignIn 
              firebase={firebase} 
              updateAuth={updateAuth} 
              handleError={handleError} 
            />
          </Route>
        )}
      </Switch>
    </Router>
  );
}
