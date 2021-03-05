import React from "react";
import axios from "axios";
import config from "../config";

async function list() {
  const response = await axios.get(`/alex`);
  return response.data;
}

const AlexStateContext = React.createContext();
const AlexDispatchContext = React.createContext();
const initialData = {
  findLoading: false,
  saveLoading: false,
  currentAlex: null,
  rows: [],
  loading: false,
  idToDelete: null,
  modalOpen: false,
  errorMessage: null,
};

function alexReducer(state = initialData, { type, payload }) {
  if (type === "ALEXS_FORM_RESET") {
    return {
      ...initialData,
    };
  }

  if (type === "ALEXS_FORM_FIND_STARTED") {
    return {
      ...state,
      currentAlex: null,
      findLoading: true,
    };
  }

  if (type === "ALEXS_FORM_FIND_SUCCESS") {
    return {
      ...state,
      currentAlex: payload,
      findLoading: false,
    };
  }

  if (type === "ALEXS_FORM_FIND_ERROR") {
    return {
      ...state,
      currentAlex: null,
      findLoading: false,
    };
  }

  if (type === "ALEXS_FORM_CREATE_STARTED") {
    return {
      ...state,
      saveLoading: true,
      currentAlex: { username: null },
    };
  }

  if (type === "ALEXS_FORM_CREATE_SUCCESS") {
    return {
      ...state,
      saveLoading: false,
      currentAlex: payload,
    };
  }

  if (type === "ALEXS_FORM_CREATE_ERROR") {
    return {
      ...state,
      saveLoading: false,
      errorMessage: payload,
      currentAlex: { username: null },
    };
  }

  if (type === "ALEXS_FORM_UPDATE_STARTED") {
    return {
      ...state,
      saveLoading: true,
      errorMessage: null,
    };
  }

  if (type === "ALEXS_FORM_UPDATE_SUCCESS") {
    return {
      ...state,
      currentAlex: payload,
      saveLoading: false,
    };
  }

  if (type === "ALEXS_FORM_UPDATE_ERROR") {
    return {
      ...state,
      saveLoading: false,
      errorMessage: payload,
    };
  }

  if (type === "ALEXS_LIST_FETCH_STARTED") {
    return {
      ...state,
      loading: true,
    };
  }

  if (type === "ALEXS_LIST_FETCH_SUCCESS") {
    return {
      ...state,
      loading: false,
      rows: payload.rows,
    };
  }

  if (type === "ALEXS_LIST_FETCH_ERROR") {
    return {
      ...state,
      loading: false,
      rows: [],
    };
  }

  if (type === "ALEXS_LIST_DELETE_STARTED") {
    return {
      ...state,
      loading: true,
      errorMessage: null,
    };
  }

  if (type === "ALEXS_LIST_DELETE_SUCCESS") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
    };
  }

  if (type === "ALEXS_LIST_DELETE_ERROR") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
      errorMessage: payload,
    };
  }

  if (type === "ALEXS_LIST_OPEN_CONFIRM") {
    return {
      ...state,
      loading: false,
      modalOpen: true,
      idToDelete: payload.id,
    };
  }

  if (type === "ALEXS_LIST_CLOSE_CONFIRM") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
    };
  }

  return state;
}

function AlexProvider({ children }) {
  const [state, dispatch] = React.useReducer(alexReducer, {
    findLoading: false,
    saveLoading: false,
    currentAlex: { username: null },
    rows: [],
    loading: false,
    idToDelete: null,
    modalOpen: false,
    errorMessage: null,
  });

  return (
    <AlexStateContext.Provider value={state}>
      <AlexDispatchContext.Provider value={dispatch}>
        {children}
      </AlexDispatchContext.Provider>
    </AlexStateContext.Provider>
  );
}

function useAlexState() {
  const context = React.useContext(AlexStateContext);
  if (context === undefined) {
    throw new Error("useAlexState must be used within a AlexProvider");
  }
  return context;
}

