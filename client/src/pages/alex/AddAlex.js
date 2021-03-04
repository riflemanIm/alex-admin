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
import validate from "./validation";

const AddAlex = () => {
  const classes = useStyles();
  const { returnToClinic } = useParams();
  console.log("returnToClinic", returnToClinic);

  const urlBackClinic = !isNaN(returnToClinic)
    ? `/app/clinic/${returnToClinic}/edit`
    : returnToClinic != null
    ? "/app/clinic/add"
    : "/app/alex/list";

  console.log(
    "urlBackClinic",
    returnToClinic,
    !isNaN(returnToClinic),
    urlBackClinic
  );
  function sendNotification(errorMessage = null) {
    const componentProps = {
      type: "feedback",
      message: errorMessage != null ? errorMessage : "Сервис добавлен!",
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
      urlBackClinic
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
                value={values?.label || ""}
                name="label"
                onChange={handleChange}
                style={{ marginBottom: 35 }}
                placeholder="Название(Label)"
                label="Название(Label)"
                type="text"
                fullWidth
                required
                error={errors?.label != null}
                helperText={errors?.label != null && errors?.label}
              />
              <TextField
                variant="outlined"
                value={values?.address || ""}
                name="address"
                onChange={handleChange}
                style={{ marginBottom: 35 }}
                placeholder="Адрес"
                label="Адрес"
                type="text"
                fullWidth
                required
                error={errors?.address != null}
                helperText={errors?.address != null && errors?.address}
              />
              <TextField
                variant="outlined"
                value={values?.file_server_address || ""}
                name="file_server_address"
                onChange={handleChange}
                style={{ marginBottom: 35 }}
                placeholder="Адрес сервера"
                label="Адрес сервера"
                type="text"
                fullWidth
                required
                error={errors?.file_server_address != null}
                helperText={
                  errors?.file_server_address != null &&
                  errors?.file_server_address
                }
              />
              <TextField
                variant="outlined"
                value={values?.file_server_binding_name || ""}
                name="file_server_binding_name"
                onChange={handleChange}
                style={{ marginBottom: 35 }}
                placeholder="Имя сборки"
                label="Имя сборки"
                type="text"
                fullWidth
                required
                error={errors?.file_server_binding_name != null}
                helperText={
                  errors?.file_server_binding_name != null &&
                  errors?.file_server_binding_name
                }
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
                    onClick={() => history.push(urlBackClinic)}
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

export default AddAlex;
