import React, { useEffect } from "react";
import { Grid, Box, TextField } from "@material-ui/core";
import { useParams } from "react-router";

import { useHistory } from "react-router-dom";
import useStyles from "./styles";

import Widget from "../../components/Widget/Widget";
import { toast } from "react-toastify";

import Notification from "../../components/Notification/Notification";
import {
  useServiceDispatch,
  useServiceState,
} from "../../context/ServiceContext";

import { actions } from "../../context/ServiceContext";

import useForm from "../../hooks/useForm";
import validate from "./validation";
import { Button } from "../../components/Wrappers/Wrappers";

const EditService = () => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const managementDispatch = useServiceDispatch();
  const { currentService } = useServiceState();

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
      console.log("id", id);
      actions.doFind(id)(managementDispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValues({
      ...currentService,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentService, id]);

  const saveData = () => {
    actions.doUpdate(id, values, sendNotification)(managementDispatch, history);
  };

  const { values, errors, handleChange, handleSubmit, setValues } = useForm(
    saveData,
    validate
  );
  console.log("values", values);
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
                    onClick={() => history.push("/app/service/list")}
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

export default EditService;
