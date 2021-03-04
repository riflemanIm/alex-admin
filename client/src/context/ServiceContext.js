import React from "react";
import axios from "axios";
import config from "../config";

async function list() {
  const response = await axios.get(`/services`);
  return response.data;
}

const ServiceStateContext = React.createContext();
const ServiceDispatchContext = React.createContext();
const initialData = {
  findLoading: false,
  saveLoading: false,
  currentService: null,
  rows: [],
  loading: false,
  idToDelete: null,
  modalOpen: false,
  errorMessage: null,
};

function serviceReducer(state = initialData, { type, payload }) {
  if (type === "SERVICES_FORM_RESET") {
    return {
      ...initialData,
    };
  }

  if (type === "SERVICES_FORM_FIND_STARTED") {
    return {
      ...state,
      currentService: null,
      findLoading: true,
    };
  }

  if (type === "SERVICES_FORM_FIND_SUCCESS") {
    return {
      ...state,
      currentService: payload,
      findLoading: false,
    };
  }

  if (type === "SERVICES_FORM_FIND_ERROR") {
    return {
      ...state,
      currentService: null,
      findLoading: false,
    };
  }

  if (type === "SERVICES_FORM_CREATE_STARTED") {
    return {
      ...state,
      saveLoading: true,
      currentService: { service_id: null },
    };
  }

  if (type === "SERVICES_FORM_CREATE_SUCCESS") {
    return {
      ...state,
      saveLoading: false,
      currentService: payload,
    };
  }

  if (type === "SERVICES_FORM_CREATE_ERROR") {
    return {
      ...state,
      saveLoading: false,
      errorMessage: payload,
      currentService: { service_id: null },
    };
  }

  if (type === "SERVICES_FORM_UPDATE_STARTED") {
    return {
      ...state,
      saveLoading: true,
      errorMessage: null,
    };
  }

  if (type === "SERVICES_FORM_UPDATE_SUCCESS") {
    return {
      ...state,
      currentService: payload,
      saveLoading: false,
    };
  }

  if (type === "SERVICES_FORM_UPDATE_ERROR") {
    return {
      ...state,
      saveLoading: false,
      errorMessage: payload,
    };
  }

  if (type === "SERVICES_LIST_FETCH_STARTED") {
    return {
      ...state,
      loading: true,
    };
  }

  if (type === "SERVICES_LIST_FETCH_SUCCESS") {
    return {
      ...state,
      loading: false,
      rows: payload.rows,
    };
  }

  if (type === "SERVICES_LIST_FETCH_ERROR") {
    return {
      ...state,
      loading: false,
      rows: [],
    };
  }

  if (type === "SERVICES_LIST_DELETE_STARTED") {
    return {
      ...state,
      loading: true,
      errorMessage: null,
    };
  }

  if (type === "SERVICES_LIST_DELETE_SUCCESS") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
    };
  }

  if (type === "SERVICES_LIST_DELETE_ERROR") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
      errorMessage: payload,
    };
  }

  if (type === "SERVICES_LIST_OPEN_CONFIRM") {
    return {
      ...state,
      loading: false,
      modalOpen: true,
      idToDelete: payload.id,
    };
  }

  if (type === "SERVICES_LIST_CLOSE_CONFIRM") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
    };
  }

  return state;
}

function ServiceProvider({ children }) {
  const [state, dispatch] = React.useReducer(serviceReducer, {
    findLoading: false,
    saveLoading: false,
    currentService: { service_id: null },
    rows: [],
    loading: false,
    idToDelete: null,
    modalOpen: false,
    errorMessage: null,
  });

  return (
    <ServiceStateContext.Provider value={state}>
      <ServiceDispatchContext.Provider value={dispatch}>
        {children}
      </ServiceDispatchContext.Provider>
    </ServiceStateContext.Provider>
  );
}

function useServiceState() {
  const context = React.useContext(ServiceStateContext);
  if (context === undefined) {
    throw new Error("useServiceState must be used within a ServiceProvider");
  }
  return context;
}

