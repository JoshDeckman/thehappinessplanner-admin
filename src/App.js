import React, { useState } from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";

export default function App() {
  const [auth, setAuth] = useState(false);
  // eslint-disable-next-line
  const [admin, setAdmin] = useState(null);

  const updateAuth = (user) => {
    setAuth(true);
    setAdmin(user);
  };

  const exitApp = () => {
    setAuth(false);
    setAdmin(null);
  };

  return (
    <Router>
      <Switch>
        {auth ? (
          <Route exact path="/">
            <Dashboard exitApp={exitApp} />
          </Route>
        ) : (
          <Route exact path="/">
            <SignIn updateAuth={updateAuth} />
          </Route>
        )}
      </Switch>
    </Router>
  );
}
