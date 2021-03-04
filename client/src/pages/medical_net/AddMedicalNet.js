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

import { actions } from "../../context/MedicalNetContext";
import { useMedicalNetDispatch } from "../../context/MedicalNetContext";
import useForm from "../../hooks/useForm";
import validate from "./validation";

const AddMedicalNet = () => {
  const classes = useStyles();
  const { returnToClinic } = useParams();
  console.log("returnToClinic", returnToClinic);

  const urlBackClinic = !isNaN(returnToClinic)
    ? `/app/clinic/${returnToClinic}/edit`
    : returnToClinic != null
    ? "/app/clinic/add"
    : "/app/medical_net/list";

  console.log(
    "urlBackClinic",
    returnToClinic,
    !isNaN(returnToClinic),
    urlBackClinic
  );

  function sendNotification(errorMessage = null) {
    const componentProps = {
      type: "feedback",
      message: errorMessage != null ? errorMessage : " Сеть добавлена!",
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

  const managementDispatch = useMedicalNetDispatch();
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
                value={values?.title || ""}
                name="title"
                onChange={handleChange}
                style={{ marginBottom: 35 }}
                placeholder="Название"
                label="Название"
                type="text"
                fullWidth
                required
                error={errors?.title != null}
                helperText={errors?.title != null && errors?.title}
              />
              <TextField
                variant="outlined"
                value={values?.notify_email || ""}
                name="notify_email"
                onChange={handleChange}
                style={{ marginBottom: 35 }}
                placeholder="Email"
                label="Email"
                type="text"
                fullWidth
              />
              <TextField
                variant="outlined"
                value={values?.notify_phone || ""}
                name="notify_phone"
                onChange={handleChange}
                style={{ marginBottom: 35 }}
                placeholder="Телефон"
                label="Телефон"
                type="text"
                fullWidth
              />
              <TextField
                variant="outlined"
                value={values?.code || ""}
                name="code"
                onChange={handleChange}
                style={{ marginBottom: 35 }}
                placeholder="Код"
                label="Код"
                type="text"
                fullWidth
                required
                error={errors?.code != null}
                helperText={errors?.code != null && errors?.code}
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

export default AddMedicalNet;
