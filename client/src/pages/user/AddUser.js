import React from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
//import FormHelperText from "@material-ui/core/FormHelperText";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { useHistory } from "react-router-dom";
import useStyles from "./styles";
import { toast } from "react-toastify";
import config from "../../config";

import Notification from "../../components/Notification/Notification";

import { Button, Typography } from "../../components/Wrappers/Wrappers";
import Widget from "../../components/Widget/Widget";

import { actions } from "../../context/ManagementContext";
import {
  useManagementDispatch,
  useManagementState,
} from "../../context/ManagementContext";
import {
  extractExtensionFrom,
  uploadToServer,
  deleteAvararServer,
} from "../../helpers/file";
import isEmpty from "../../helpers/isEmpty";
import useForm from "../../hooks/useForm";
import validate from "./validation";
import DateFnsUtils from "@date-io/date-fns";
import { Locales } from "../../helpers/dateFormat";
import md5 from "md5";

function getSteps() {
  return ["Создать аккаунт", "Детали", "Business Details", "Social"];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return "Создать аккаунт";
    case 1:
      return "Детали";
    case 2:
      return "Business Details";
    case 3:
      return "Social";
    default:
      return "";
  }
}

const AddUser = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [isLoadingImg, setIsLoadingImg] = React.useState(false);
  const {
    currentUser: { user_id },
  } = useManagementState();
  console.log("activeStep", activeStep, "user_id", user_id);
  //  let user_id = null;
  //  if (currentUser?.user_id) user_id = currentUser.user_id;

  const fileInput = React.useRef(null);
  const steps = getSteps();
  const classes = useStyles();

  const deleteOneImage = async () => {
    if (user_id) {
      setIsLoadingImg(true);
      await deleteAvararServer(
        `${config.baseURLApi}/users/upload-avatar/${user_id}`
      )
        .then((res) => {
          setIsLoadingImg(false);
        })
        .catch((e) => {
          console.log("delete img err", e);
          setIsLoadingImg(false);
        });
    }
  };

  const handleFile = async (event) => {
    const filedata = event.target.files[0];
    const filename = filedata.name;
    const extension = filename != null && extractExtensionFrom(filename);
    if (
      user_id != null &&
      filename != null &&
      ["png", "jpg", "jpeg", "gif"].includes(extension.toLowerCase())
    ) {
      const filename = `${user_id}.${extension}`;

      setIsLoadingImg(true);
      await uploadToServer(
        `${config.baseURLApi}/users/upload-avatar/${user_id}`,
        { filedata, filename }
      )
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
        "Можно загружать только файлы с расширением .PNG, .JPG, .JPEG!"
      );
    }
    return null;
  };

  function sendNotification(errorMessage = null) {
    const componentProps = {
      type: "feedback",
      message: errorMessage != null ? errorMessage : "Пользовотель добавлен!",
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

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const managementDispatch = useManagementDispatch();
  const history = useHistory();

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
    console.log("------- activeStep -----------", activeStep);
    if (activeStep === 0 && values.username !== "") {
      actions.doCreate(
        { username: values.username, password: md5(values.password) },
        handleBack,
        sendNotification
      )(managementDispatch, history);
    }
    if (activeStep === 1 && user_id != null) {
      actions.doUpdate(
        user_id,
        values,
        sendNotification
      )(managementDispatch, history);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // React.useEffect(() => {
  //   setValues({
  //     ...currentUser,
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentUser, id]);

  const saveData = () => {
    if (user_id)
      actions.doUpdate(
        user_id,
        values,
        history
      )(managementDispatch, sendNotification);
  };

  const { values, errors, handleChange, setValues } = useForm(
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
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel
                    {...labelProps}
                    classes={{ completed: classes.stepCompleted }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Widget>
      </Grid>
      <Grid item xs={12}>
        <Widget>
          <Grid item justify={"center"} container>
            <Box display={"flex"} flexDirection={"column"} width={600}>
              <Typography
                variant={"h5"}
                weight={"medium"}
                style={{ marginBottom: 30 }}
              >
                {getStepContent(activeStep)}
              </Typography>
              {activeStep === 0 ? (
                <>
                  <TextField
                    variant="outlined"
                    value={values?.username || ""}
                    name="username"
                    autoComplete={false}
                    onChange={handleChange}
                    style={{ marginBottom: 35 }}
                    placeholder="Username или Email "
                    type="text"
                    fullWidth
                    required
                    error={errors?.username != null}
                    helperText={errors?.username != null && errors?.username}
                  />
                  <TextField
                    variant="outlined"
                    onChange={handleChange}
                    value={values?.password || ""}
                    name="password"
                    autoComplete={false}
                    style={{ marginBottom: 35 }}
                    placeholder="Пароль"
                    type="password"
                    fullWidth
                    required
                    error={errors?.password != null}
                    helperText={errors?.password != null && errors?.password}
                  />
                  {/* <FormControl
                    variant="outlined"
                    onChange={handleChange}
                    style={{ marginBottom: 35 }}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Role
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={newUser.role || "user"}
                      defaultValue="User"
                      name="role"
                      onChange={handleChange}
                      label="Role"
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                    <FormHelperText id={"demo-simple-select-outlined"}>
                      Please choose the role
                    </FormHelperText>
                  </FormControl> */}
                </>
              ) : activeStep === 1 && user_id != null ? (
                <>
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
                            src={`${config.baseURLApi}/users/photo/${user_id}`}
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
              ) : activeStep === 2 && user_id != null ? (
                <>будет позже..</>
              ) : user_id != null ? (
                <>не обязательно</>
              ) : null}
              <div>
                <div>
                  {activeStep === 0 ? (
                    <Box display={"flex"} justifyContent={"flex-end"}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                      >
                        Next
                      </Button>
                    </Box>
                  ) : (
                    <Box display={"flex"} justifyContent={"space-between"}>
                      <Button
                        onClick={handleBack}
                        variant={"outlined"}
                        color={"primary"}
                      >
                        Назад
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                      >
                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                      </Button>
                    </Box>
                  )}
                </div>
              </div>
            </Box>
          </Grid>
        </Widget>
      </Grid>
    </Grid>
  );
};

export default AddUser;
