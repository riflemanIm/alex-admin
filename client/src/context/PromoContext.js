import React from "react";
import axios from "axios";
import config from "../config";

async function list() {
  const response = await axios.get(`/promos`);
  return response.data;
}

const PromoStateContext = React.createContext();
const PromoDispatchContext = React.createContext();
const initialData = {
  findLoading: false,
  saveLoading: false,
  currentPromo: null,
  rows: [],
  loading: false,
  idToDelete: null,
  modalOpen: false,
  errorMessage: null,
};

function promoReducer(state = initialData, { type, payload }) {
  if (type === "PROMOS_FORM_RESET") {
    return {
      ...initialData,
    };
  }

  if (type === "PROMOS_FORM_FIND_STARTED") {
    return {
      ...state,
      currentPromo: null,
      findLoading: true,
    };
  }

  if (type === "PROMOS_FORM_FIND_SUCCESS") {
    return {
      ...state,
      currentPromo: payload,
      findLoading: false,
    };
  }

  if (type === "PROMOS_FORM_FIND_ERROR") {
    return {
      ...state,
      currentPromo: null,
      findLoading: false,
    };
  }

  if (type === "PROMOS_FORM_CREATE_STARTED") {
    return {
      ...state,
      saveLoading: true,
      currentPromo: { promo_id: null },
    };
  }

  if (type === "PROMOS_FORM_CREATE_SUCCESS") {
    return {
      ...state,
      saveLoading: false,
      currentPromo: payload,
    };
  }

  if (type === "PROMOS_FORM_CREATE_ERROR") {
    return {
      ...state,
      saveLoading: false,
      errorMessage: payload,
      currentPromo: { promo_id: null },
    };
  }

  if (type === "PROMOS_FORM_UPDATE_STARTED") {
    return {
      ...state,
      saveLoading: true,
      errorMessage: null,
    };
  }

  if (type === "PROMOS_FORM_UPDATE_SUCCESS") {
    return {
      ...state,
      currentPromo: payload,
      saveLoading: false,
    };
  }

  if (type === "PROMOS_FORM_UPDATE_ERROR") {
    return {
      ...state,
      saveLoading: false,
      errorMessage: payload,
    };
  }

  if (type === "PROMOS_LIST_FETCH_STARTED") {
    return {
      ...state,
      loading: true,
    };
  }

  if (type === "PROMOS_LIST_FETCH_SUCCESS") {
    return {
      ...state,
      loading: false,
      rows: payload.rows,
    };
  }

  if (type === "PROMOS_LIST_FETCH_ERROR") {
    return {
      ...state,
      loading: false,
      rows: [],
    };
  }

  if (type === "PROMOS_LIST_DELETE_STARTED") {
    return {
      ...state,
      loading: true,
      errorMessage: null,
    };
  }

  if (type === "PROMOS_LIST_DELETE_SUCCESS") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
    };
  }

  if (type === "PROMOS_LIST_DELETE_ERROR") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
      errorMessage: payload,
    };
  }

  if (type === "PROMOS_LIST_OPEN_CONFIRM") {
    return {
      ...state,
      loading: false,
      modalOpen: true,
      idToDelete: payload.id,
    };
  }

  if (type === "PROMOS_LIST_CLOSE_CONFIRM") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
    };
  }

  return state;
}

function PromoProvider({ children }) {
  const [state, dispatch] = React.useReducer(promoReducer, {
    findLoading: false,
    saveLoading: false,
    currentPromo: { promo_id: null },
    rows: [],
    loading: false,
    idToDelete: null,
    modalOpen: false,
    errorMessage: null,
  });

  return (
    <PromoStateContext.Provider value={state}>
      <PromoDispatchContext.Provider value={dispatch}>
        {children}
      </PromoDispatchContext.Provider>
    </PromoStateContext.Provider>
  );
}

function usePromoState() {
  const context = React.useContext(PromoStateContext);
  if (context === undefined) {
    throw new Error("usePromoState must be used within a PromoProvider");
  }
  return context;
}

