import React from "react";
import {
  Grid,
  Box,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField as Input,
} from "@material-ui/core";
import Widget from "../../components/Widget/Widget";
import { Button } from "../../components/Wrappers/Wrappers";
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
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import Notification from "../../components/Notification/Notification";
import { toast } from "react-toastify";

import {
  Typography,
  Chip,
  Avatar,
  Link,
} from "../../components/Wrappers/Wrappers";
import {
  useManagementDispatch,
  useManagementState,
} from "../../context/ManagementContext";

import useStyles from "./styles";
// Icons
import {
  Add as AddIcon,
  //GetApp as DownloadIcon,
  Search as SearchIcon,
  CreateOutlined as CreateIcon,
  HelpOutline as HelpIcon,
} from "@material-ui/icons";

import { actions } from "../../context/ManagementContext";
import config from "../../config";
import moment from "moment/moment";

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
  { id: "id", numeric: false, disablePadding: true, label: "ID" },
  { id: "actions", numeric: false, disablePadding: false, label: "Действия" },
  { id: "avatar", numeric: false, disablePadding: false, label: "Фото" },
  { id: "username", numeric: false, disablePadding: false, label: "Username" },
  { id: "fio", numeric: false, disablePadding: false, label: "ФИО" },
  {
    id: "notify_email",
    numeric: false,
    disablePadding: false,
    label: "Email для сообщений",
  },

  {
    id: "gender",
    numeric: false,
    disablePadding: false,
    label: "Пол",
  },
  {
    id: "birth_date",
    numeric: false,
    disablePadding: false,
    label: "Дата рождения",
  },

  {
    id: "cdate",
    numeric: false,
    disablePadding: false,
    label: "Создан",
  },
];

function EnhancedTableHead(props) {
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
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
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

const UserList = () => {
  const classes = useStyles();

  function sendNotification(text) {
    const componentProps = {
      type: "feedback",
      message: text,
      variant: "contained",
      color: "success",
    };
    const options = {
      type: "info",
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

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);

  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [usersRows, setUsersRows] = React.useState([]);

  const managementDispatch = useManagementDispatch();
  const managementValue = useManagementState();

  const openModal = (cell) => {
    actions.doOpenConfirm(cell)(managementDispatch);
  };

  const closeModal = () => {
    actions.doCloseConfirm()(managementDispatch);
  };

  const handleDelete = () => {
    actions.doDelete(managementValue.idToDelete)(managementDispatch);
    sendNotification("User deleted");
  };

  React.useEffect(() => {
    //sendNotification("GETTING ALL USERS");
    async function fetchAPI() {
      try {
        await actions.doFetch({}, false)(managementDispatch);
        //setUsersRows(managementValue.rows);
      } catch (e) {
        console.log(e);
      }
    }
    fetchAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setUsersRows(managementValue.rows);
  }, [managementValue.rows]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = managementValue.rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
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

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, usersRows.length - page * rowsPerPage);

  const handleSearch = (e) => {
    console.log("e.currentTarget.value", e.currentTarget.value);

    const newArr = managementValue.rows.filter((row) =>
      `${row.last_name}${row.first_name}${row.middle_name}${row.username}`
        .toLowerCase()
        .includes(e.currentTarget.value.toLowerCase())
    );
    if (newArr.length > 0) setDense(true);
    else setDense(false);
    setUsersRows(newArr);
  };

  return (
    <Grid container spacing={3}>
      <Dialog
        open={managementValue.modalOpen}
        onClose={closeModal}
        scroll={"body"}
        aria-labelledby="scroll-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure that you want to delete user?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            User will be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary">
            Disagree
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Grid item xs={12}>
        <Widget inheritHeight>
          <Box
            justifyContent={"space-between"}
            display={"flex"}
            alignItems={"flex-start"}
          >
            <Box>
              <Link href="#/app/user/add" underline="none" color="#fff">
                <Button variant={"contained"} color={"success"}>
                  <Box mr={1} display={"flex"}>
                    <AddIcon />
                  </Box>
                  Добавить
                </Button>
              </Link>
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"flex-end"}
            >
              {/* <Button variant={"outlined"} color={"secondary"}>
                <Box display={"flex"} mr={1}>
                  <DownloadIcon />
                </Box>
                Download
              </Button> */}
              <Input
                id="search-field"
                label="Поиск по ФИО"
                margin="dense"
                variant="outlined"
                onChange={(e) => handleSearch(e)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </Widget>
      </Grid>
      <Grid item xs={12}>
        <Widget inheritHeight noBodyPadding>
          <TableContainer>
            <Table
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={usersRows.length}
              />
              <TableBody>
                {stableSort(usersRows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.user_id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    const fio = `${row.last_name} ${row.first_name} ${row.middle_name}`;
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.user_id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.user_id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          <Typography variant={"body2"}>{index + 1}</Typography>
                        </TableCell>

                        <TableCell align="left">
                          <Box
                            display={"flex"}
                            style={{
                              marginLeft: -12,
                            }}
                          >
                            <IconButton color={"primary"}>
                              <Link
                                href={`#app/user/${row.user_id}/edit`}
                                color="#fff"
                              >
                                <CreateIcon />
                              </Link>
                            </IconButton>
                            <IconButton color={"primary"}>
                              <Link
                                href={`#app/user/${row.user_id}`}
                                color="#fff"
                              >
                                <HelpIcon />
                              </Link>
                            </IconButton>
                            <IconButton
                              onClick={() => openModal(row.user_id)}
                              color={"primary"}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>

                        <TableCell align="center">
                          <Avatar
                            alt={fio}
                            src={`${config.baseURLApi}/users/photo/${row.user_id}`}
                            style={{
                              marginRight: 15,
                            }}
                          />
                        </TableCell>
                        <TableCell align="left">
                          <Box
                            display={"flex"}
                            alignItems={"center"}
                            flexDirection="column"
                          >
                            <Box>
                              <Chip
                                color=""
                                label={
                                  row.activation_state != null
                                    ? "active"
                                    : "inactive"
                                }
                                style={{
                                  color: "#fff",
                                  height: 16,
                                  backgroundColor:
                                    row.activation_state != null
                                      ? "#3CD4A0"
                                      : "#FF5C93",
                                  fontSize: 11,
                                  fontWeight: "bold",
                                }}
                              />
                            </Box>
                            <Box>
                              <Typography variant={"body2"} block={true}>
                                {row.username}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Typography variant={"body2"}>{fio}</Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography variant={"body2"}>
                            {row.notify_email}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography variant={"body2"}>
                            {row.gender}
                          </Typography>
                        </TableCell>

                        <TableCell align="right">
                          <Typography variant={"body2"}>
                            {moment(row.birth_date).format("DD.MM.YYYY")}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant={"body2"}>
                            {moment(row.cdate).format("DD.MM.YYYY")}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={usersRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Widget>
      </Grid>
    </Grid>
  );
};

export default UserList;