function useAlexDispatch() {
  const context = React.useContext(AlexDispatchContext);
  if (context === undefined) {
    throw new Error("useAlexDispatch must be used within a AlexProvider");
  }
  return context;
}

// ###########################################################

const actions = {
  doNew: () => {
    return {
      type: "ALEXS_FORM_RESET",
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: "ALEXS_FORM_FIND_STARTED",
      });
      const response = await list();
      console.log(response.find((item) => item.username === id));

      dispatch({
        type: "ALEXS_FORM_FIND_SUCCESS",
        payload: response.find((item) => item.username === id),
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ALEXS_FORM_FIND_ERROR",
      });
    }
  },

  doCreate: (values, notify, urlBack) => async (dispatch, history) => {
    try {
      dispatch({
        type: "ALEXS_FORM_CREATE_STARTED",
      });
      await axios
        .post("/alex", { data: values })
        .then((res) => {
          console.log("------- doCreate -----------", res.data);

          dispatch({
            type: "ALEXS_FORM_CREATE_SUCCESS",
            payload: { username: res.data },
          });
          notify();
          history.push(urlBack);
        })
        .catch((error) => {
          console.log("error", error);
          notify(error.response.data?.err);

          dispatch({
            type: "ALEXS_FORM_CREATE_ERROR",
            payload: error.response.data?.err,
          });
        });
    } catch (error) {
      console.log("error", error);

      notify("Error add alex");
      dispatch({
        type: "ALEXS_FORM_CREATE_ERROR",
      });
    }
  },

  doUpdate: (id, values, notify) => async (dispatch, history) => {
    dispatch({
      type: "ALEXS_FORM_UPDATE_STARTED",
    });
    console.log("!!!!!!!!!!", values);
    await axios
      .put(`/alex/${id}`, { id, ...values })
      .then((response) => {
        if (response.data.res === "ok") {
          dispatch({
            type: "ALEXS_FORM_UPDATE_SUCCESS",
            payload: values,
          });
          notify();
          console.log("response", response);
          history.push("/app/alex/list");
        }
      })
      .catch((error) => {
        console.log("error", error);
        notify(error.response?.err);

        dispatch({
          type: "ALEXS_FORM_UPDATE_ERROR",
          payload: error.response?.err,
        });
      });
  },

  doFetch: (filter, keepPagination = false) => async (dispatch) => {
    try {
      dispatch({
        type: "ALEXS_LIST_FETCH_STARTED",
        payload: { filter, keepPagination },
      });

      const response = await list();

      dispatch({
        type: "ALEXS_LIST_FETCH_SUCCESS",
        payload: {
          rows: response,
          count: response.length,
        },
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ALEXS_LIST_FETCH_ERROR",
      });
    }
  },

  doDelete: (id) => async (dispatch) => {
    if (!config.isBackend) {
      dispatch({
        type: "ALEXS_LIST_DELETE_ERROR",
      });
    } else {
      try {
        dispatch({
          type: "ALEXS_LIST_DELETE_STARTED",
        });

        await axios.delete(`/alex/${id}`);

        dispatch({
          type: "ALEXS_LIST_DELETE_SUCCESS",
        });
        const response = await list();
        dispatch({
          type: "ALEXS_LIST_FETCH_SUCCESS",
          payload: {
            rows: response,
            count: response.length,
          },
        });
      } catch (error) {
        console.log(error);
        dispatch({
          type: "ALEXS_LIST_DELETE_ERROR",
        });
      }
    }
  },

  doOpenConfirm: (id) => (dispatch) => {
    dispatch({
      type: "ALEXS_LIST_OPEN_CONFIRM",
      payload: {
        id: id,
      },
    });
  },
  doCloseConfirm: () => (dispatch) => {
    dispatch({
      type: "ALEXS_LIST_CLOSE_CONFIRM",
    });
  },
};

// eslint-disable-next-line no-use-before-define
export { AlexProvider, useAlexState, useAlexDispatch, actions };
