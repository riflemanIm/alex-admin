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

import TextField from "@material-ui/core/TextField";
import validate from "./validation_password";
import { actions } from "../../context/AlexContext";

const AlexChangeDate = () => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const managementDispatch = useAlexDispatch();
  const { saveLoading } = useAlexState();

  function sendNotification(errorMessage) {
    const componentProps = {
      type: "feedback",
      message: errorMessage != null ? errorMessage : "Password changed",
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

  const saveData = () => {
    actions.doСhangePassword(
      id,
      { password: values.password },
      sendNotification
    )(managementDispatch, history);
  };

  const { values, errors, handleSubmit, handleChange } = useForm(
    saveData,
    validate
  );

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
                <>
                  <TextField
                    variant="outlined"
                    value={values?.password || ""}
                    name="password"
                    onChange={handleChange}
                    style={{ marginBottom: 35 }}
                    placeholder="Имя пользователя"
                    label="Имя пользователя"
                    type="text"
                    fullWidth
                    required
                    error={errors?.password != null}
                    helperText={errors?.password != null && errors?.password}
                  />
                  <pre>
                    Пояснение: - строка должна содержать хотя бы одно число; -
                    строка должна содержать хотя бы одну латинскую букву в
                    нижнем регистре; - строка должна содержать хотя бы одну
                    латинскую букву в верхнем регистре; - строка должна состоять
                    не менее, чем из 7 вышеупомянутых символов.
                  </pre>
                </>
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
