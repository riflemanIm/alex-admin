import React from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";

import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";

import useStyles from "./styles";
import { toast } from "react-toastify";

import Notification from "../../components/Notification/Notification";

import { Button } from "../../components/Wrappers/Wrappers";
import Widget from "../../components/Widget/Widget";

import { actions } from "../../context/AlexContext";
import { useAlexDispatch } from "../../context/AlexContext";
import useForm from "../../hooks/useForm";
import validate from "./validation_add";

const AddAlex = () => {
  const classes = useStyles();
  const { returnToClinic } = useParams();
  console.log("returnToClinic", returnToClinic);

  const urlBack = "/app/alex/list";
  function sendNotification(errorMessage = null) {
    const componentProps = {
      type: "feedback",
      message: errorMessage != null ? errorMessage : "Пльзователь добавлен!",
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

  const managementDispatch = useAlexDispatch();
  const history = useHistory();

  const saveData = () => {
    actions.doCreate(
      values,
      sendNotification,
      urlBack
    )(managementDispatch, history);
  };

  const { values, errors, handleChange, handleSubmit } = useForm(
    saveData,
    validate
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Widget>
          <Grid item justify={"center"} container>
            <Box display={"flex"} flexDirection={"column"} width={600}>
              <TextField
                variant="outlined"
                value={values?.username || ""}
                name="username"
                onChange={handleChange}
                style={{ marginBottom: 35 }}
                placeholder="Имя пользователя"
                label="Имя пользователя"
                type="text"
                fullWidth
                required
                error={errors?.username != null}
                helperText={errors?.username != null && errors?.username}
              />
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
                    onClick={() => history.push(urlBack)}
                  >
                    Отмена
                  </Button>
                  <Button
                    variant={"contained"}
                    color={"success"}
                    disabled={values.username == null || values.username === ""}
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

export default AddAlex;
