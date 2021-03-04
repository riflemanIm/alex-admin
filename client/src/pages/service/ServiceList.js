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
import Widget from "../../components/Widget";
import { Button } from "../../components/Wrappers";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import Notification from "../../components/Notification/Notification";
import { toast } from "react-toastify";

import { Typography, Link } from "../../components/Wrappers";
import {
  useServiceDispatch,
  useServiceState,
} from "../../context/ServiceContext";

import useStyles from "./styles";
// Icons
import {
  Add as AddIcon,
  Search as SearchIcon,
  CreateOutlined as CreateIcon,
} from "@material-ui/icons";

import { actions } from "../../context/ServiceContext";
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
  { id: "id", alignRight: false, disablePadding: false, label: "ID" },
  { id: "actions", alignRight: false, disablePadding: false, label: "Дествия" },
  {
    id: "label",
    alignRight: false,
    disablePadding: false,
    label: "Название(Label)",
  },
  { id: "state", alignRight: false, disablePadding: false, label: "Статус" },
  { id: "address", alignRight: false, disablePadding: false, label: "Адрес" },
  {
    id: "file_server_address",
    alignRight: false,
    disablePadding: false,
    label: "Адрес сервера",
  },
  {
    id: "file_server_binding_name",
    alignRight: false,
    disablePadding: false,
    label: "Имя сборки",
  },
  {
    id: "lastCheck",
    alignRight: true,
    disablePadding: false,
    label: "Проверка была",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? "right" : "left"}
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

const ServiceList = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const serviceRowsPerPage = localStorage.getItem("serviceRowsPerPage");

  const [rowsPerPage, setRowsPerPage] = React.useState(
    serviceRowsPerPage != null ? parseInt(serviceRowsPerPage, 10) : 5
  );
  const [servicesRows, setServicesRows] = React.useState([]);

  const serviceDispatch = useServiceDispatch();
  const serviceValue = useServiceState();
  const openModal = (cell) => {
    actions.doOpenConfirm(cell)(serviceDispatch);
  };

  const closeModal = () => {
    actions.doCloseConfirm()(serviceDispatch);
  };

  const handleDelete = () => {
    actions.doDelete(serviceValue.idToDelete)(serviceDispatch);
    sendNotification("Запись удалена");
  };

  React.useEffect(() => {
    async function fetchAPI() {
      try {
        await actions.doFetch({}, false)(serviceDispatch);
        //setServicesRows(serviceValue.rows);
      } catch (e) {
        console.log(e);
      }
    }
    fetchAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  React.useEffect(() => {
    setServicesRows(serviceValue.rows);
  }, [serviceValue.rows]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = serviceValue.rows.map((n) => n.id);
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
    const rowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(rowsPerPage);
    localStorage.setItem("serviceRowsPerPage", rowsPerPage);
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, servicesRows.length - page * rowsPerPage);

  const handleSearch = (e) => {
    const newArr = serviceValue.rows.filter((c) => {
      return c.label
        .toLowerCase()
        .includes(e.currentTarget.value.toLowerCase());
    });

    setServicesRows(newArr);
  };

  return (
    <Grid container spacing={3}>
      <Dialog
        open={serviceValue.modalOpen}
        onClose={closeModal}
        scroll={"body"}
        aria-labelledby="scroll-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          Вы уверены что хотите удалить?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Запись будет удалена
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary">
            Отмена
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Применить
          </Button>
        </DialogActions>
      </Dialog>
      <Grid item xs={12}>
        <Widget inheritHeight>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <Link href="#/app/service/add" underline="none" color="#fff">
                <Button variant={"contained"} color={"success"}>
                  <Box mr={1} display={"flex"}>
                    <AddIcon />
                  </Box>
                  Добавить
                </Button>
              </Link>
            </Grid>
            <Grid item md={6} xs={12}>
              <Input
                id="search-field"
                label="Поиск по названию"
                margin="dense"
                fullWidth
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
            </Grid>
          </Grid>
        </Widget>
      </Grid>
      <Grid item xs={12}>
        <Widget inheritHeight noBodyPadding>
          <TableContainer>
            <Table aria-labelledby="tableTitle" aria-label="enhanced table">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={servicesRows.length}
              />
              <TableBody>
                {stableSort(servicesRows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell component="th" id={labelId} scope="row">
                          <Typography variant={"body2"}>{row.id}</Typography>
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
                                href={`#app/service/${row.id}/edit`}
                                color="#fff"
                              >
                                <CreateIcon />
                              </Link>
                            </IconButton>

                            <IconButton
                              onClick={() => openModal(row.id)}
                              color={"primary"}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>

                        {headCells.map(
                          (item, inx) =>
                            inx > 1 && (
                              <TableCell align="left" key={item.id}>
                                {["lastCheck"].includes(item.id) ? (
                                  moment(row[item.id]).format("DD.MM.YYYY")
                                ) : (
                                  <Typography variant={"body2"} block={true}>
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
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={servicesRows.length}
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

export default ServiceList;
