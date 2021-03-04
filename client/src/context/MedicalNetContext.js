import React from "react";
import axios from "axios";
import config from "../config";

async function list() {
  const response = await axios.get(`/medical_net`);
  return response.data;
}

const MedicalNetStateContext = React.createContext();
const MedicalNetDispatchContext = React.createContext();
const initialData = {
  findLoading: false,
  saveLoading: false,
  currentMedicalNet: null,
  rows: [],
  loading: false,
  idToDelete: null,
  modalOpen: false,
  errorMessage: null,
};

function MedicalNetReducer(state = initialData, { type, payload }) {
  if (type === "MEDICALNET_FORM_RESET") {
    return {
      ...initialData,
    };
  }

  if (type === "MEDICALNET_FORM_FIND_STARTED") {
    return {
      ...state,
      currentMedicalNet: null,
      findLoading: true,
    };
  }

  if (type === "MEDICALNET_FORM_FIND_SUCCESS") {
    return {
      ...state,
      currentMedicalNet: payload,
      findLoading: false,
    };
  }

  if (type === "MEDICALNET_FORM_FIND_ERROR") {
    return {
      ...state,
      currentMedicalNet: null,
      findLoading: false,
    };
  }

  if (type === "MEDICALNET_FORM_CREATE_STARTED") {
    return {
      ...state,
      saveLoading: true,
      currentMedicalNet: { medical_net_id: null },
    };
  }

  if (type === "MEDICALNET_FORM_CREATE_SUCCESS") {
    return {
      ...state,
      saveLoading: false,
      currentMedicalNet: payload,
    };
  }

  if (type === "MEDICALNET_FORM_CREATE_ERROR") {
    return {
      ...state,
      saveLoading: false,
      errorMessage: payload,
      currentMedicalNet: { medical_net_id: null },
    };
  }

  if (type === "MEDICALNET_FORM_UPDATE_STARTED") {
    return {
      ...state,
      saveLoading: true,
      errorMessage: null,
    };
  }

  if (type === "MEDICALNET_FORM_UPDATE_SUCCESS") {
    return {
      ...state,
      currentMedicalNet: payload,
      saveLoading: false,
    };
  }

  if (type === "MEDICALNET_FORM_UPDATE_ERROR") {
    return {
      ...state,
      saveLoading: false,
      errorMessage: payload,
    };
  }

  if (type === "MEDICALNET_LIST_FETCH_STARTED") {
    return {
      ...state,
      loading: true,
    };
  }

  if (type === "MEDICALNET_LIST_FETCH_SUCCESS") {
    return {
      ...state,
      loading: false,
      rows: payload.rows,
    };
  }

  if (type === "MEDICALNET_LIST_FETCH_ERROR") {
    return {
      ...state,
      loading: false,
      rows: [],
    };
  }

  if (type === "MEDICALNET_LIST_DELETE_STARTED") {
    return {
      ...state,
      loading: true,
      errorMessage: null,
    };
  }

  if (type === "MEDICALNET_LIST_DELETE_SUCCESS") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
    };
  }

  if (type === "MEDICALNET_LIST_DELETE_ERROR") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
      errorMessage: payload,
    };
  }

  if (type === "MEDICALNET_LIST_OPEN_CONFIRM") {
    return {
      ...state,
      loading: false,
      modalOpen: true,
      idToDelete: payload.id,
    };
  }

  if (type === "MEDICALNET_LIST_CLOSE_CONFIRM") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
    };
  }

  return state;
}

function MedicalNetProvider({ children }) {
  const [state, dispatch] = React.useReducer(MedicalNetReducer, {
    findLoading: false,
    saveLoading: false,
    currentMedicalNet: { medical_net_id: null },
    rows: [],
    loading: false,
    idToDelete: null,
    modalOpen: false,
    errorMessage: null,
  });

  return (
    <MedicalNetStateContext.Provider value={state}>
      <MedicalNetDispatchContext.Provider value={dispatch}>
        {children}
      </MedicalNetDispatchContext.Provider>
    </MedicalNetStateContext.Provider>
  );
}

function useMedicalNetState() {
  const context = React.useContext(MedicalNetStateContext);
  if (context === undefined) {
    throw new Error(
      "useMedicalNetState must be used within a MedicalNetProvider"
    );
  }
  return context;
}

