import React, { useEffect } from "react";
import { Grid, Box, TextField } from "@material-ui/core";
import { useParams } from "react-router";

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

import useForm from "../../hooks/useForm";
import validate from "./validation";
import isEmpty from "../../helpers/isEmpty";
import { ArrowRightAlt as ArrowRight } from "@material-ui/icons";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Typography, Button } from "../../components/Wrappers/Wrappers";
import Switch from "@material-ui/core/Switch";
import { useUserState } from "../../context/UserContext";

const EditTranslation = () => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const translationDispatch = useTranslationDispatch();
  const { currentTranslation } = useTranslationState();
  const {
    currentUser: { account_id, status },
  } = useUserState();

  const [checked, setChecked] = React.useState({
    checked_ru: status === "interpreter",
    checked_en: status === "interpreter",
    checked_fr: status === "interpreter",
  });
  const handleChecked = (lang) => {
    const newChecked = {};
    newChecked[`checked_${lang}`] = !checked[`checked_${lang}`];
    setChecked({ ...checked, ...newChecked });
  };

  function sendNotification(errorMessage) {
    const componentProps = {
      type: "feedback",
      message: errorMessage != null ? errorMessage : "Translation edited!",
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
      actions.doFind(id)(translationDispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isEmpty(currentTranslation)) {
      setValues({ ...currentTranslation });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTranslation, id]);

  const saveData = () => {
    actions.doUpdate(
      id,
      {
        lang_ru: values.lang_ru,
        lang_en: values.lang_en,
        lang_fr: values.lang_fr,
        ...checked,
        account_id,
      },
      history
    )(translationDispatch, sendNotification);
  };

  const { values, errors, handleChange, handleSubmit, setValues } = useForm(
    saveData,
    validate
  );
  console.log("checked", checked);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Widget>
          <Grid justify={"center"} container>
            <Box display={"flex"} flexDirection={"column"} width={600}>
              <Typography
                color="primary"
                variant={"h6"}
                style={{ marginBottom: 35 }}
              >
                {values.gkey} <ArrowRight className={classes.iconTitleArrow} />
                {values.tkey}
              </Typography>

              <Typography size={"md"} variant={"body2"}>
                Russian
              </Typography>

              <TextField
                variant="outlined"
                value={values.lang_ru}
                name="lang_ru"
                onChange={handleChange}
                placeholder={`${values.gkey} ${values.tkey}`}
                multiline
                rows={4}
                fullWidth
                required
                error={errors?.lang_ru != null}
                helperText={errors?.lang_ru != null && errors?.lang_ru}
              />
              {status === "interpreter" && (
                <FormControlLabel
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
                      Verified
                    </Typography>
                  }
                />
              )}

              <Typography
                size={"md"}
                variant={"body2"}
                style={{ marginTop: 35 }}
              >
                English
              </Typography>
              <TextField
                variant="outlined"
                value={values.lang_en}
                name="lang_en"
                onChange={handleChange}
                placeholder={`${values.gkey} ${values.tkey}`}
                multiline
                rows={4}
                fullWidth
                required
                error={errors?.lang_en != null}
                helperText={errors?.lang_en != null && errors?.lang_en}
              />
              {status === "interpreter" && (
                <FormControlLabel
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
                      Verified
                    </Typography>
                  }
                />
              )}

              <Typography
                size={"md"}
                variant={"body2"}
                style={{ marginTop: 35 }}
              >
                French
              </Typography>
              <TextField
                variant="outlined"
                value={values.lang_fr}
                name="lang_fr"
                onChange={handleChange}
                placeholder={`${values.gkey} ${values.tkey}`}
                multiline
                rows={4}
                fullWidth
                required
                error={errors?.lang_fr != null}
                helperText={errors?.lang_fr != null && errors?.lang_fr}
              />
              {status === "interpreter" && (
                <FormControlLabel
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
                      Verified
                    </Typography>
                  }
                />
              )}
            </Box>
            <Grid item justify={"center"} container>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                width={600}
                style={{ marginTop: 35 }}
              >
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
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Widget>
      </Grid>
    </Grid>
  );
};

export default EditTranslation;
