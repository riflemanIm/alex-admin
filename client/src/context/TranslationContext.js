import React from "react";
import axios from "axios";
import config from "../config";
import { toast } from "react-toastify";
import isEmpty from "../helpers/isEmpty";

async function list() {
  const response = await axios.get(`/translations`);
  //console.log("response", response.data);
  return response.data;
}

const TranslationStateContext = React.createContext();
const TranslationDispatchContext = React.createContext();
const filterVals = JSON.parse(localStorage.getItem("translationFilterVals"));
const initialData = {
  findLoading: false,
  saveLoading: false,
  currentTranslation: {},
  backupsTranslation: [],
  rows: [],
  loading: false,
  idToDelete: null,
  modalOpenConfirm: false,
  errorMessage: null,
  selected: [],
  modalOpenCheched: false,
  checked: { checked_ru: true, checked_en: true, checked_fr: true },
  filterVals: isEmpty(filterVals)
    ? {
        pname: "mobimed_site",
        gkey: "",
        lang_value: "",
        checked: "not_checked_all",
      }
    : filterVals,
};
console.log(
  " filterVals",
  filterVals,
  localStorage.getItem("translationFilterVals")
);
function translationReducer(state = initialData, { type, payload }) {
  //console.log(type);
  if (type === "TRANSLATIONS_FORM_RESET") {
    console.log("TRANSLATIONS_FORM_RESET", initialData);
    return {
      ...initialData,
    };
  }

  if (type === "TRANSLATIONS_FORM_FIND_STARTED") {
    return {
      ...state,
      currentTranslation: null,
      findLoading: true,
    };
  }

  if (type === "TRANSLATIONS_FORM_FIND_SUCCESS") {
    return {
      ...state,
      currentTranslation: payload,
      findLoading: false,
    };
  }

  if (type === "TRANSLATIONS_FORM_FIND_ERROR") {
    return {
      ...state,
      currentTranslation: null,
      findLoading: false,
    };
  }

  if (type === "TRANSLATIONS_FIND_BACKUPS_STARTED") {
    return {
      ...state,
      backupsTranslation: null,
      findLoading: true,
    };
  }
  if (type === "TRANSLATIONS_FIND_BACKUPS_SUCCESS") {
    return {
      ...state,
      backupsTranslation: payload,
      findLoading: false,
    };
  }
  if (type === "TRANSLATIONS_FIND_BACKUPS_ERROR") {
    return {
      ...state,
      backupsTranslation: [],
      findLoading: false,
    };
  }

  if (type === "TRANSLATIONS_FORM_CREATE_STARTED") {
    return {
      ...state,
      saveLoading: true,
      currentTranslation: { id: null },
    };
  }
  if (type === "TRANSLATIONS_FORM_CREATE_SUCCESS") {
    return {
      ...state,
      saveLoading: false,
      currentTranslation: payload,
    };
  }
  if (type === "TRANSLATIONS_FORM_CREATE_ERROR") {
    return {
      ...state,
      saveLoading: false,
      errorMessage: payload,
      currentTranslation: { id: null },
    };
  }

  if (type === "TRANSLATIONS_FORM_UPDATE_STARTED") {
    return {
      ...state,
      saveLoading: true,
      errorMessage: null,
    };
  }
  if (type === "TRANSLATIONS_FORM_UPDATE_SUCCESS") {
    return {
      ...state,
      currentTranslation: payload,
      saveLoading: false,
      modalOpenCheched: false,
    };
  }
  if (type === "TRANSLATIONS_FORM_UPDATE_ERROR") {
    console.log("TRANSLATIONS_FORM_UPDATE_ERROR", payload);
    return {
      ...state,
      saveLoading: false,
      errorMessage: payload,
    };
  }

  if (type === "TRANSLATIONS_LIST_FETCH_STARTED") {
    return {
      ...state,
      loading: true,
      rows: [],
    };
  }
  if (type === "TRANSLATIONS_LIST_FETCH_SUCCESS") {
    return {
      ...state,
      loading: false,
      rows: payload.rows,
    };
  }
  if (type === "TRANSLATIONS_LIST_FETCH_ERROR") {
    return {
      ...state,
      loading: false,
      rows: [],
    };
  }

  if (type === "TRANSLATIONS_LIST_DELETE_STARTED") {
    return {
      ...state,
      loading: true,
      errorMessage: null,
    };
  }
  if (type === "TRANSLATIONS_LIST_DELETE_SUCCESS") {
    return {
      ...state,
      loading: false,
      modalOpenConfirm: false,
    };
  }
  if (type === "TRANSLATIONS_LIST_DELETE_ERROR") {
    return {
      ...state,
      loading: false,
      modalOpenConfirm: false,
      errorMessage: payload,
    };
  }

  if (type === "TRANSLATIONS_LIST_OPEN_CONFIRM") {
    return {
      ...state,
      loading: false,
      modalOpenConfirm: true,
      idToDelete: payload.id,
    };
  }
  if (type === "TRANSLATIONS_LIST_CLOSE_CONFIRM") {
    return {
      ...state,
      loading: false,
      modalOpenConfirm: false,
    };
  }

  if (type === "TRANSLATIONS_CHECKED_OPEN") {
    return {
      ...state,
      modalOpenCheched: true,
    };
  }
  if (type === "TRANSLATIONS_CHECKED_CLOSE") {
    return {
      ...state,
      modalOpenCheched: false,
    };
  }

  if (type === "TRANSLATIONS_SET_SELECTED") {
    return {
      ...state,
      selected: payload,
    };
  }
  if (type === "TRANSLATIONS_SELECTED_CHECKED") {
    return {
      ...state,
      checked: payload,
    };
  }

  if (type === "TRANSLATIONS_SET_FILTERS") {
    console.log("TRANSLATIONS_SET_FILTERS", payload);
    return {
      ...state,
      filterVals: { ...state.filterVals, ...payload },
    };
  }

  return state;
}

