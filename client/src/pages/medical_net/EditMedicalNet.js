import React, { useEffect } from "react";
import { Grid, Box, TextField } from "@material-ui/core";
import { useParams } from "react-router";

import { useHistory } from "react-router-dom";
import useStyles from "./styles";

import Widget from "../../components/Widget/Widget";
import { toast } from "react-toastify";

import Notification from "../../components/Notification/Notification";
import {
  useMedicalNetDispatch,
  useMedicalNetState,
} from "../../context/MedicalNetContext";

import { actions } from "../../context/MedicalNetContext";

import useForm from "../../hooks/useForm";
import validate from "./validation";
import { Button } from "../../components/Wrappers/Wrappers";

const EditMedicalNet = () => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const managementDispatch = useMedicalNetDispatch();
  const { currentMedicalNet } = useMedicalNetState();

  function sendNotification(errorMessage) {
    const componentProps = {
      type: "feedback",
      message: errorMessage != null ? errorMessage : "Сеть отредактирована!",
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
      ...currentMedicalNet,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMedicalNet, id]);

  const saveData = () => {
    actions.doUpdate(id, values, sendNotification)(managementDispatch, history);
  };

  const { values, errors, handleChange, handleSubmit, setValues } = useForm(
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
                    onClick={() => history.push("/app/medical_net/list")}
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

export default EditMedicalNet;
