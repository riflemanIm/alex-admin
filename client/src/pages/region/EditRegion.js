import React, { useEffect } from "react";
import { Grid, Box, TextField } from "@material-ui/core";
import { useParams } from "react-router";

import { useHistory } from "react-router-dom";
import useStyles from "./styles";

import Widget from "../../components/Widget/Widget";
import { toast } from "react-toastify";

import Notification from "../../components/Notification/Notification";
import { useRegionDispatch, useRegionState } from "../../context/RegionContext";

import { actions } from "../../context/RegionContext";

import useForm from "../../hooks/useForm";
import validate from "./validation";
import { Button } from "../../components/Wrappers/Wrappers";

const EditRegion = () => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const managementDispatch = useRegionDispatch();
  const { currentRegion } = useRegionState();

  function sendNotification(errorMessage) {
    const componentProps = {
      type: "feedback",
      message: errorMessage != null ? errorMessage : "Регион отредактированн!",
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
      ...currentRegion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRegion, id]);

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
                value={values?.sort != null ? values?.sort : ""}
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

export default EditRegion;
