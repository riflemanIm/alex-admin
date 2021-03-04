import React from "react";
import axios from "axios";
import config from "../config";

async function list() {
  const response = await axios.get(`/regions`);
  return response.data;
}

const RegionStateContext = React.createContext();
const RegionDispatchContext = React.createContext();
const initialData = {
  findLoading: false,
  saveLoading: false,
  currentRegion: null,
  rows: [],
  loading: false,
  idToDelete: null,
  modalOpen: false,
  errorMessage: null,
};

function regionReducer(state = initialData, { type, payload }) {
  if (type === "REGIONS_FORM_RESET") {
    return {
      ...initialData,
    };
  }

  if (type === "REGIONS_FORM_FIND_STARTED") {
    return {
      ...state,
      currentRegion: null,
      findLoading: true,
    };
  }

  if (type === "REGIONS_FORM_FIND_SUCCESS") {
    return {
      ...state,
      currentRegion: payload,
      findLoading: false,
    };
  }

  if (type === "REGIONS_FORM_FIND_ERROR") {
    return {
      ...state,
      currentRegion: null,
      findLoading: false,
    };
  }

  if (type === "REGIONS_FORM_CREATE_STARTED") {
    return {
      ...state,
      saveLoading: true,
      currentRegion: { region_id: null },
    };
  }

  if (type === "REGIONS_FORM_CREATE_SUCCESS") {
    return {
      ...state,
      saveLoading: false,
      currentRegion: payload,
    };
  }

  if (type === "REGIONS_FORM_CREATE_ERROR") {
    return {
      ...state,
      saveLoading: false,
      errorMessage: payload,
      currentRegion: { region_id: null },
    };
  }

  if (type === "REGIONS_FORM_UPDATE_STARTED") {
    return {
      ...state,
      saveLoading: true,
      errorMessage: null,
    };
  }

  if (type === "REGIONS_FORM_UPDATE_SUCCESS") {
    return {
      ...state,
      currentRegion: payload,
      saveLoading: false,
    };
  }

  if (type === "REGIONS_FORM_UPDATE_ERROR") {
    return {
      ...state,
      saveLoading: false,
      errorMessage: payload,
    };
  }

  if (type === "REGIONS_LIST_FETCH_STARTED") {
    return {
      ...state,
      loading: true,
    };
  }

  if (type === "REGIONS_LIST_FETCH_SUCCESS") {
    return {
      ...state,
      loading: false,
      rows: payload.rows,
    };
  }

  if (type === "REGIONS_LIST_FETCH_ERROR") {
    return {
      ...state,
      loading: false,
      rows: [],
    };
  }

  if (type === "REGIONS_LIST_DELETE_STARTED") {
    return {
      ...state,
      loading: true,
      errorMessage: null,
    };
  }

  if (type === "REGIONS_LIST_DELETE_SUCCESS") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
    };
  }

  if (type === "REGIONS_LIST_DELETE_ERROR") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
      errorMessage: payload,
    };
  }

  if (type === "REGIONS_LIST_OPEN_CONFIRM") {
    return {
      ...state,
      loading: false,
      modalOpen: true,
      idToDelete: payload.id,
    };
  }

  if (type === "REGIONS_LIST_CLOSE_CONFIRM") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
    };
  }

  return state;
}

function RegionProvider({ children }) {
  const [state, dispatch] = React.useReducer(regionReducer, {
    findLoading: false,
    saveLoading: false,
    currentRegion: { region_id: null },
    rows: [],
    loading: false,
    idToDelete: null,
    modalOpen: false,
    errorMessage: null,
  });

  return (
    <RegionStateContext.Provider value={state}>
      <RegionDispatchContext.Provider value={dispatch}>
        {children}
      </RegionDispatchContext.Provider>
    </RegionStateContext.Provider>
  );
}

function useRegionState() {
  const context = React.useContext(RegionStateContext);
  if (context === undefined) {
    throw new Error("useRegionState must be used within a RegionProvider");
  }
  return context;
}

