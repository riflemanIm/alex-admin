import React from "react";
import axios from "axios";
import config from "../config";

async function list() {
  const response = await axios.get(`/clinics`);
  return response.data;
}

const ClinicStateContext = React.createContext();
const ClinicDispatchContext = React.createContext();
const initialData = {
  findLoading: false,
  saveLoading: false,
  currentClinic: null,
  rows: [],
  loading: false,
  idToDelete: null,
  modalOpen: false,
  errorMessage: null,
};

function clinicReducer(state = initialData, { type, payload }) {
  if (type === "CLINICS_FORM_RESET") {
    return {
      ...initialData,
    };
  }

  if (type === "CLINICS_FORM_FIND_STARTED") {
    return {
      ...state,
      currentClinic: null,
      services: [],
      medical_net: [],
      findLoading: true,
    };
  }

  if (type === "CLINICS_FORM_FIND_SUCCESS") {
    return {
      ...state,
      ...payload,
      findLoading: false,
    };
  }

  if (type === "CLINICS_FORM_FIND_ERROR") {
    return {
      ...state,
      currentClinic: null,
      services: [],
      medical_net: [],

      findLoading: false,
    };
  }

  if (type === "CLINICS_FORM_CREATE_STARTED") {
    return {
      ...state,
      saveLoading: true,
      currentClinic: { clinic_id: null },
      services: [],
      medical_net: [],
    };
  }

  if (type === "CLINICS_FORM_CREATE_SUCCESS") {
    return {
      ...state,
      saveLoading: false,
      currentClinic: payload,
    };
  }

  if (type === "CLINICS_FORM_CREATE_ERROR") {
    return {
      ...state,
      saveLoading: false,
      errorMessage: payload,
      currentClinic: { clinic_id: null },
    };
  }

  if (type === "CLINICS_FORM_UPDATE_STARTED") {
    return {
      ...state,
      saveLoading: true,
      errorMessage: null,
    };
  }

  if (type === "CLINICS_FORM_UPDATE_SUCCESS") {
    return {
      ...state,
      currentClinic: payload,
      saveLoading: false,
    };
  }

  if (type === "CLINICS_FORM_UPDATE_ERROR") {
    console.log("CLINICS_FORM_UPDATE_ERROR", payload);
    return {
      ...state,
      saveLoading: false,
      errorMessage: payload,
    };
  }

  if (type === "CLINICS_LIST_FETCH_STARTED") {
    return {
      ...state,
      loading: true,
    };
  }

  if (type === "CLINICS_LIST_FETCH_SUCCESS") {
    return {
      ...state,
      loading: false,
      rows: payload.rows,
    };
  }

  if (type === "CLINICS_LIST_FETCH_ERROR") {
    return {
      ...state,
      loading: false,
      rows: [],
    };
  }

  if (type === "CLINICS_LIST_DELETE_STARTED") {
    return {
      ...state,
      loading: true,
      errorMessage: null,
    };
  }

  if (type === "CLINICS_LIST_DELETE_SUCCESS") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
    };
  }

  if (type === "CLINICS_LIST_DELETE_ERROR") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
      errorMessage: payload,
    };
  }

  if (type === "CLINICS_LIST_OPEN_CONFIRM") {
    return {
      ...state,
      loading: false,
      modalOpen: true,
      idToDelete: payload.id,
    };
  }

  if (type === "CLINICS_LIST_CLOSE_CONFIRM") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
    };
  }

  return state;
}

function ClinicProvider({ children }) {
  const [state, dispatch] = React.useReducer(clinicReducer, {
    findLoading: false,
    saveLoading: false,
    currentClinic: { clinic_id: null },
    services: [],
    medical_net: [],
    rows: [],
    loading: false,
    idToDelete: null,
    modalOpen: false,
    errorMessage: null,
  });

  return (
    <ClinicStateContext.Provider value={state}>
      <ClinicDispatchContext.Provider value={dispatch}>
        {children}
      </ClinicDispatchContext.Provider>
    </ClinicStateContext.Provider>
  );
}

function useClinicState() {
  const context = React.useContext(ClinicStateContext);
  if (context === undefined) {
    throw new Error("useClinicState must be used within a ClinicProvider");
  }
  return context;
}

function useClinicDispatch() {
  const context = React.useContext(ClinicDispatchContext);
  if (context === undefined) {
    throw new Error("useClinicDispatch must be used within a ClinicProvider");
  }
  return context;
}

// ###########################################################