function useServiceDispatch() {
  const context = React.useContext(ServiceDispatchContext);
  if (context === undefined) {
    throw new Error("useServiceDispatch must be used within a ServiceProvider");
  }
  return context;
}

// ###########################################################

const actions = {
  doNew: () => {
    return {
      type: "SERVICES_FORM_RESET",
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: "SERVICES_FORM_FIND_STARTED",
      });

      axios.get(`/services/${id}`).then((res) => {
        const currentService = res.data;

        dispatch({
          type: "SERVICES_FORM_FIND_SUCCESS",
          payload: currentService,
        });
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "SERVICES_FORM_FIND_ERROR",
      });
    }
  },

  doCreate: (values, notify, urlBack) => async (dispatch, history) => {
    try {
      dispatch({
        type: "SERVICES_FORM_CREATE_STARTED",
      });
      await axios
        .post("/services", { data: values })
        .then((res) => {
          console.log("------- doCreate -----------", res.data);

          dispatch({
            type: "SERVICES_FORM_CREATE_SUCCESS",
            payload: { service_id: res.data },
          });
          notify();
          history.push(urlBack);
        })
        .catch((error) => {
          console.log("error", error);
          notify(error.response.data?.err);

          dispatch({
            type: "SERVICES_FORM_CREATE_ERROR",
            payload: error.response.data?.err,
          });
        });
    } catch (error) {
      console.log("error", error);

      notify("Error add service");
      dispatch({
        type: "SERVICES_FORM_CREATE_ERROR",
      });
    }
  },

  doUpdate: (id, values, notify) => async (dispatch, history) => {
    dispatch({
      type: "SERVICES_FORM_UPDATE_STARTED",
    });

    await axios
      .put(`/services/${id}`, { id, data: values })
      .then((response) => {
        dispatch({
          type: "SERVICES_FORM_UPDATE_SUCCESS",
          payload: values,
        });
        notify();
        console.log("response", response);
        history.push("/app/service/list");
      })
      .catch((error) => {
        console.log("error", error);
        notify(error.response.data?.err);

        dispatch({
          type: "SERVICES_FORM_UPDATE_ERROR",
          payload: error.response.data?.err,
        });
      });
  },

  doFetch: (filter, keepPagination = false) => async (dispatch) => {
    try {
      dispatch({
        type: "SERVICES_LIST_FETCH_STARTED",
        payload: { filter, keepPagination },
      });

      const response = await list();

      dispatch({
        type: "SERVICES_LIST_FETCH_SUCCESS",
        payload: {
          rows: response,
          count: response.length,
        },
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "SERVICES_LIST_FETCH_ERROR",
      });
    }
  },

  doDelete: (id) => async (dispatch) => {
    if (!config.isBackend) {
      dispatch({
        type: "SERVICES_LIST_DELETE_ERROR",
      });
    } else {
      try {
        dispatch({
          type: "SERVICES_LIST_DELETE_STARTED",
        });

        await axios.delete(`/services/${id}`);

        dispatch({
          type: "SERVICES_LIST_DELETE_SUCCESS",
        });
        const response = await list();
        dispatch({
          type: "SERVICES_LIST_FETCH_SUCCESS",
          payload: {
            rows: response,
            count: response.length,
          },
        });
      } catch (error) {
        console.log(error);
        dispatch({
          type: "SERVICES_LIST_DELETE_ERROR",
        });
      }
    }
  },

  doOpenConfirm: (id) => (dispatch) => {
    dispatch({
      type: "SERVICES_LIST_OPEN_CONFIRM",
      payload: {
        id: id,
      },
    });
  },
  doCloseConfirm: () => (dispatch) => {
    dispatch({
      type: "SERVICES_LIST_CLOSE_CONFIRM",
    });
  },
};

// eslint-disable-next-line no-use-before-define
export { ServiceProvider, useServiceState, useServiceDispatch, actions };
