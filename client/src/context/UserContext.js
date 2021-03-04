import React from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import { toast } from "react-toastify";
//import { mockUser } from "./mock";

//config
import config from "../../src/config";

const UserStateContext = React.createContext();
const UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        ...action.payload,
      };
    case "SET_CURRUSER":
      return {
        ...state,
        ...action.payload,
      };

    case "REGISTER_REQUEST":
    case "RESET_REQUEST":
    case "PASSWORD_RESET_EMAIL_REQUEST":
      return {
        ...state,
        isFetching: true,
        errorMessage: "",
      };
    case "SIGN_OUT_SUCCESS":
      return { ...state };
    case "AUTH_INIT_ERROR":
      return Object.assign({}, state, {
        currentUser: null,
        loadingInit: false,
      });
    case "REGISTER_SUCCESS":
    case "RESET_SUCCESS":
    case "PASSWORD_RESET_EMAIL_SUCCESS":
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: "",
      });
    case "AUTH_FAILURE":
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.payload,
      });
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  const [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: () => {
      const token = localStorage.getItem("token");

      if (token) {
        const date = new Date().getTime() / 1000;
        const data = jwt.decode(token);

        if (!data) return false;
        return date < data.exp;
      }
      return false;
    },
    isFetching: false,
    errorMessage: "",
    currentUser: JSON.parse(localStorage.getItem("user")),
    loadingInit: true,
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  const context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  const context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };

// ###########################################################

async function loginUser(
  dispatch,
  login,
  password,
  history,
  setIsLoading,
  setError,
  social = ""
) {
  setError(false);
  setIsLoading(true);

  if (login.length > 0 && password.length > 0) {
    await axios
      .post("/auth/signin/local", { email: login, password })
      .then((res) => {
        console.log("login data", res.data);

        setTimeout(() => {
          setError(null);
          setIsLoading(false);
          receiveToken(res.data, dispatch);
          doInit(res.data.user)(dispatch);
        }, 1000);
      })
      .catch(() => {
        setError(true);
        setIsLoading(false);
      });
  } else {
    dispatch({ type: "LOGIN_FAILURE" });
  }
}

export function sendPasswordResetEmail(email) {
  return async (dispatch) => {
    if (!config.isBackend) {
      return;
    } else {
      dispatch({
        type: "PASSWORD_RESET_EMAIL_REQUEST",
      });
      await axios
        .post("/auth/send-password-reset-email", { email })
        .then((res) => {
          dispatch({
            type: "PASSWORD_RESET_EMAIL_SUCCESS",
          });
          toast.success("Email with resetting instructions has been sent");
        })
        .catch((err) => {
          dispatch(authError(err.response.data));
        });
    }
  };
}
// localStorage.removeItem("token");
// localStorage.removeItem("user");

function signOut(dispatch, history) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  axios.defaults.headers.common["Authorization"] = "";
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}

export function receiveToken(data, dispatch) {
  //const user = jwt.decode(token).user;
  const { token, user } = data;
  console.log("receiveToken", user);
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("theme", "default");
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  //dispatch({ type: "LOGIN_SUCCESS" });
}

// async function findMe() {
//   if (config.isBackend) {
//     const response = await axios.get("/auth/user");
//     return response.data;
//   } else {
//     return mockUser;
//   }
// }

export function authError(payload) {
  return {
    type: "AUTH_FAILURE",
    payload,
  };
}

export function doInit(currentUser) {
  return async (dispatch) => {
    //let currentUser = null;
    console.log("currentUser", currentUser);
    try {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          currentUser,
        },
      });
    } catch (error) {
      console.log(error);

      dispatch({
        type: "AUTH_INIT_ERROR",
        payload: error,
      });
    }
  };
}

export function registerUser(
  dispatch,
  login,
  password,
  history,
  setIsLoading,
  setError,
  social = ""
) {
  return async () => {
    if (!config.isBackend) {
      history.push("/login");
    } else {
      dispatch({
        type: "REGISTER_REQUEST",
      });
      if (login.length > 0 && password.length > 0) {
        await axios
          .post("/auth/signup", { email: login, password })
          .then((res) => {
            dispatch({
              type: "REGISTER_SUCCESS",
            });
            toast.success(
              "You've been registered successfully. Please check your email for verification link"
            );
            history.push("/login");
          })
          .catch((err) => {
            dispatch(authError(err.response.data));
          });
      } else {
        dispatch(authError("Something was wrong. Try again"));
      }
    }
  };
}

export function verifyEmail(token, history) {
  return async (dispatch) => {
    if (!config.isBackend) {
      history.push("/login");
    } else {
      await axios
        .put("/auth/verify-email", { token })
        .then((verified) => {
          if (verified) {
            toast.success("Your email was verified");
          }
        })
        .catch((err) => {
          toast.error(err.response.data);
        })
        .finally(() => {
          history.push("/login");
        });
    }
  };
}

export function resetPassword(token, password, history) {
  return async (dispatch, setIsLoading) => {
    if (!config.isBackend) {
      history.push("/login");
    } else {
      setIsLoading(true);
      dispatch({
        type: "RESET_REQUEST",
      });
      await axios
        .put("/auth/password-reset", { token, password })
        .then((res) => {
          dispatch({
            type: "RESET_SUCCESS",
          });
          setIsLoading(false);
          toast.success("Password has been updated");
          history.push("/login");
        })
        .catch((err) => {
          setIsLoading(false);
          dispatch(authError(err.response.data));
        });
    }
  };
}