function TranslationProvider({ children }) {
  const [state, dispatch] = React.useReducer(translationReducer, initialData);

  return (
    <TranslationStateContext.Provider value={state}>
      <TranslationDispatchContext.Provider value={dispatch}>
        {children}
      </TranslationDispatchContext.Provider>
    </TranslationStateContext.Provider>
  );
}

function useTranslationState() {
  const context = React.useContext(TranslationStateContext);
  if (context === undefined) {
    throw new Error(
      "useTranslationState must be used within a TranslationProvider"
    );
  }
  return context;
}

function useTranslationDispatch() {
  const context = React.useContext(TranslationDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useTranslationDispatch must be used within a TranslationProvider"
    );
  }
  return context;
}

// ###########################################################

const actions = {
  doNew: async (dispatch) => {
    await dispatch({
      type: "TRANSLATIONS_FORM_RESET",
    });
  },
  setFilter: (params) => async (dispatch) => {
    localStorage.setItem("translationFilterVals", JSON.stringify(params));

    await dispatch({
      type: "TRANSLATIONS_SET_FILTERS",
      payload: { ...params },
    });
  },

  doFind: (id) => async (dispatch) => {
    try {
      await dispatch({
        type: "TRANSLATIONS_FORM_FIND_STARTED",
      });

      await axios.get(`/translations/${id}`).then((res) => {
        const payload = res.data;
        console.log("=== res.data", res.data);
        dispatch({
          type: "TRANSLATIONS_FORM_FIND_SUCCESS",
          payload,
        });
      });
    } catch (error) {
      toast("Error");
      console.log(error);
      dispatch({
        type: "TRANSLATIONS_FORM_FIND_ERROR",
      });
    }
  },
  doCreate: (values, history) => async (dispatch, notify) => {
    try {
      await dispatch({
        type: "TRANSLATIONS_FORM_CREATE_STARTED",
      });
      await axios
        .post("/translations", { data: values })
        .then((res) => {
          console.log("------- doCreate -----------", res.data);

          dispatch({
            type: "TRANSLATIONS_FORM_CREATE_SUCCESS",
            payload: { id: res.data },
          });
          notify();
          history.push("/app/translation/list");
        })
        .catch((error) => {
          console.log("error", error);
          notify(error.response.data?.err);

          dispatch({
            type: "TRANSLATIONS_FORM_CREATE_ERROR",
            payload: error.response.data?.err,
          });
        });
    } catch (error) {
      //toast("Error");

      console.log("error", error);

      notify("Error add translation");
      dispatch({
        type: "TRANSLATIONS_FORM_CREATE_ERROR",
      });
    }
  },
  doUpdate: (id, values, history) => async (dispatch, notify) => {
    await dispatch({
      type: "TRANSLATIONS_FORM_UPDATE_STARTED",
    });

    await axios
      .put(`/translations/${id}`, { id, data: values })
      .then((response) => {
        dispatch({
          type: "TRANSLATIONS_FORM_UPDATE_SUCCESS",
          payload: values,
        });
        notify();
        console.log("response", response);
        history.push("/app/translation/list");
      })
      .catch((error) => {
        console.log("error", error);
        notify(error.response.data?.err);
        dispatch({
          type: "TRANSLATIONS_FORM_UPDATE_ERROR",
          payload: error.response.data?.err,
        });
      });
  },
  doUpdateChecked: (values) => async (dispatch, notify, fetchAll) => {
    await dispatch({
      type: "TRANSLATIONS_FORM_UPDATE_STARTED",
    });

    await axios
      .put(`/translations/checked`, { data: values })
      .then((response) => {
        dispatch({
          type: "TRANSLATIONS_FORM_UPDATE_SUCCESS",
          payload: values,
        });
        notify("Saved");
        console.log("response", response);
        fetchAll();
      })
      .catch((error) => {
        console.log("error", error);
        notify(error.response.data?.err, true);
        dispatch({
          type: "TRANSLATIONS_FORM_UPDATE_ERROR",
          payload: error.response.data?.err,
        });
      });
  },
  doFetch: (filter, keepPagination = false) => async (dispatch) => {
    try {
      await dispatch({
        type: "TRANSLATIONS_LIST_FETCH_STARTED",
        //payload: { filter, keepPagination },
      });
      const response = await list();
      await dispatch({
        type: "TRANSLATIONS_LIST_FETCH_SUCCESS",
        payload: {
          rows: response,
          count: response.length,
        },
      });
    } catch (error) {
      //toast("Error");
      console.log(error);

      dispatch({
        type: "TRANSLATIONS_LIST_FETCH_ERROR",
      });
    }
  },
  doDelete: (id) => async (dispatch) => {
    if (!config.isBackend) {
      await dispatch({
        type: "TRANSLATIONS_LIST_DELETE_ERROR",
      });
    } else {
      try {
        await dispatch({
          type: "TRANSLATIONS_LIST_DELETE_STARTED",
        });

        await axios.delete(`/translations/${id}`);

        await dispatch({
          type: "TRANSLATIONS_LIST_DELETE_SUCCESS",
        });
        const response = await list();
        dispatch({
          type: "TRANSLATIONS_LIST_FETCH_SUCCESS",
          payload: {
            rows: response,
            count: response.length,
          },
        });
      } catch (error) {
        toast("Error");
        console.log(error);
        dispatch({
          type: "TRANSLATIONS_LIST_DELETE_ERROR",
        });
      }
    }
  },

  doOpenConfirm: (id) => async (dispatch) => {
    dispatch({
      type: "TRANSLATIONS_LIST_OPEN_CONFIRM",
      payload: {
        id: id,
      },
    });
  },
  doCloseConfirm: () => async (dispatch) => {
    dispatch({
      type: "TRANSLATIONS_LIST_CLOSE_CONFIRM",
    });
  },

  doFetchBackups: () => async (dispatch) => {
    try {
      await dispatch({
        type: "TRANSLATIONS_FIND_BACKUPS_STARTED",
      });

      await axios.get(`/translations/backups`).then((res) => {
        const payload = res.data;
        dispatch({
          type: "TRANSLATIONS_FIND_BACKUPS_SUCCESS",
          payload,
        });
      });
    } catch (error) {
      toast("Error");
      console.log(error);
      await dispatch({
        type: "TRANSLATIONS_FIND_BACKUPS_SUCCESS",
      });
    }
  },
  doRestoreBackup: (value, history) => async (notify) => {
    await axios
      .put(`/translations/restorebackup`, { data: value })
      .then((response) => {
        if (response.data === "ok") {
          notify();
          history.push("/app/translation/list");
        } else {
          console.log("not ok ", response.data);
        }
      })
      .catch((error) => {
        console.log("error", error);
        notify(error.response.data?.err);
      });
  },
};

// eslint-disable-next-line no-use-before-define
export {
  TranslationProvider,
  useTranslationState,
  useTranslationDispatch,
  actions,
};
