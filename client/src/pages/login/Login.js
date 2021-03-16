import React, { useState, useEffect } from "react";
import {
  Grid,
  CircularProgress,
  Tabs,
  Tab,
  Fade,
  TextField as Input,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// logo
import logo from "./logo_only.svg";
import google from "../../images/google.svg";

// context
import {
  useUserDispatch,
  loginUser,
  //registerUser,
  sendPasswordResetEmail,
} from "../../context/UserContext";
//import { receiveToken, doInit } from "../../context/UserContext";

//components
import { Button, Typography } from "../../components/Wrappers";
//import Widget from "../../components/Widget";
//import config from "../../config";

//form func
import useForm from "../../hooks/useForm";
import validate from "./validationLogin";
import config from "../../config";

const getGreeting = () => {
  const d = new Date();
  if (d.getHours() >= 4 && d.getHours() <= 12) {
    return "Good Morning";
  } else if (d.getHours() >= 13 && d.getHours() <= 16) {
    return "Good Day";
  } else if (d.getHours() >= 17 && d.getHours() <= 23) {
    return "Good Evening";
  } else {
    return "Good Night";
  }
};

function Login(props) {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTabId, setActiveTabId] = useState(0);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isForgot, setIsForgot] = useState(false);
  const [errorServer, setErrorServer] = useState(null);
  // global
  const userDispatch = useUserDispatch();

  useEffect(() => {
    // const params = new URLSearchParams(props.location.search);
    // const token = params.get("token");
    // const user = JSON.parse(localStorage.getItem("user"));
    // const tokenLocal = localStorage.getItem("toten");

    // if (token && token === tokenLocal) {
    //   receiveToken({ token, user }, userDispatch);
    //   doInit(user)(userDispatch);
    // }

    setValues({
      email: config.auth.email,
      password: config.auth.password,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = () =>
    loginUser(
      userDispatch,
      values.email,
      values.password,
      props.history,
      setIsLoading,
      setErrorServer
    );
  const { values, errors, handleChange, handleSubmit, setValues } = useForm(
    login,
    validate
  );

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <img src={logo} alt="logo" className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>Alex Admin</Typography>
      </div>
      <div
        className={
          !isForgot ? classes.formContainer : classes.customFormContainer
        }
      >
        <div className={classes.form}>
          {isForgot ? (
            <div>
              <Input
                id="login"
                InputProps={{
                  classes: {
                    underline: classes.InputUnderline,
                    input: classes.Input,
                  },
                }}
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                margin="normal"
                placeholder="Email"
                type="Email"
                fullWidth
                required
                error={errors?.email != null}
                helperText={errors?.email != null && errors?.email}
              />
              <div className={classes.formButtons}>
                {isLoading ? (
                  <CircularProgress size={26} className={classes.loginLoader} />
                ) : (
                  <Button
                    disabled={forgotEmail.length === 0}
                    onClick={() =>
                      sendPasswordResetEmail(forgotEmail)(userDispatch)
                    }
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    Send
                  </Button>
                )}
                <Button
                  color="primary"
                  size="large"
                  onClick={() => setIsForgot(!isForgot)}
                  className={classes.forgetButton}
                >
                  Back to login
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Tabs
                value={activeTabId}
                onChange={(e, id) => setActiveTabId(id)}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="Login" classes={{ root: classes.tab }} />
                <Tab
                  label="New User"
                  classes={{ root: classes.tab }}
                  disabled
                />
              </Tabs>
              {activeTabId === 0 && (
                <React.Fragment>
                  <Typography variant="h1" className={classes.greeting}>
                    {getGreeting()}, User
                  </Typography>
                  {/* <Button
                    size="large"
                    className={classes.googleButton}
                    onClick={() =>
                      loginUser(
                        userDispatch,
                        loginValue,
                        passwordValue,
                        props.history,
                        setIsLoading,
                        setError,
                        "google"
                      )
                    }
                  >
                    <img
                      src={google}
                      alt="google"
                      className={classes.googleIcon}
                    />
                    &nbsp;Sign in with Google
                  </Button>
                  <div className={classes.formDividerContainer}>
                    <div className={classes.formDivider} />
                    <Typography className={classes.formDividerWord}>
                      or
                    </Typography>
                    <div className={classes.formDivider} />
                  </div> */}

                  <Fade
                    in={errorServer}
                    style={
                      !errorServer
                        ? { display: "none" }
                        : { display: "inline-block" }
                    }
                  >
                    <Typography
                      color="warning"
                      className={classes.errorMessage}
                    >
                      что-то пошло не так, попробуйте еще раз
                    </Typography>
                  </Fade>

                  <Input
                    name="email"
                    InputProps={{
                      classes: {
                        underline: classes.InputUnderline,
                        input: classes.Input,
                      },
                    }}
                    value={values.email || ""}
                    onChange={handleChange}
                    margin="normal"
                    placeholder="Email или логин"
                    type="email"
                    fullWidth
                    required
                    error={errors?.email != null}
                    helperText={errors?.email != null && errors?.email}
                  />
                  <Input
                    name="password"
                    InputProps={{
                      classes: {
                        underline: classes.InputUnderline,
                        input: classes.Input,
                      },
                    }}
                    value={values.password || ""}
                    onChange={handleChange}
                    margin="normal"
                    placeholder="Password"
                    type="password"
                    fullWidth
                    required
                    error={errors?.password != null}
                    helperText={errors?.password != null && errors?.password}
                  />
                  <div className={classes.formButtons}>
                    {isLoading ? (
                      <CircularProgress
                        size={26}
                        className={classes.loginLoader}
                      />
                    ) : (
                      <Button
                        disabled={
                          values.email == null || values.password == null
                        }
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        size="large"
                      >
                        Login
                      </Button>
                    )}
                    <Button
                      color="primary"
                      size="large"
                      onClick={() => setIsForgot(!isForgot)}
                      className={classes.forgetButton}
                      disabled
                    >
                      Forgot Password?
                    </Button>
                  </div>
                </React.Fragment>
              )}
              {activeTabId === 1 && (
                <React.Fragment>
                  <Typography variant="h1" className={classes.greeting}>
                    Welcome!
                  </Typography>
                  <Typography variant="h2" className={classes.subGreeting}>
                    Create your account
                  </Typography>
                  <Fade in={errorServer}>
                    <Typography
                      color="secondary"
                      className={classes.errorMessage}
                    >
                      Something is wrong with your login or password :(
                    </Typography>
                  </Fade>
                  {/* <Input
                    name="name"
                    InputProps={{
                      classes: {
                        underline: classes.InputUnderline,
                        input: classes.Input,
                      },
                    }}
                    value={ue}
                    onChange={(e) => setNameValue(e.target.value)}
                    margin="normal"
                    placeholder="Full Name"
                    type="email"
                    fullWidth
                  />
                  <Input
                    name="email"
                    InputProps={{
                      classes: {
                        underline: classes.InputUnderline,
                        input: classes.Input,
                      },
                    }}
                    value={loginValue}
                    onChange={(e) => setLoginValue(e.target.value)}
                    margin="normal"
                    placeholder="Email Adress"
                    type="email"
                    fullWidth
                  />
                  <Input
                    id="password"
                    InputProps={{
                      classes: {
                        underline: classes.InputUnderline,
                        input: classes.Input,
                      },
                    }}
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                    margin="normal"
                    placeholder="Password"
                    type="password"
                    fullWidth
                  /> */}
                  <div className={classes.creatingButtonContainer}>
                    {isLoading ? (
                      <CircularProgress size={26} />
                    ) : (
                      <Button
                        onClick={() => {
                          /* registerUser(
                            userDispatch,
                            loginValue,
                            passwordValue,
                            props.history,
                            setIsLoading,
                            setError
                          )() */
                        }}
                        disabled={
                          {
                            /* loginValue.length === 0 ||
                          passwordValue.length === 0 ||
                          nameValue.length === 0 */
                          }
                        }
                        size="large"
                        variant="contained"
                        color="primary"
                        fullWidth
                        className={classes.createAccountButton}
                      >
                        Create your account
                      </Button>
                    )}
                  </div>
                  <div className={classes.formDividerContainer}>
                    <div className={classes.formDivider} />
                    <Typography className={classes.formDividerWord}>
                      or
                    </Typography>
                    <div className={classes.formDivider} />
                  </div>
                  <Button
                    size="large"
                    className={classnames(
                      classes.googleButton,
                      classes.googleButtonCreating
                    )}
                    onClick={() => {
                      /* loginUser(
                        userDispatch,
                        loginValue,
                        passwordValue,
                        props.history,
                        setIsLoading,
                        setError,
                        "google"
                      ) */
                    }}
                  >
                    <img
                      src={google}
                      alt="google"
                      className={classes.googleIcon}
                    />
                    &nbsp;Sign in with Google
                  </Button>
                </React.Fragment>
              )}
            </>
          )}
        </div>
        <Typography color="primary" className={classes.copyright}>
          © 2021 Support, LLC. All rights reserved.
        </Typography>
      </div>
    </Grid>
  );
}

export default withRouter(Login);
