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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Switch from "@material-ui/core/Switch";

//import { Typography } from "../../components/Wrappers/Wrappers";
import Widget from "../../components/Widget/Widget";
import CircularProgress from "@material-ui/core/CircularProgress";
import { uploadToServer } from "../../helpers/file";
import config from "../../config";
import { useUserState } from "../../context/UserContext";
import {
  useTranslationState,
  useTranslationDispatch,
  actions,
} from "../../context/TranslationContext";
import isEmpty from "../../helpers/isEmpty";

const ImportTranslation = () => {
  const classes = useStyles();
  const [isLoadingFile, setIsLoadingFile] = React.useState(false);
  const { filterVals } = useTranslationState();
  //const filterVals = JSON.parse(localStorage.getItem("translationFilterVals"));

  console.log("ImportTranslation filterVals", filterVals);
  const [pname, setPName] = React.useState(
    !isEmpty(filterVals) ? filterVals.pname : "mobimed_site"
  );
  const [deleteOldKeys, setDeleteOldKeys] = React.useState(false);
  const [doBackup, setDoBackup] = React.useState(true);

  const fileInput = React.useRef(null);
  const {
    currentUser: { account_id },
  } = useUserState();

  function sendNotification(errorMessage = null, isBig = null) {
    const componentProps = {
      type: "feedback",
      message: errorMessage != null ? errorMessage : "Translation imported",
      variant: "contained",
      color: errorMessage != null ? "warning" : "success",
      isBig,
    };
    const options = {
      type: errorMessage != null ? "defence" : "info",
      position: toast.POSITION.TOP_RIGHT,
      progressClassName: classes.progress,
      className: classes.notification,
      timeOut: 1200,
    };
    return toast(
      <Notification
        {...componentProps}
        className={classes.notificationComponent}
      />,
      options
    );
  }

  React.useEffect(() => {
    sendNotification(" Обязательно выберете СВОЙ проект! ", true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const history = useHistory();

  const translationDispatch = useTranslationDispatch();

  const handlePName = (e) => {
    setPName(e.target.value);
    actions.setFilter({ pname: e.target.value })(translationDispatch);
  };

  const handleFile = async (event) => {
    const filedata = event.target.files[0];
    const filename = filedata.name;
    if (
      filename != null &&
      ["en.json", "ru.json", "fr.json"].includes(filename.toLowerCase())
    ) {
      setIsLoadingFile(true);

      await uploadToServer(`${config.baseURLApi}/translations/import-json`, {
        filedata,
        filename,
        account_id,
        pname,
        deleteOldKeys,
        doBackup,
      })
        .then((res) => {
          setIsLoadingFile(false);
          sendNotification();
          console.log("res", res);
          setTimeout(() => {
            history.push("/app/translation/list");
          }, 1000);
        })
        .catch((e) => {
          setIsLoadingFile(false);
          console.log("ee", e.response.data);
          sendNotification(e.response.data.message);
        });
    } else {
      sendNotification(
        "Название файла должно быть en.json или ru.json или fr.json"
      );
    }
    return null;
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Widget>
          <Grid item justify={"center"} container>
            <Box display={"flex"} flexDirection={"column"} width={600}>
              {!isLoadingFile ? (
                <>
                  <FormControl variant="outlined" margin="dense" fullWidth>
                    <InputLabel id="id-pname-label">
                      Выберите название проекта:
                    </InputLabel>
                    <Select
                      labelId="id-pname-label"
                      id="id-pname-select"
                      label="Выберите название проекта:"
                      onChange={handlePName}
                      value={pname}
                    >
                      <MenuItem value="">
                        <em>Все</em>
                      </MenuItem>
                      {config.pNames.map((item) => (
                        <MenuItem value={item} key={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControlLabel
                    style={{ marginTop: 18 }}
                    control={
                      <Switch
                        checked={deleteOldKeys}
                        onChange={() => setDeleteOldKeys(!deleteOldKeys)}
                        name="deleteOldKeys"
                        color="primary"
                      />
                    }
                    label="Удалить все переводы"
                  />
                  <FormHelperText color="warning">
                    Будут удалены все переводы для выбранного проекта для всех
                    языков. Будьте внимательны
                  </FormHelperText>

                  <FormControlLabel
                    style={{ marginTop: 18 }}
                    control={
                      <Switch
                        checked={doBackup}
                        onChange={() => setDoBackup(!doBackup)}
                        name="doBackup"
                        color="primary"
                      />
                    }
                    label="Сдеать Backup"
                  />
                  <FormHelperText color="warning">
                    Будет создана копия всех строк, для данного проекта на
                    определенное время чтобы была возможность отката
                  </FormHelperText>

                  <label
                    className={classes.uploadLabel}
                    style={{ cursor: "pointer" }}
                  >
                    Выберите файл с переводом
                    <input
                      style={{ display: "none" }}
                      accept="application/js"
                      type="file"
                      ref={fileInput}
                      onChange={handleFile}
                    />
                  </label>
                  <FormHelperText>
                    Название файла должно быть <strong>en.json</strong> или{" "}
                    <strong>ru.json</strong> или <strong>fr.json</strong>
                    <br />
                    <strong>Нельзя использовать точку в названии ключа</strong>
                  </FormHelperText>
                </>
              ) : (
                <CircularProgress />
              )}
            </Box>
          </Grid>
        </Widget>
      </Grid>
    </Grid>
  );
};

export default ImportTranslation;
