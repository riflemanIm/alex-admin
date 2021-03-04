import React from "react";
import axios from "axios";
import config from "../config";
import { toast } from "react-toastify";

async function list() {
  const response = await axios.get(`/users`);
  return response.data;
}

const ManagementStateContext = React.createContext();
const ManagementDispatchContext = React.createContext();
const initialData = {
  findLoading: false,
  saveLoading: false,
  currentUser: null,
  rows: [],
  loading: false,
  idToDelete: null,
  modalOpen: false,
  errorMessage: null,
};

function managementReducer(state = initialData, { type, payload }) {
  if (type === "USERS_FORM_RESET") {
    return {
      ...initialData,
    };
  }

  if (type === "USERS_FORM_FIND_STARTED") {
    return {
      ...state,
      currentUser: null,
      findLoading: true,
    };
  }

  if (type === "USERS_FORM_FIND_SUCCESS") {
    return {
      ...state,
      currentUser: payload,
      findLoading: false,
    };
  }

  if (type === "USERS_FORM_FIND_ERROR") {
    return {
      ...state,
      currentUser: null,
      findLoading: false,
    };
  }

  if (type === "USERS_FORM_CREATE_STARTED") {
    return {
      ...state,
      saveLoading: true,
      currentUser: { user_id: null },
    };
  }

  if (type === "USERS_FORM_CREATE_SUCCESS") {
    return {
      ...state,
      saveLoading: false,
      currentUser: payload,
    };
  }

  if (type === "USERS_FORM_CREATE_ERROR") {
    return {
      ...state,
      saveLoading: false,
      errorMessage: payload,
      currentUser: { user_id: null },
    };
  }

  if (type === "USERS_FORM_UPDATE_STARTED") {
    return {
      ...state,
      saveLoading: true,
      errorMessage: null,
    };
  }

  if (type === "USERS_FORM_UPDATE_SUCCESS") {
    return {
      ...state,
      currentUser: payload,
      saveLoading: false,
    };
  }

  if (type === "USERS_FORM_UPDATE_ERROR") {
    console.log("USERS_FORM_UPDATE_ERROR", payload);
    return {
      ...state,
      saveLoading: false,
      errorMessage: payload,
    };
  }

  if (type === "USERS_LIST_FETCH_STARTED") {
    return {
      ...state,
      loading: true,
    };
  }

  if (type === "USERS_LIST_FETCH_SUCCESS") {
    return {
      ...state,
      loading: false,
      rows: payload.rows,
    };
  }

  if (type === "USERS_LIST_FETCH_ERROR") {
    return {
      ...state,
      loading: false,
      rows: [],
    };
  }

  if (type === "USERS_LIST_DELETE_STARTED") {
    return {
      ...state,
      loading: true,
      errorMessage: null,
    };
  }

  if (type === "USERS_LIST_DELETE_SUCCESS") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
    };
  }

  if (type === "USERS_LIST_DELETE_ERROR") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
      errorMessage: payload,
    };
  }

  if (type === "USERS_LIST_OPEN_CONFIRM") {
    return {
      ...state,
      loading: false,
      modalOpen: true,
      idToDelete: payload.id,
    };
  }

  if (type === "USERS_LIST_CLOSE_CONFIRM") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
    };
  }

  return state;
}

function ManagementProvider({ children }) {
  const [state, dispatch] = React.useReducer(managementReducer, {
    findLoading: false,
    saveLoading: false,
    currentUser: { user_id: null },
    rows: [],
    loading: false,
    idToDelete: null,
    modalOpen: false,
    errorMessage: null,
  });

  return (
    <ManagementStateContext.Provider value={state}>
      <ManagementDispatchContext.Provider value={dispatch}>
        {children}
      </ManagementDispatchContext.Provider>
    </ManagementStateContext.Provider>
  );
}

function useManagementState() {
  const context = React.useContext(ManagementStateContext);
  if (context === undefined) {
    throw new Error(
      "useManagementState must be used within a ManagementProvider"
    );
  }
  return context;
}

function useManagementDispatch() {
  const context = React.useContext(ManagementDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useManagementDispatch must be used within a ManagementProvider"
    );
  }
  return context;
}

// ###########################################################

