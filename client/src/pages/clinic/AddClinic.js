import React, { useEffect } from "react";
import { Grid, Box, TextField } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Switch from "@material-ui/core/Switch";

import { useHistory } from "react-router-dom";
import useStyles from "./styles";
import { toast } from "react-toastify";
import Widget from "../../components/Widget/Widget";
import { Button, Typography } from "../../components/Wrappers/Wrappers";
import Notification from "../../components/Notification/Notification";

import { actions } from "../../context/ClinicContext";
import { useClinicDispatch, useClinicState } from "../../context/ClinicContext";

import useForm from "../../hooks/useForm";
import validate from "./validation";

const AddClinic = () => {
  const classes = useStyles();
  const history = useHistory();

  const dispatch = useClinicDispatch();
  const { services, medical_net } = useClinicState();

  useEffect(() => {
    actions.doReferenceLists()(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function sendNotification(errorMessage) {
    const componentProps = {
      type: "feedback",
      message:
        errorMessage != null ? errorMessage : "Клиника отредактированна!",
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
    actions.doCreate(values, sendNotification)(dispatch, history);
  };

  const { values, errors, handleChange, handleSubmit, setValues } = useForm(
    saveData,
    validate
  );

  // console.log("values", values);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Widget>
          <Grid item justify={"center"} container>
            <Box display={"flex"} flexDirection={"column"} width={600}>
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
                value={values?.url || ""}
                name="url"
                onChange={handleChange}
                style={{ marginBottom: 35 }}
                placeholder="URL"
                label="URL"
                type="text"
                fullWidth
              />

              <TextField
                variant="outlined"
                value={values?.postal_address || ""}
                name="postal_address"
                onChange={handleChange}
                style={{ marginBottom: 35 }}
                placeholder="Почтовый адрес"
                label="Почтовый адрес"
                multiline
                rows={4}
                type="text"
                fullWidth
                required
                error={errors?.postal_address != null}
                helperText={
                  errors?.postal_address != null && errors?.postal_address
                }
              />

              <TextField
                variant="outlined"
                value={values?.phone || ""}
                name="phone"
                onChange={handleChange}
                style={{ marginBottom: 35 }}
                placeholder="Телефон"
                label="Телефон"
                type="text"
                fullWidth
                required
                error={errors?.phone != null}
                helperText={errors?.phone != null && errors?.phone}
              />
              <TextField
                variant="outlined"
                value={values?.latitude || ""}
                name="latitude"
                onChange={handleChange}
                style={{ marginBottom: 35 }}
                placeholder="Latitude"
                label="Latitude"
                type="text"
                fullWidth
                required
                error={errors?.latitude != null}
                helperText={errors?.latitude != null && errors?.latitude}
              />
              <TextField
                variant="outlined"
                value={values?.longitude || ""}
                name="longitude"
                onChange={handleChange}
                style={{ marginBottom: 35 }}
                placeholder="Longitude"
                label="Longitude"
                type="text"
                fullWidth
                required
                error={errors?.longitude != null}
                helperText={errors?.longitude != null && errors?.longitude}
              />

              <FormControl
                variant="outlined"
                style={{ marginBottom: 35 }}
                fullWidth
                required
                error={errors?.client_service_id != null}
                helperText={
                  errors?.client_service_id != null && errors?.client_service_id
                }
              >
                <InputLabel id="id-services-label">Сервис</InputLabel>
                <Select
                  name="client_service_id"
                  labelId="id-services-label"
                  id="id-services-select"
                  label="Сервис"
                  onChange={handleChange}
                  value={values?.client_service_id}
                >
                  {services.map((item) => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                variant="outlined"
                style={{ marginBottom: 35 }}
                fullWidth
                required
                error={errors?.medical_net_id != null}
                helperText={
                  errors?.medical_net_id != null && errors?.medical_net_id
                }
              >
                <InputLabel id="id-medical_net-label">Сеть</InputLabel>
                <Select
                  name="medical_net_id"
                  labelId="id-medical_net-label"
                  id="id-medical_net-select"
                  label="Сеть"
                  onChange={handleChange}
                  value={values?.medical_net_id}
                >
                  {medical_net.map((item) => (
                    <MenuItem
                      value={item.medical_net_id}
                      key={item.medical_net_id}
                    >
                      {item.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box display={"flex"} mb={2} alignItems={"center"}>
                <Typography weight={"medium"}>is_phone_required</Typography>
                <Switch
                  onChange={() =>
                    setValues({
                      ...values,
                      is_phone_required: !values.is_phone_required,
                    })
                  }
                  color={"primary"}
                  checked={values?.is_phone_required}
                  name="is_phone_required"
                  value={values?.is_phone_required}
                />
              </Box>

              <Box display={"flex"} mb={2} alignItems={"center"}>
                <Typography weight={"medium"}>is_anonym_visit</Typography>
                <Switch
                  onChange={() =>
                    setValues({
                      ...values,
                      is_anonym_visit: !values.is_anonym_visit,
                    })
                  }
                  color={"primary"}
                  checked={values?.is_anonym_visit}
                  name="is_anonym_visit"
                  value={values?.is_anonym_visit}
                />
              </Box>

              <Box display={"flex"} mb={2} alignItems={"center"}>
                <Typography weight={"medium"}>is_home_request</Typography>
                <Switch
                  onChange={() =>
                    setValues({
                      ...values,
                      is_home_request: !values.is_home_request,
                    })
                  }
                  color={"primary"}
                  checked={values?.is_home_request}
                  name="is_home_request"
                  value={values?.is_home_request}
                />
              </Box>
            </Box>
            <Grid item justify={"center"} container style={{ marginTop: 35 }}>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                width={600}
              >
                <>
                  <Button
                    variant={"outlined"}
                    color={"primary"}
                    onClick={() => history.push("/app/clinic/list")}
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

export default AddClinic;
