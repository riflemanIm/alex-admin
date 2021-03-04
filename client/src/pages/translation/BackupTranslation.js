import React from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
//import TextField from "@material-ui/core/TextField";

import { useHistory } from "react-router-dom";
import useStyles from "./styles";
import { toast } from "react-toastify";

import Notification from "../../components/Notification/Notification";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Button } from "../../components/Wrappers/Wrappers";
import Widget from "../../components/Widget/Widget";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  useTranslationDispatch,
  useTranslationState,
} from "../../context/TranslationContext";
import { actions } from "../../context/TranslationContext";
import moment from "moment/moment";
import isEmpty from "../../helpers/isEmpty";

const BackupTranslation = () => {
  const classes = useStyles();
  const history = useHistory();
  const [backupVal, setBackupVal] = React.useState("");
  const translationDispatch = useTranslationDispatch();
  const { backupsTranslation, findLoading } = useTranslationState();

  React.useEffect(() => {
    //sendNotification("All преводы");
    actions.doFetchBackups()(translationDispatch);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    if (!isEmpty(backupsTranslation)) {
      setBackupVal(
        `${backupsTranslation[0].pname}__${backupsTranslation[0].backuped_at}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backupsTranslation]);

  const handleChange = (e) => {
    setBackupVal(e.target.value);
  };
  const handleSubmit = () => {
    actions.doRestoreBackup(backupVal, history)(sendNotification);
  };

  function sendNotification(errorMessage) {
    const componentProps = {
      type: "feedback",
      message: errorMessage != null ? errorMessage : "Translation restored!",
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

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Widget>
          {findLoading ? (
            <CircularProgress />
          ) : (
            <Grid item justify={"center"} container>
              <Box display={"flex"} flexDirection={"column"} width={600}>
                <FormControl variant="outlined" margin="dense" fullWidth>
                  <InputLabel id="id-backup-select-label">
                    Выберите бекап
                  </InputLabel>
                  <Select
                    labelId="id-backup-select-label"
                    id="id-backup-select"
                    label="Выберите бекап"
                    onChange={handleChange}
                    value={backupVal}
                  >
                    {backupsTranslation.map((item) => (
                      <MenuItem
                        value={`${item.pname}__${item.backuped_at}`}
                        key={`${item.pname}__${item.backuped_at}`}
                      >
                        {moment(item.backuped_at).format("D MMM YYYY HH:mm:ss")}{" "}
                        {item.pname}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Grid item justify={"center"} container style={{ marginTop: 35 }}>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  width={600}
                >
                  <Button
                    variant={"outlined"}
                    color={"primary"}
                    onClick={() => history.push("/app/translation/list")}
                  >
                    Отмена
                  </Button>
                  <Button
                    variant={"contained"}
                    color={"success"}
                    onClick={handleSubmit}
                  >
                    Востановить
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </Widget>
      </Grid>
    </Grid>
  );
};

export default BackupTranslation;