const actions = {
  doNew: () => {
    return {
      type: "USERS_FORM_RESET",
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: "USERS_FORM_FIND_STARTED",
      });

      axios.get(`/users/${id}`).then((res) => {
        const currentUser = res.data;

        dispatch({
          type: "USERS_FORM_FIND_SUCCESS",
          payload: currentUser,
        });
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "USERS_FORM_FIND_ERROR",
      });
    }
  },

  doCreate: (values, backStep, notify) => async (dispatch, history) => {
    try {
      dispatch({
        type: "USERS_FORM_CREATE_STARTED",
      });
      axios
        .post("/users", { data: values })
        .then((res) => {
          console.log("------- doCreate -----------", res.data);

          dispatch({
            type: "USERS_FORM_CREATE_SUCCESS",
            payload: { user_id: res.data },
          });
          notify();
          history.push("/app/user/list");
        })
        .catch((error) => {
          console.log("error", error);
          notify(error.response.data?.err);

          dispatch({
            type: "USERS_FORM_CREATE_ERROR",
            payload: error.response.data?.err,
          });
          backStep();
        });
    } catch (error) {
      console.log("error", error);

      notify("Error add user");
      dispatch({
        type: "USERS_FORM_CREATE_ERROR",
      });
    }
  },

  doUpdate: (id, values, notify) => async (dispatch, history) => {
    dispatch({
      type: "USERS_FORM_UPDATE_STARTED",
    });

    await axios
      .put(`/users/${id}`, { id, data: values })
      .then((response) => {
        dispatch({
          type: "USERS_FORM_UPDATE_SUCCESS",
          payload: values,
        });
        notify();
        console.log("response", response);
        history.push("/app/user/list");
      })
      .catch((error) => {
        console.log("error", error);
        notify(error.response?.data?.err);

        dispatch({
          type: "USERS_FORM_UPDATE_ERROR",
          payload: error.response?.data?.err,
        });
      });

    // try {
    //   dispatch({
    //     type: "USERS_FORM_UPDATE_STARTED",
    //   });
    //   await axios.put(`/users/${id}`, { id, data: values });

    //   dispatch({
    //     type: "USERS_FORM_UPDATE_SUCCESS",
    //     payload: values,
    //   });

    //   history.push("/app/user/list");
    // } catch (e) {
    //   dispatch({
    //     type: "USERS_FORM_UPDATE_ERROR",
    //     payload: e.response.data?.err,
    //   });
    // }
  },

  doChangePassword: ({ newPassword, currentPassword }) => async (dispatch) => {
    try {
      dispatch({
        type: "USERS_FORM_CREATE_STARTED",
      });
      await axios.put("/auth/password-update", {
        newPassword,
        currentPassword,
      });
      dispatch({
        type: "USERS_PASSWORD_UPDATE_SUCCESS",
      });

      toast("Password updated");
    } catch (error) {
      console.log(error);

      dispatch({
        type: "USERS_FORM_CREATE_ERROR",
      });
    }
  },

  doFetch: (filter, keepPagination = false) => async (dispatch) => {
    try {
      dispatch({
        type: "USERS_LIST_FETCH_STARTED",
        payload: { filter, keepPagination },
      });

      const response = await list();

      dispatch({
        type: "USERS_LIST_FETCH_SUCCESS",
        payload: {
          rows: response,
          count: response.length,
        },
      });
    } catch (error) {
      console.log(error);

      dispatch({
        type: "USERS_LIST_FETCH_ERROR",
      });
    }
  },

  doDelete: (id) => async (dispatch) => {
    if (!config.isBackend) {
      dispatch({
        type: "USERS_LIST_DELETE_ERROR",
      });
    } else {
      try {
        dispatch({
          type: "USERS_LIST_DELETE_STARTED",
        });

        await axios.delete(`/users/${id}`);

        dispatch({
          type: "USERS_LIST_DELETE_SUCCESS",
        });
        const response = await list();
        dispatch({
          type: "USERS_LIST_FETCH_SUCCESS",
          payload: {
            rows: response,
            count: response.length,
          },
        });
      } catch (error) {
        console.log(error);
        dispatch({
          type: "USERS_LIST_DELETE_ERROR",
        });
      }
    }
  },

  doOpenConfirm: (id) => (dispatch) => {
    dispatch({
      type: "USERS_LIST_OPEN_CONFIRM",
      payload: {
        id: id,
      },
    });
  },
  doCloseConfirm: () => (dispatch) => {
    dispatch({
      type: "USERS_LIST_CLOSE_CONFIRM",
    });
  },
};

// eslint-disable-next-line no-use-before-define
export {
  ManagementProvider,
  useManagementState,
  useManagementDispatch,
  actions,
};