const actions = {
  doNew: () => {
    return {
      type: "CLINICS_FORM_RESET",
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: "CLINICS_FORM_FIND_STARTED",
      });
      const req = [
        axios.get(`/clinics/${id}`),
        axios.get("/services"),
        axios.get("/medical_net"),
      ];

      await axios.all(req).then((res) => {
        const currentClinic = res[0].data;
        const services = res[1].data;
        const medical_net = res[2].data;
        dispatch({
          type: "CLINICS_FORM_FIND_SUCCESS",
          payload: { currentClinic, services, medical_net },
        });
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "CLINICS_FORM_FIND_ERROR",
      });
    }
  },

  doReferenceLists: () => async (dispatch) => {
    try {
      dispatch({
        type: "CLINICS_FORM_FIND_STARTED",
      });
      const req = [axios.get("/services"), axios.get("/medical_net")];

      await axios.all(req).then((res) => {
        const services = res[0].data;
        const medical_net = res[1].data;
        dispatch({
          type: "CLINICS_FORM_FIND_SUCCESS",
          payload: { services, medical_net },
        });
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "CLINICS_FORM_FIND_ERROR",
      });
    }
  },

  doCreate: (values, notify) => async (dispatch, history) => {
    try {
      dispatch({
        type: "CLINICS_FORM_CREATE_STARTED",
      });
      await axios
        .post("/clinics", { data: values })
        .then((res) => {
          //console.log("------- doCreate -----------", res.data);
          dispatch({
            type: "CLINICS_FORM_CREATE_SUCCESS",
            payload: { clinic_id: res.data },
          });
          notify("Клиника добавлена");
          history.push("/app/clinic/list");
        })
        .catch((error) => {
          console.log("error", error);
          notify(error.response.data?.err);

          dispatch({
            type: "CLINICS_FORM_CREATE_ERROR",
            payload: error.response.data?.err,
          });
        });
    } catch (error) {
      console.log("error", error);

      notify("Error add clinic");
      dispatch({
        type: "CLINICS_FORM_CREATE_ERROR",
      });
    }
  },

  doUpdate: (id, values, notify) => async (dispatch, history) => {
    dispatch({
      type: "CLINICS_FORM_UPDATE_STARTED",
    });

    await axios
      .put(`/clinics/${id}`, { id, data: values })
      .then((response) => {
        dispatch({
          type: "CLINICS_FORM_UPDATE_SUCCESS",
          payload: values,
        });
        notify();
        console.log("response", response);
        history.push("/app/clinic/list");
      })
      .catch((error) => {
        console.log("error", error);
        notify(error.response.data?.err);

        dispatch({
          type: "CLINICS_FORM_UPDATE_ERROR",
          payload: error.response.data?.err,
        });
      });
  },

  doFetch: (filter, keepPagination = false) => async (dispatch) => {
    try {
      dispatch({
        type: "CLINICS_LIST_FETCH_STARTED",
        payload: { filter, keepPagination },
      });

      const response = await list();

      dispatch({
        type: "CLINICS_LIST_FETCH_SUCCESS",
        payload: {
          rows: response,
          count: response.length,
        },
      });
    } catch (error) {
      console.log(error);

      dispatch({
        type: "CLINICS_LIST_FETCH_ERROR",
      });
    }
  },

  doDelete: (id) => async (dispatch) => {
    if (!config.isBackend) {
      dispatch({
        type: "CLINICS_LIST_DELETE_ERROR",
      });
    } else {
      try {
        dispatch({
          type: "CLINICS_LIST_DELETE_STARTED",
        });

        await axios.delete(`/clinics/${id}`);

        dispatch({
          type: "CLINICS_LIST_DELETE_SUCCESS",
        });
        const response = await list();
        dispatch({
          type: "CLINICS_LIST_FETCH_SUCCESS",
          payload: {
            rows: response,
            count: response.length,
          },
        });
      } catch (error) {
        console.log(error);
        dispatch({
          type: "CLINICS_LIST_DELETE_ERROR",
        });
      }
    }
  },

  doOpenConfirm: (id) => async (dispatch) => {
    dispatch({
      type: "CLINICS_LIST_OPEN_CONFIRM",
      payload: {
        id: id,
      },
    });
  },
  doCloseConfirm: () => async (dispatch) => {
    dispatch({
      type: "CLINICS_LIST_CLOSE_CONFIRM",
    });
  },
};

// eslint-disable-next-line no-use-before-define
export { ClinicProvider, useClinicState, useClinicDispatch, actions };
