import React, { useEffect } from "react";
import { Grid, Box } from "@material-ui/core";

import { useHistory } from "react-router-dom";
import useStyles from "./styles";

import Widget from "../../components/Widget/Widget";
import { toast } from "react-toastify";

import Notification from "../../components/Notification/Notification";
import {
  useTranslationDispatch,
  useTranslationState,
} from "../../context/TranslationContext";
import { actions } from "../../context/TranslationContext";

import isEmpty from "../../helpers/isEmpty";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Typography, Button } from "../../components/Wrappers/Wrappers";
import Switch from "@material-ui/core/Switch";

const CheckedSelectedTranslations = () => {
  const classes = useStyles();
  const history = useHistory();

  const [checked, setChecked] = React.useState({
    checked_ru: true,
    checked_en: true,
    checked_fr: true,
  });

  const handleChecked = (lang) => {
    const newChecked = {};
    newChecked[`checked_${lang}`] = !checked[`checked_${lang}`];
    setChecked({ ...checked, ...newChecked });
  };

  const translationDispatch = useTranslationDispatch();
  const translationValue = useTranslationState();

  function sendNotification(errorMessage) {
    const componentProps = {
      type: "feedback",
      message: errorMessage != null ? errorMessage : "Проверено!",
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
    if (isEmpty(translationValue.selected))
      sendNotification("No rows selected");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveChecked = () => {
    if (isEmpty(translationValue.selected))
      sendNotification("No rows selected");
    else
      actions.doUpdateChecked({
        selected: translationValue.selected,
        ...checked,
      })(translationDispatch, sendNotification, history);
  };

  console.log("checked", checked);
  console.log("translationValue.selected", translationValue.selected);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Widget>
          <Grid justify={"center"} container>
            <Box display={"flex"} flexDirection={"column"} width={600}>
              <FormControlLabel
                style={{ marginBottom: 35 }}
                control={
                  <Switch
                    checked={checked.checked_ru}
                    onChange={() => handleChecked("ru")}
                    value={true}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="h6" color="textSecondary">
                    Русский
                  </Typography>
                }
              />

              <FormControlLabel
                style={{ marginBottom: 35 }}
                control={
                  <Switch
                    checked={checked.checked_en}
                    onChange={() => handleChecked("en")}
                    value={true}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="h6" color="textSecondary">
                    Английский
                  </Typography>
                }
              />

              <FormControlLabel
                style={{ marginBottom: 35 }}
                control={
                  <Switch
                    checked={checked.checked_fr}
                    onChange={() => handleChecked("fr")}
                    value={true}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="h6" color="textSecondary">
                    Французкий
                  </Typography>
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
                    onClick={() => history.push("/app/translation/list")}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={"contained"}
                    color={"success"}
                    onClick={saveChecked}
                  >
                    Save Selected Rows
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

export default CheckedSelectedTranslations;