function usePromoDispatch() {
  const context = React.useContext(PromoDispatchContext);
  if (context === undefined) {
    throw new Error("usePromoDispatch must be used within a PromoProvider");
  }
  return context;
}

// ###########################################################

const actions = {
  doNew: () => {
    return {
      type: "PROMOS_FORM_RESET",
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: "PROMOS_FORM_FIND_STARTED",
      });

      await axios.get(`/promos/${id}`).then((res) => {
        const currentPromo = res.data;

        dispatch({
          type: "PROMOS_FORM_FIND_SUCCESS",
          payload: currentPromo,
        });
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "PROMOS_FORM_FIND_ERROR",
      });
    }
  },

  doCreate: (values, notify) => async (dispatch, history) => {
    try {
      dispatch({
        type: "PROMOS_FORM_CREATE_STARTED",
      });
      await axios
        .post("/promos", { data: values })
        .then((res) => {
          console.log("------- doCreate -----------", res.data);

          dispatch({
            type: "PROMOS_FORM_CREATE_SUCCESS",
            payload: { promo_id: res.data },
          });
          notify();
          history.push("/app/promo/list");
        })
        .catch((error) => {
          console.log("error", error);
          notify(error.response.data?.err);

          dispatch({
            type: "PROMOS_FORM_CREATE_ERROR",
            payload: error.response.data?.err,
          });
        });
    } catch (error) {
      console.log("error", error);

      notify("Error add promo");
      dispatch({
        type: "PROMOS_FORM_CREATE_ERROR",
      });
    }
  },

  doUpdate: (id, values, notify) => async (dispatch, history) => {
    dispatch({
      type: "PROMOS_FORM_UPDATE_STARTED",
    });

    await axios
      .put(`/promos/${id}`, { id, data: values })
      .then((response) => {
        dispatch({
          type: "PROMOS_FORM_UPDATE_SUCCESS",
          payload: values,
        });
        notify();
        console.log("response", response);
        history.push("/app/promo/list");
      })
      .catch((error) => {
        console.log("error", error.message);
        //notify(error?.response?.data?.err);

        // dispatch({
        //   type: "PROMOS_FORM_UPDATE_ERROR",
        //   payload: error.response.data?.err,
        // });
      });
  },

  doFetch: (filter, keepPagination = false) => async (dispatch) => {
    try {
      dispatch({
        type: "PROMOS_LIST_FETCH_STARTED",
        payload: { filter, keepPagination },
      });

      const response = await list();

      dispatch({
        type: "PROMOS_LIST_FETCH_SUCCESS",
        payload: {
          rows: response,
          count: response.length,
        },
      });
    } catch (error) {
      console.log(error);

      dispatch({
        type: "PROMOS_LIST_FETCH_ERROR",
      });
    }
  },

  doDelete: (id) => async (dispatch) => {
    if (!config.isBackend) {
      dispatch({
        type: "PROMOS_LIST_DELETE_ERROR",
      });
    } else {
      try {
        dispatch({
          type: "PROMOS_LIST_DELETE_STARTED",
        });

        await axios.delete(`/promos/${id}`);

        dispatch({
          type: "PROMOS_LIST_DELETE_SUCCESS",
        });
        const response = await list();
        dispatch({
          type: "PROMOS_LIST_FETCH_SUCCESS",
          payload: {
            rows: response,
            count: response.length,
          },
        });
      } catch (error) {
        console.log(error);
        dispatch({
          type: "PROMOS_LIST_DELETE_ERROR",
        });
      }
    }
  },

  doOpenConfirm: (id) => (dispatch) => {
    dispatch({
      type: "PROMOS_LIST_OPEN_CONFIRM",
      payload: {
        id: id,
      },
    });
  },
  doCloseConfirm: () => (dispatch) => {
    dispatch({
      type: "PROMOS_LIST_CLOSE_CONFIRM",
    });
  },
};

// eslint-disable-next-line no-use-before-define
export { PromoProvider, usePromoState, usePromoDispatch, actions };
