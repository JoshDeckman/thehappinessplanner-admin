import React, { useState } from "react";

import { login, logout } from "../../helpers/auth";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";

import { makeStyles } from "@material-ui/core/styles";

import HappinessLogo from "../../images/happiness-h-logo.png";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(20),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn({ firebase, updateAuth, handleError }) {
  const classes = useStyles();
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    var requiredFields = email && email.includes("@") && pass;

    if (requiredFields) {
      setIsLoading(true);

      login(email, pass)
        .then(() => {
          const currentUserId = firebase.auth().currentUser.uid;
          firebase.database().ref(`/access-level/${currentUserId}/`).once('value')
            .then(snapshot => {
              const accessLevelData = snapshot.val();

              if (accessLevelData && accessLevelData.admin) {
                setIsLoading(false);
                updateAuth(true);
              } else {
                logout(email, pass);
                handleError("Not Authorized")
                setIsLoading(false);
              }
            })
            .catch(error => {
              handleError("An error occured. Please try again.");
              setIsLoading(false);
            });
        })
        .catch(error => {
          handleError(error.message);
          setIsLoading(false);
        });
    } else {
      handleError("Must include a valid email and password")
			setIsLoading(false);
		}
  };

  const handleChangeEmail = (event) => {
    event.preventDefault();
    setEmail(event.target.value);
  };

  const handleChangePass = (event) => {
    event.preventDefault();
    setPass(event.target.value);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <img src={HappinessLogo} style={{ maxWidth: 200 }} alt="Happiness Logo"/>
            <Typography style={{ marginTop: "20px"}}>Admin Account</Typography>
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                onChange={handleChangeEmail}
                label="Email"
                name="email"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                onChange={handleChangePass}
                name="password"
                label="Password"
                type="password"
                id="password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="thp-button"
              >
                Login
              </Button>
            </form>
          </>
        )}
      </div>
    </Container>
  );
}
