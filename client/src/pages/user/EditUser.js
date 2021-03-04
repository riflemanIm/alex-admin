import React, { useEffect } from "react";
import { Grid, Box, TextField } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useParams } from "react-router";
import Checkbox from "@material-ui/core/Checkbox";
import Switch from "@material-ui/core/Switch";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import CircularProgress from "@material-ui/core/CircularProgress";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { useLocation, useHistory } from "react-router-dom";
import useStyles from "./styles";

import {
  PersonOutline as PersonOutlineIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
} from "@material-ui/icons";

import Widget from "../../components/Widget/Widget";
import { Typography, Button } from "../../components/Wrappers/Wrappers";
import { toast } from "react-toastify";

import Notification from "../../components/Notification/Notification";
import {
  useManagementDispatch,
  useManagementState,
} from "../../context/ManagementContext";
import config from "../../config";

import { actions } from "../../context/ManagementContext";
import isEmpty from "../../helpers/isEmpty";
import {
  extractExtensionFrom,
  uploadToServer,
  deleteAvararServer,
} from "../../helpers/file";

import useForm from "../../hooks/useForm";
import validate from "./validation";
import DateFnsUtils from "@date-io/date-fns";
import { Locales } from "../../helpers/dateFormat";

const EditUser = () => {
  const classes = useStyles();
  const history = useHistory();
  const [tab, setTab] = React.useState(0);
  const [password, setPassword] = React.useState({
    newPassword: "",
    confirmPassword: "",
    currentPassword: "",
  });

  const [editable, setEditable] = React.useState(false);
  const [isLoadingImg, setIsLoadingImg] = React.useState(false);

  const { id } = useParams();

  const fileInput = React.useRef(null);
  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
  };
  const location = useLocation();
  const managementDispatch = useManagementDispatch();
  const { currentUser } = useManagementState();

  const deleteOneImage = async () => {
    setIsLoadingImg(true);
    await deleteAvararServer(`${config.baseURLApi}/users/upload-avatar/${id}`)
      .then((res) => {
        setIsLoadingImg(false);
      })
      .catch((e) => {
        console.log("delete img err", e);
        setIsLoadingImg(false);
      });
  };

  const handleFile = async (event) => {
    const filedata = event.target.files[0];
    const filename = filedata.name;
    const extension = filename != null && extractExtensionFrom(filename);
    if (
      filename != null &&
      ["png", "jpg", "jpeg", "gif"].includes(extension.toLowerCase())
    ) {
      const filename = `${id}.${extension}`;

      setIsLoadingImg(true);
      await uploadToServer(`${config.baseURLApi}/users/upload-avatar/${id}`, {
        filedata,
        filename,
      })
        .then((res) => {
          setIsLoadingImg(false);
          console.log("res", res);
        })
        .catch((e) => {
          setIsLoadingImg(false);
          console.log("ee", e);
        });
    } else {
      sendNotification(
        "Можно загружать только файлы с расширением .PNG, .JPG, .JPEG"
      );
    }
    return null;
  };

  function sendNotification(errorMessage) {
    const componentProps = {
      type: "feedback",
      message:
        errorMessage != null ? errorMessage : "Пользователь отредактирован!",
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
    if (location.pathname.includes("edit")) {
      setEditable(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    setValues({
      ...currentUser,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, id]);

  const saveData = () => {
    actions.doUpdate(id, values, sendNotification)(managementDispatch, history);
  };

  function handleUpdatePassword() {
    actions.doChangePassword(password)(managementDispatch);
  }

  function handleChangePassword(e) {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  }

  const { values, errors, handleChange, handleSubmit, setValues } = useForm(
    saveData,
    validate
  );
  const handleDateChange = (birth_date) => {
    if (birth_date != null && birth_date !== "")
      setValues({
        ...values,
        birth_date,
      });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Widget>
          <Box display={"flex"} justifyContent={"center"}>
            <Tabs
              indicatorColor="primary"
              textColor="primary"
              value={tab}
              onChange={handleChangeTab}
              aria-label="full width tabs example"
            >
              <Tab
                label="ACCOUNT"
                icon={<PersonOutlineIcon />}
                classes={{ wrapper: classes.icon }}
              />

              <Tab
                label="PROFILE"
                icon={<PersonOutlineIcon />}
                classes={{ wrapper: classes.icon }}
              />
              <Tab
                label="CHANGE PASSWORD"
                icon={<LockIcon />}
                classes={{ wrapper: classes.icon }}
                disabled
              />
              <Tab
                label="SETTINGS"
                icon={<SettingsIcon />}
                classes={{ wrapper: classes.icon }}
                disabled
              />
            </Tabs>
          </Box>
        </Widget>
      </Grid>
      <Grid item xs={12}>
        <Widget>
          <Grid item justify={"center"} container>
            <Box display={"flex"} flexDirection={"column"} width={600}>
              {tab === 0 ? (
                <>
                  <Typography
                    variant={"h5"}
                    weight={"medium"}
                    style={{ marginBottom: 30 }}
                  >
                    Аккаунт
                  </Typography>
                  <TextField
                    variant="outlined"
                    value={values?.username || ""}
                    name="username"
                    onChange={handleChange}
                    style={{ marginBottom: 35 }}
                    placeholder="Username"
                    type="text"
                    fullWidth
                    required
                    error={errors?.username != null}
                    helperText={errors?.username != null && errors?.username}
                  />

                  {/* <FormControl variant="outlined" style={{ marginBottom: 35 }}>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      defaultValue="user"
                      value={data && data.role}
                      name="email"
                      onChange={handleChange}
                    >
                      <MenuItem value={"admin"}>Admin</MenuItem>
                      <MenuItem value={"user"}>User</MenuItem>
                    </Select>
                  </FormControl> */}
                </>
              ) : tab === 1 ? (
                <>
                  <Typography
                    variant={"h5"}
                    weight={"medium"}
                    style={{ marginBottom: 35 }}
                  >
                    Персональная информация
                  </Typography>

                  <Typography weight={"medium"}>Фото:</Typography>
                  <div className={classes.galleryWrap}>
                    <div className={classes.imgWrap}>
                      {isLoadingImg ? (
                        <CircularProgress size={18} />
                      ) : (
                        <>
                          <span
                            className={classes.deleteImageX}
                            onClick={() => deleteOneImage()}
                          >
                            ×
                          </span>
                          <img
                            src={`${config.baseURLApi}/users/photo/${currentUser.user_id}`}
                            alt=""
                            height={"100%"}
                          />
                        </>
                      )}
                    </div>
                  </div>

                  <label
                    className={classes.uploadLabel}
                    style={{ cursor: "pointer" }}
                  >
                    {"Upload an image"}
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

                  <TextField
                    variant="outlined"
                    value={(!isEmpty(values) && values.first_name) || ""}
                    name="first_name"
                    onChange={handleChange}
                    style={{ marginBottom: 35 }}
                    placeholder="Имя"
                    type="text"
                    fullWidth
                    required
                    error={errors?.first_name != null}
                    helperText={
                      errors?.first_name != null && errors?.first_name
                    }
                  />
                  <TextField
                    variant="outlined"
                    value={values.middle_name || ""}
                    name="middle_name"
                    onChange={handleChange}
                    style={{ marginBottom: 35 }}
                    placeholder="Отчество"
                    type="text"
                    fullWidth
                  />
                  <TextField
                    variant="outlined"
                    value={values.last_name || ""}
                    name="last_name"
                    onChange={handleChange}
                    style={{ marginBottom: 35 }}
                    placeholder="Фамилие"
                    type="text"
                    fullWidth
                    required
                    error={errors?.last_name != null}
                    helperText={errors?.last_name != null && errors?.last_name}
                  />
                  <TextField
                    variant="outlined"
                    style={{ marginBottom: 35 }}
                    value={values?.phone || ""}
                    name="phone"
                    onChange={handleChange}
                    placeholder="Телефон"
                    type="tel"
                    fullWidth
                    required
                    error={errors?.phone != null}
                    helperText={errors?.phone != null && errors?.phone}
                  />
                  <TextField
                    variant="outlined"
                    style={{ marginBottom: 35 }}
                    value={values?.notify_email || ""}
                    name="notify_email"
                    onChange={handleChange}
                    placeholder="Email"
                    type="email"
                    fullWidth
                    required
                    error={errors?.notify_email != null}
                    helperText={
                      errors?.notify_email != null && errors?.notify_email
                    }
                  />
                  <MuiPickersUtilsProvider
                    utils={DateFnsUtils}
                    locale={Locales["ru"]}
                  >
                    <KeyboardDatePicker
                      disableToolbar
                      autoOk
                      variant="inline"
                      inputVariant="outlined"
                      format={"dd.MM.yyyy"}
                      margin="normal"
                      //id="date-picker-inline"
                      label="Дата рождения"
                      value={values.birth_date}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "aria-birth-date-label",
                      }}
                      style={{ marginBottom: 35 }}
                      fullWidth
                      error={errors?.birth_date != null}
                      helperText={
                        errors?.birth_date != null && errors?.birth_date
                      }
                    />
                  </MuiPickersUtilsProvider>

                  <FormControl
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    style={{ marginBottom: 35 }}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Пол
                    </InputLabel>
                    <Select
                      //labelId="demo-simple-select-outlined-label"
                      //id="demo-simple-select-outlined"
                      name="gender"
                      value={values.gender != null && values.gender}
                      onChange={handleChange}
                      label="Пол"
                    >
                      <MenuItem value="M">Мужской</MenuItem>
                      <MenuItem value="F">Женский</MenuItem>
                    </Select>
                  </FormControl>
                </>
              ) : tab === 2 ? (
                <>
                  <Typography
                    variant={"h5"}
                    weight={"medium"}
                    style={{ marginBottom: 35 }}
                  >
                    Password
                  </Typography>
                  <TextField
                    variant="outlined"
                    style={{ marginBottom: 35 }}
                    defaultValue={"Current Password"}
                    value={password.currentPassword || ""}
                    name="currentPassword"
                    onChange={handleChangePassword}
                    helperText={"Forgot Password?"}
                  />
                  <TextField
                    variant="outlined"
                    style={{ marginBottom: 35 }}
                    defaultValue={"New Password"}
                    value={password.newPassword || ""}
                    name="newPassword"
                    onChange={handleChangePassword}
                  />
                  <TextField
                    variant="outlined"
                    style={{ marginBottom: 35 }}
                    defaultValue={"Verify Password"}
                    value={password.confirmPassword || ""}
                    name="confirmPassword"
                    onChange={handleChangePassword}
                  />
                </>
              ) : tab === 3 ? (
                <>
                  <Typography
                    variant={"h5"}
                    weight={"medium"}
                    style={{ marginBottom: 35 }}
                  >
                    Settings
                  </Typography>
                  <FormControl variant="outlined" style={{ marginBottom: 35 }}>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={10}
                    >
                      <MenuItem value={10}>English</MenuItem>
                      <MenuItem value={20}>Admin</MenuItem>
                      <MenuItem value={30}>Super Admin</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography weight={"bold"}>Communication:</Typography>
                  <Box display={"flex"}>
                    <FormControlLabel
                      control={
                        <Checkbox checked name="checkedB" color="secondary" />
                      }
                      label="Email"
                    />
                    <FormControlLabel
                      control={<Checkbox name="checkedB" color="secondary" />}
                      label="Messages"
                    />
                    <FormControlLabel
                      control={<Checkbox name="checkedB" color="secondary" />}
                      label="Phone"
                    />
                  </Box>
                  <Box display={"flex"} mt={2} alignItems={"center"}>
                    <Typography weight={"medium"}>
                      Email notification
                    </Typography>
                    <Switch color={"primary"} checked />
                  </Box>
                  <Box display={"flex"} mt={2} mb={2} alignItems={"center"}>
                    <Typography weight={"medium"}>
                      Send copy to personal email
                    </Typography>
                    <Switch color={"primary"} />
                  </Box>
                </>
              ) : null}
              {editable && (
                <Box display={"flex"} justifyContent={"space-between"}>
                  {tab !== 2 ? (
                    <>
                      <Button variant={"outlined"} color={"primary"}>
                        Reset
                      </Button>
                      <Button
                        variant={"contained"}
                        color={"success"}
                        onClick={handleSubmit}
                      >
                        Сохранить
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant={"outlined"} color={"primary"}>
                        Reset
                      </Button>
                      <Button
                        variant={"contained"}
                        color={"success"}
                        onClick={handleUpdatePassword}
                      >
                        Save Password
                      </Button>
                    </>
                  )}
                </Box>
              )}
            </Box>
          </Grid>
        </Widget>
      </Grid>
    </Grid>
  );
};

export default EditUser;
