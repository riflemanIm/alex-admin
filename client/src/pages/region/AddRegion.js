import React from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";

import { useHistory } from "react-router-dom";
import useStyles from "./styles";
import { toast } from "react-toastify";

import Notification from "../../components/Notification/Notification";

import { Button } from "../../components/Wrappers/Wrappers";
import Widget from "../../components/Widget/Widget";

import { actions } from "../../context/RegionContext";
import { useRegionDispatch } from "../../context/RegionContext";
import useForm from "../../hooks/useForm";
import validate from "./validation";

const AddRegion = () => {
  const classes = useStyles();

  function sendNotification(errorMessage = null) {
    const componentProps = {
      type: "feedback",
      message: errorMessage != null ? errorMessage : "Регион добавлен!",
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

  const managementDispatch = useRegionDispatch();
  const history = useHistory();

  const saveData = () => {
    actions.doCreate(values, sendNotification)(managementDispatch, history);
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
                placeholder="Регион"
                type="text"
                fullWidth
                required
                error={errors?.title != null}
                helperText={errors?.title != null && errors?.title}
              />
              <TextField
                variant="outlined"
                value={values?.sort || ""}
                name="sort"
                onChange={handleChange}
                style={{ marginBottom: 35 }}
                placeholder="Сортировка"
                type="text"
                fullWidth
                required
                error={errors?.sort != null}
                helperText={errors?.sort != null && errors?.sort}
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
                    onClick={() => history.push("/app/region/list")}
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

export default AddRegion;