function useRegionDispatch() {
  const context = React.useContext(RegionDispatchContext);
  if (context === undefined) {
    throw new Error("useRegionDispatch must be used within a RegionProvider");
  }
  return context;
}

// ###########################################################

const actions = {
  doNew: () => {
    return {
      type: "REGIONS_FORM_RESET",
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: "REGIONS_FORM_FIND_STARTED",
      });

      axios.get(`/regions/${id}`).then((res) => {
        const currentRegion = res.data;

        dispatch({
          type: "REGIONS_FORM_FIND_SUCCESS",
          payload: currentRegion,
        });
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "REGIONS_FORM_FIND_ERROR",
      });
    }
  },

  doCreate: (values, notify) => async (dispatch, history) => {
    try {
      dispatch({
        type: "REGIONS_FORM_CREATE_STARTED",
      });
      await axios
        .post("/regions", { data: values })
        .then((res) => {
          console.log("------- doCreate -----------", res.data);

          dispatch({
            type: "REGIONS_FORM_CREATE_SUCCESS",
            payload: { region_id: res.data },
          });
          notify();
          history.push("/app/region/list");
        })
        .catch((error) => {
          console.log("error", error);
          notify(error.response.data?.err);

          dispatch({
            type: "REGIONS_FORM_CREATE_ERROR",
            payload: error.response.data?.err,
          });
        });
    } catch (error) {
      console.log("error", error);

      notify("Error add region");
      dispatch({
        type: "REGIONS_FORM_CREATE_ERROR",
      });
    }
  },

  doUpdate: (id, values, notify) => async (dispatch, history) => {
    dispatch({
      type: "REGIONS_FORM_UPDATE_STARTED",
    });

    await axios
      .put(`/regions/${id}`, { id, data: values })
      .then((response) => {
        dispatch({
          type: "REGIONS_FORM_UPDATE_SUCCESS",
          payload: values,
        });
        notify();
        console.log("response", response);
        history.push("/app/region/list");
      })
      .catch((error) => {
        console.log("error", error);
        notify(error.response.data?.err);

        dispatch({
          type: "REGIONS_FORM_UPDATE_ERROR",
          payload: error.response.data?.err,
        });
      });
  },

  doFetch: (filter, keepPagination = false) => async (dispatch) => {
    try {
      dispatch({
        type: "REGIONS_LIST_FETCH_STARTED",
        payload: { filter, keepPagination },
      });

      const response = await list();

      dispatch({
        type: "REGIONS_LIST_FETCH_SUCCESS",
        payload: {
          rows: response,
          count: response.length,
        },
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "REGIONS_LIST_FETCH_ERROR",
      });
    }
  },

  doDelete: (id) => async (dispatch) => {
    if (!config.isBackend) {
      dispatch({
        type: "REGIONS_LIST_DELETE_ERROR",
      });
    } else {
      try {
        dispatch({
          type: "REGIONS_LIST_DELETE_STARTED",
        });

        await axios.delete(`/regions/${id}`);

        dispatch({
          type: "REGIONS_LIST_DELETE_SUCCESS",
        });
        const response = await list();
        dispatch({
          type: "REGIONS_LIST_FETCH_SUCCESS",
          payload: {
            rows: response,
            count: response.length,
          },
        });
      } catch (error) {
        console.log(error);
        dispatch({
          type: "REGIONS_LIST_DELETE_ERROR",
        });
      }
    }
  },

  doOpenConfirm: (id) => (dispatch) => {
    dispatch({
      type: "REGIONS_LIST_OPEN_CONFIRM",
      payload: {
        id: id,
      },
    });
  },
  doCloseConfirm: () => (dispatch) => {
    dispatch({
      type: "REGIONS_LIST_CLOSE_CONFIRM",
    });
  },
};

// eslint-disable-next-line no-use-before-define
export { RegionProvider, useRegionState, useRegionDispatch, actions };