function useMedicalNetDispatch() {
  const context = React.useContext(MedicalNetDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useMedicalNetDispatch must be used within a MedicalNetProvider"
    );
  }
  return context;
}

// ###########################################################

const actions = {
  doNew: () => {
    return {
      type: "MEDICALNET_FORM_RESET",
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: "MEDICALNET_FORM_FIND_STARTED",
      });

      await axios.get(`/medical_net/${id}`).then((res) => {
        const currentMedicalNet = res.data;

        dispatch({
          type: "MEDICALNET_FORM_FIND_SUCCESS",
          payload: currentMedicalNet,
        });
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "MEDICALNET_FORM_FIND_ERROR",
      });
    }
  },

  doCreate: (values, notify, urlBack) => async (dispatch, history) => {
    try {
      dispatch({
        type: "MEDICALNET_FORM_CREATE_STARTED",
      });
      await axios
        .post("/medical_net", { data: values })
        .then((res) => {
          console.log("------- doCreate -----------", res.data);

          dispatch({
            type: "MEDICALNET_FORM_CREATE_SUCCESS",
            payload: { medical_net_id: res.data },
          });
          notify();
          history.push(urlBack);
        })
        .catch((error) => {
          console.log("error", error);
          notify(error.response.data?.err);

          dispatch({
            type: "MEDICALNET_FORM_CREATE_ERROR",
            payload: error.response.data?.err,
          });
        });
    } catch (error) {
      console.log("error", error);
      notify("Error add Medical Net");
      dispatch({
        type: "MEDICALNET_FORM_CREATE_ERROR",
      });
    }
  },

  doUpdate: (id, values, notify) => async (dispatch, history) => {
    dispatch({
      type: "MEDICALNET_FORM_UPDATE_STARTED",
    });

    await axios
      .put(`/medical_net/${id}`, { id, data: values })
      .then((response) => {
        dispatch({
          type: "MEDICALNET_FORM_UPDATE_SUCCESS",
          payload: values,
        });
        notify();
        // console.log("response", response);
        history.push("/app/medical_net/list");
      })
      .catch((error) => {
        console.log("error", error);
        notify(error.response.data?.err);

        dispatch({
          type: "MEDICALNET_FORM_UPDATE_ERROR",
          payload: error.response.data?.err,
        });
      });
  },

  doFetch: (filter, keepPagination = false) => async (dispatch) => {
    try {
      dispatch({
        type: "MEDICALNET_LIST_FETCH_STARTED",
        payload: { filter, keepPagination },
      });

      const response = await list();

      dispatch({
        type: "MEDICALNET_LIST_FETCH_SUCCESS",
        payload: {
          rows: response,
          count: response.length,
        },
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "MEDICALNET_LIST_FETCH_ERROR",
      });
    }
  },

  doDelete: (id) => async (dispatch) => {
    if (!config.isBackend) {
      dispatch({
        type: "MEDICALNET_LIST_DELETE_ERROR",
      });
    } else {
      try {
        dispatch({
          type: "MEDICALNET_LIST_DELETE_STARTED",
        });

        await axios.delete(`/medical_net/${id}`);

        dispatch({
          type: "MEDICALNET_LIST_DELETE_SUCCESS",
        });
        const response = await list();
        dispatch({
          type: "MEDICALNET_LIST_FETCH_SUCCESS",
          payload: {
            rows: response,
            count: response.length,
          },
        });
      } catch (error) {
        console.log(error);
        dispatch({
          type: "MEDICALNET_LIST_DELETE_ERROR",
        });
      }
    }
  },

  doOpenConfirm: (id) => (dispatch) => {
    dispatch({
      type: "MEDICALNET_LIST_OPEN_CONFIRM",
      payload: {
        id: id,
      },
    });
  },
  doCloseConfirm: () => (dispatch) => {
    dispatch({
      type: "MEDICALNET_LIST_CLOSE_CONFIRM",
    });
  },
};

// eslint-disable-next-line no-use-before-define
export {
  MedicalNetProvider,
  useMedicalNetState,
  useMedicalNetDispatch,
  actions,
};
