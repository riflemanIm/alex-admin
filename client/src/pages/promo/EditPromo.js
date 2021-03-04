import React, { useEffect } from "react";
import { useParams } from "react-router";
import { Grid, Box, TextField } from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { useHistory } from "react-router-dom";
import useStyles from "./styles";
import { toast } from "react-toastify";
import Widget from "../../components/Widget/Widget";
import { Typography, Button } from "../../components/Wrappers/Wrappers";
import Notification from "../../components/Notification/Notification";

import { actions } from "../../context/PromoContext";
import { usePromoDispatch, usePromoState } from "../../context/PromoContext";

import useForm from "../../hooks/useForm";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";
import { resizeImageBase64 } from "../../helpers/base64";
import validate from "./validation";

const EditPromo = () => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const managementDispatch = usePromoDispatch();
  const { currentPromo } = usePromoState();

  function sendNotification(errorMessage) {
    const componentProps = {
      type: "feedback",
      message: errorMessage != null ? errorMessage : "Промо отредактированна!",
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
      ...currentPromo,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPromo, id]);

  const saveData = () => {
    actions.doUpdate(id, values, sendNotification)(managementDispatch, history);
  };

  const { values, errors, handleChange, handleSubmit, setValues } = useForm(
    saveData,
    validate
  );
  const handleDateChange = (dateFromTo) => {
    if (dateFromTo != null && dateFromTo !== "")
      setValues({
        ...values,
        ...dateFromTo,
      });
  };

  const fileInput = React.useRef(null);

  const deleteOneImage = () => {
    setValues({
      ...values,
      image: "",
    });
  };

  const handleFile = async (event) => {
    event.preventDefault();
    const filedata = event.target.files[0];
    const base64result = await resizeImageBase64(filedata, 610, 610);
    const image = base64result.split(",")[1];
    console.log("image", image);
    setValues({
      ...values,
      image,
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Widget>
          <Grid item justify={"center"} container>
            <Box display={"flex"} flexDirection={"column"} width={600}>
              <TextField
                variant="outlined"
                value={values?.description || ""}
                name="description"
                onChange={handleChange}
                style={{ marginBottom: 35 }}
                placeholder="Промо"
                label="Промо"
                multiline
                rows={4}
                type="text"
                fullWidth
                required
                error={errors?.description != null}
                helperText={errors?.description != null && errors?.description}
              />

              <TextField
                variant="outlined"
                value={values?.action_text || ""}
                name="action_text"
                onChange={handleChange}
                style={{ marginBottom: 35 }}
                placeholder="Детали"
                label="Детали"
                multiline
                rows={4}
                type="text"
                fullWidth
                required
                error={errors?.action_text != null}
                helperText={errors?.action_text != null && errors?.action_text}
              />
              <TextField
                variant="outlined"
                value={`${values?.sort_order}`}
                name="sort_order"
                onChange={handleChange}
                style={{ marginBottom: 25 }}
                placeholder="Сортировка"
                label="Сортировка"
                type="text"
                fullWidth
                required
                error={errors?.sort_order != null}
                helperText={errors?.sort_order != null && errors?.sort_order}
              />
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                <KeyboardDatePicker
                  disableToolbar
                  style={{ marginBottom: 25 }}
                  autoOk
                  name="date_from"
                  variant="inline"
                  inputVariant="outlined"
                  format="dd.MM.yyyy"
                  margin="normal"
                  //id="date-picker-inline"
                  placeholder="Начало акции"
                  label="Начало акции"
                  value={values.date_from || null}
                  onChange={(date_from) => handleDateChange({ date_from })}
                  KeyboardButtonProps={{
                    "aria-label": "date_from",
                  }}
                  fullWidth
                  error={errors?.date_from != null}
                  helperText={errors?.date_from != null && errors?.date_from}
                />
              </MuiPickersUtilsProvider>

              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                <KeyboardDatePicker
                  disableToolbar
                  style={{ marginBottom: 35 }}
                  autoOk
                  name="date_to"
                  variant="inline"
                  inputVariant="outlined"
                  format="dd.MM.yyyy"
                  margin="normal"
                  //id="date-picker-inline"
                  placeholder="Конец акции"
                  label="Конец акции"
                  value={values.date_to || null}
                  onChange={(date_to) => handleDateChange({ date_to })}
                  KeyboardButtonProps={{
                    "aria-label": "date_to",
                  }}
                  fullWidth
                  error={errors?.date_to != null}
                  helperText={errors?.date_to != null && errors?.date_to}
                />
              </MuiPickersUtilsProvider>

              <TextField
                variant="outlined"
                value={`${values?.url}`}
                style={{ marginBottom: 35 }}
                name="url"
                onChange={handleChange}
                placeholder="URL"
                label="URL"
                type="text"
                fullWidth
                required
                error={errors?.url != null}
                helperText={errors?.url != null && errors?.url}
              />
              {values.image != null && (
                <div className={classes.galleryWrap}>
                  <div className={classes.imgWrap}>
                    <span
                      className={classes.deleteImageX}
                      onClick={() => deleteOneImage()}
                    >
                      ×
                    </span>
                    <img
                      src={`data:image/jpeg;base64,${values.image}`}
                      alt=""
                      height={"100%"}
                    />
                  </div>
                </div>
              )}

              <label
                className={classes.uploadLabel}
                style={{ cursor: "pointer" }}
              >
                Выбрать файл
                <input
                  style={{ display: "none" }}
                  accept="image/*"
                  type="file"
                  ref={fileInput}
                  onChange={handleFile}
                />
              </label>
              <Typography size={"sm"} style={{ marginBottom: 35 }}>
                .PNG, .JPG, .JPEG
              </Typography>
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
                    onClick={() => history.push("/app/promo/list")}
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

export default EditPromo;
