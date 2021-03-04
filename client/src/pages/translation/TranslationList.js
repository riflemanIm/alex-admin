import React from "react";
import {
  Grid,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@material-ui/core";

import Widget from "../../components/Widget/Widget";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Notification from "../../components/Notification/Notification";
import { toast } from "react-toastify";
import { Typography, Link, Button } from "../../components/Wrappers/Wrappers";
import {
  useTranslationDispatch,
  useTranslationState,
} from "../../context/TranslationContext";
import { useUserState } from "../../context/UserContext";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import useStyles from "./styles";
// Icons
import {
  DeleteOutlined as DeleteIcon,
  DoneAll as DoneAllIcon,
  CreateOutlined as CreateIcon,
} from "@material-ui/icons";

import { actions } from "../../context/TranslationContext";
import moment from "moment/moment";
import isEmpty from "../../helpers/isEmpty";
import AdminActions from "./TranslationAdminActions";
import AdminActionsMenu from "./TranslationAdminActionsMenu";
import InterActions from "./TranslationInterActions";
import InterActionsMenu from "./TranslationInterActionsMenu";
import TranslationFilters from "./TranslationFilters";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "num",
    status: ["admin"],
    align: "left",
    disablePadding: false,
    label: "ID",
  },

  { id: "actions", align: "left", disablePadding: false, label: "Actions" },
  //{ id: "id", align: "left", disablePadding: true, label: "ID" },
  //{ id: "pname", align: "left", disablePadding: false, label: "Project" },
  {
    id: "gkey",
    status: ["admin"],
    align: "left",
    disablePadding: false,
    label: "Group",
  },
  {
    id: "tkey",
    status: ["admin"],
    align: "left",
    disablePadding: false,
    label: "Key",
  },
  { id: "lang_ru", align: "left", disablePadding: false, label: "Russian" },
  { id: "lang_en", align: "left", disablePadding: false, label: "English" },
  { id: "lang_fr", align: "left", disablePadding: false, label: "Franch" },
  { id: "created_at", align: "left", disablePadding: false, label: "Created" },
  { id: "updated_at", align: "left", disablePadding: false, label: "Changed" },
  { id: "email", align: "left", disablePadding: false, label: "By" },
];

function EnhancedTableHead(props) {
  const {
    currentUser: { status },
  } = useUserState();

  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {status === "interpreter" && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ "aria-label": "select all desserts" }}
            />
          </TableCell>
        )}
        {headCells
          .filter(
            (item) =>
              item?.status == null ||
              (item?.status != null && item?.status.includes(status))
          )
          .map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.align}
              padding={headCell.disablePadding ? "none" : "default"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                <Typography noWrap weight={"medium"} variant={"body2"}>
                  {headCell.label}
                </Typography>
              </TableSortLabel>
            </TableCell>
          ))}
      </TableRow>
    </TableHead>
  );
}

