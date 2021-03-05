import React, { useEffect } from "react";

import { useParams } from "react-router";

import { useHistory } from "react-router-dom";
import useStyles from "./styles";
import useForm from "../../hooks/useForm";
import { useAlexDispatch, useAlexState } from "../../context/AlexContext";

import { toast } from "react-toastify";

import Notification from "../../components/Notification/Notification";

import { Grid, Box } from "@material-ui/core";
import { Button } from "../../components/Wrappers/Wrappers";
import Widget from "../../components/Widget/Widget";
import CircularProgress from "@material-ui/core/CircularProgress";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Locales } from "../../helpers/dateFormat";
import moment from "moment/moment";
import validate from "./validation";
import { actions } from "../../context/AlexContext";

const AlexChangeDate = () => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const managementDispatch = useAlexDispatch();
  const { currentAlex, saveLoading } = useAlexState();

  function sendNotification(errorMessage) {
    const componentProps = {
      type: "feedback",
      message: errorMessage != null ? errorMessage : "Сервис отредактирован!",
      variant: "contained",
      color: errorMessage != null ? "warning" : "success",
    };
    const options = {
      type: errorMessage != null ? "defence" : "info",
      position: toast.POSITION.TOP_RIGHT,
      progressClassName: classes.progress,
      className: classes.notification,
      timeOut: 1000,
    };
    return toast(
      <Notification
        {...componentProps}
        className={classes.notificationComponent}
      />,
      options
    );
  }

  useEffect(() => {
    if (id) {
      actions.doFind(id)(managementDispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValues({
      ...currentAlex,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAlex, id]);

  const saveData = () => {
    actions.doUpdate(
      id,
      { expiryDate: moment(values.expiryDate).format("YYYY-MM-DD") },
      sendNotification
    )(managementDispatch, history);
  };

  const { values, errors, handleSubmit, setValues } = useForm(
    saveData,
    validate
  );
  const handleDateChange = (expiryDate) => {
    console.log("expiryDate", expiryDate);
    if (expiryDate != null && expiryDate !== "")
      setValues({
        ...values,
        expiryDate,
      });
  };
  const Loading = () => (
    <Grid container justify="center" alignItems="center">
      <CircularProgress size={26} />
    </Grid>
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Widget>
          <Grid item justify={"center"} container>
            <Box display={"flex"} flexDirection={"column"} width={600}>
              {saveLoading ? (
                <Loading />
              ) : (
                <MuiPickersUtilsProvider
                  utils={DateFnsUtils}
                  locale={Locales["ru"]}
                >
                  <KeyboardDatePicker
                    disableToolbar
                    style={{ marginBottom: 25 }}
                    autoOk
                    name="expiryDate"
                    variant="inline"
                    inputVariant="outlined"
                    format="dd.MM.yyyy"
                    margin="normal"
                    //id="date-picker-inline"
                    placeholder="Expiry date"
                    label="Expiry date"
                    value={values.expiryDate || null}
                    onChange={(expiryDate) => handleDateChange(expiryDate)}
                    KeyboardButtonProps={{
                      "aria-label": "expiryDate",
                    }}
                    fullWidth
                    error={errors?.expiryDate != null}
                    helperText={
                      errors?.expiryDate != null && errors?.expiryDate
                    }
                  />
                </MuiPickersUtilsProvider>
              )}
            </Box>
            <Grid item justify={"center"} container>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                width={600}
              >
                <>
                  <Button
                    variant={"outlined"}
                    color={"primary"}
                    onClick={() => history.push("/app/alex/list")}
                  >
                    Отмена
                  </Button>
                  <Button
                    variant={"contained"}
                    color={"success"}
                    onClick={handleSubmit}
                  >
                    Сохранить
                  </Button>
                </>
              </Box>
            </Grid>
          </Grid>
        </Widget>
      </Grid>
    </Grid>
  );
};

export default AlexChangeDate;