const TranslationList = () => {
  const {
    currentUser: { status, account_id },
  } = useUserState();

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("pname");
  const [page, setPage] = React.useState(0);
  const translationRowsPerPage = localStorage.getItem("translationRowsPerPage");

  const [rowsPerPage, setRowsPerPage] = React.useState(
    translationRowsPerPage != null ? parseInt(translationRowsPerPage, 10) : 5
  );
  const [translationsRows, setTranslationsRows] = React.useState([]);
  const translationDispatch = useTranslationDispatch();
  function fetchAll() {
    //actions.doNew(translationDispatch);
    actions.doFetch({}, false)(translationDispatch);
  }
  React.useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    rows,
    idToDelete,
    modalOpenConfirm,
    selected,
    modalOpenCheched,
    checked,
    filterVals,
    loading,
  } = useTranslationState();

  const classes = useStyles();

  React.useEffect(() => {
    setTranslationsRows(rows);
  }, [rows]);

  const openModalConfirm = (cell) => {
    actions.doOpenConfirm(cell)(translationDispatch);
  };

  const closeModalConfirm = () => {
    actions.doCloseConfirm()(translationDispatch);
  };

  const closeModalCheched = () => {
    translationDispatch({
      type: "TRANSLATIONS_CHECKED_CLOSE",
    });
  };

  const openModalCheched = () => {
    translationDispatch({
      type: "TRANSLATIONS_CHECKED_OPEN",
    });
  };

  const handleDelete = () => {
    actions.doDelete(idToDelete)(translationDispatch);
    sendNotification("Translation deleted");
  };

  function sendNotification(text, isWarning = false) {
    const componentProps = {
      type: "feedback",
      message: text,
      variant: "contained",
      color: isWarning ? "warning" : "success",
      isBig: false,
    };
    const options = {
      type: isWarning ? "warning" : "info",
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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = translationsRows.map((n) => n.id);
      translationDispatch({
        type: "TRANSLATIONS_SET_SELECTED",
        payload: newSelected,
      });
      return;
    }

    translationDispatch({
      type: "TRANSLATIONS_SET_SELECTED",
      payload: [],
    });
  };

  const handleClickRow = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    translationDispatch({
      type: "TRANSLATIONS_SET_SELECTED",
      payload: newSelected,
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const rowsPerPage = parseInt(event.target.value, 10);
    localStorage.setItem("translationRowsPerPage", rowsPerPage);
    setRowsPerPage(rowsPerPage);
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, translationsRows.length - page * rowsPerPage);

  const needCheck = (row, lang) => {
    const {
      lang_ru,
      lang_en,
      lang_fr,
      checked_ru,
      checked_en,
      checked_fr,
    } = row;
    let val = "";
    let checked = null;
    if (lang === "ru") {
      val = lang_ru;
      checked = checked_ru;
    }
    if (lang === "en") {
      val = lang_en;
      checked = checked_en;
    }
    if (lang === "fr") {
      val = lang_fr;
      checked = checked_fr;
    }

    return (
      <Typography variant="body2" color={!checked ? "info" : ""} block={true}>
        {val}
      </Typography>
    );
  };

  const handleChecked = (lang) => {
    const newChecked = {};

    newChecked[`checked_${lang}`] = !checked[`checked_${lang}`];
    translationDispatch({
      type: "TRANSLATIONS_SELECTED_CHECKED",
      payload: { ...checked, ...newChecked },
    });
  };

  const saveChecked = () => {
    if (isEmpty(selected)) sendNotification("No rows selected", true);
    else
      actions.doUpdateChecked({
        selected,
        ...checked,
        account_id,
      })(translationDispatch, sendNotification, fetchAll);
  };
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  //console.log("rows", rows);

  return (
    <Grid container spacing={3}>
      <Dialog
        open={modalOpenConfirm}
        onClose={closeModalConfirm}
        scroll={"body"}
        aria-labelledby="scroll-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete tarnslation?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The translation will be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModalConfirm} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="success" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={modalOpenCheched}
        onClose={closeModalCheched}
        scroll={"body"}
        aria-labelledby="scroll-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          Select language(s) and confirm
        </DialogTitle>
        <DialogContent>
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
                    Russian
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
                    English
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
                    Franch
                  </Typography>
                }
              />
            </Box>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={closeModalCheched}>
            Cancel
          </Button>
          <Button color="success" onClick={saveChecked} autoFocus>
            Save selected
          </Button>
        </DialogActions>
      </Dialog>

      <Grid item xs={12}>
        <Widget inheritHeight>
          <Grid container spacing={2}>
            {/* actions for interpreter  */}

            {status === "interpreter" && (
              <Grid item>
                <Button
                  variant={"contained"}
                  color={"success"}
                  onClick={() => {
                    if (isEmpty(selected)) {
                      sendNotification("No rows selected", true);
                    } else {
                      openModalCheched();
                    }
                  }}
                  style={{ marginTop: 8 }}
                >
                  <Box mr={1} display={"flex"}>
                    <DoneAllIcon />
                  </Box>
                  Mark verified
                </Button>
              </Grid>
            )}

            {/* actions for admin  */}

            {status === "admin" ? (
              isMobile ? (
                <AdminActionsMenu pname={filterVals.pname} />
              ) : (
                <AdminActions pname={filterVals.pname} />
              )
            ) : isMobile ? (
              <InterActionsMenu pname={filterVals.pname} />
            ) : (
              <InterActions pname={filterVals.pname} />
            )}

            <TranslationFilters
              setPage={setPage}
              setTranslationsRows={setTranslationsRows}
            />
          </Grid>
        </Widget>
      </Grid>
      {!loading ? (
        <Grid item xs={12}>
          <Widget inheritHeight noBodyPadding>
            <TableContainer>
              <Table
                aria-labelledby="tableTitle"
                size="medium"
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={translationsRows.length}
                />
                <TableBody>
                  {stableSort(translationsRows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClickRow(event, row.id)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                        >
                          {status === "interpreter" && (
                            <TableCell
                              padding="checkbox"
                              style={{ width: "5%" }}
                            >
                              <Checkbox
                                checked={isItemSelected}
                                inputProps={{
                                  "aria-labelledby": labelId,
                                }}
                              />
                            </TableCell>
                          )}
                          {status === "admin" && (
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              style={{ width: "5%" }}
                            >
                              <Typography variant={"body2"}>
                                {row.id}
                              </Typography>
                            </TableCell>
                          )}
                          <TableCell align="left" style={{ width: "5%" }}>
                            <Box
                              display={"flex"}
                              style={{
                                marginLeft: -12,
                                width: 100,
                              }}
                            >
                              <IconButton color={"primary"}>
                                <Link
                                  href={`#app/Translation/${row.id}/edit`}
                                  color="#fff"
                                >
                                  <CreateIcon />
                                </Link>
                              </IconButton>
                              {status === "admin" && (
                                <IconButton
                                  onClick={() => openModalConfirm(row.id)}
                                  color={"primary"}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              )}
                            </Box>
                          </TableCell>

                          {headCells
                            .filter(
                              (item) =>
                                item?.status == null ||
                                (item?.status != null &&
                                  item?.status.includes(status))
                            )
                            .map(
                              (item, inx) =>
                                (status === "admin" ? inx > 1 : inx >= 1) && (
                                  <TableCell
                                    align="left"
                                    key={item.id}
                                    size={
                                      [
                                        "lang_ru",
                                        "lang_en",
                                        "lang_fr",
                                      ].includes(item.id)
                                        ? "medium"
                                        : "small"
                                    }
                                    style={
                                      [
                                        "lang_ru",
                                        "lang_en",
                                        "lang_fr",
                                      ].includes(item.id)
                                        ? { width: "30%" }
                                        : { width: "10%" }
                                    }
                                  >
                                    {["created_at", "updated_at"].includes(
                                      item.id
                                    ) ? (
                                      <Typography
                                        variant={"body2"}
                                        block={true}
                                        size="small"
                                      >
                                        {moment(row[item.id]).format(
                                          "DD.MM.YYYY HH:mm"
                                        )}{" "}
                                      </Typography>
                                    ) : item.id === "lang_ru" ? (
                                      needCheck(row, "ru")
                                    ) : item.id === "lang_en" ? (
                                      needCheck(row, "en")
                                    ) : item.id === "lang_fr" ? (
                                      needCheck(row, "fr")
                                    ) : item.id === "tkey" ? (
                                      <Typography
                                        variant={"body2"}
                                        color="secondary"
                                        weight="medium"
                                        block={true}
                                        size="small"
                                      >
                                        {row[item.id]}
                                      </Typography>
                                    ) : (
                                      <Typography
                                        size="small"
                                        variant={"body2"}
                                        block={true}
                                      >
                                        {row[item.id]}
                                      </Typography>
                                    )}
                                  </TableCell>
                                )
                            )}
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100, 1000]}
              component="div"
              count={translationsRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Widget>
        </Grid>
      ) : (
        <CircularProgress />
      )}
    </Grid>
  );
};

export default TranslationList;
