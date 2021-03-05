import React from "react";
import {
  Grid,
  Box,
  InputAdornment,
  // Dialog,
  // DialogActions,
  // DialogContent,
  // DialogContentText,
  // DialogTitle,
  TextField as Input,
} from "@material-ui/core";
import Widget from "../../components/Widget/Widget";
//import { Button } from "../../components/Wrappers/Wrappers";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import CircularProgress from "@material-ui/core/CircularProgress";

import IconButton from "@material-ui/core/IconButton";
// import Notification from "../../components/Notification/Notification";
// import { toast } from "react-toastify";

import { Typography, Link } from "../../components/Wrappers/Wrappers";
import { useAlexDispatch, useAlexState } from "../../context/AlexContext";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import useStyles from "./styles";
// Icons
import {
  //  Add as AddIcon,
  Search as SearchIcon,
  CalendarTodayOutlined as CalendarIcon,
} from "@material-ui/icons";

import { actions } from "../../context/AlexContext";
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
  {
    id: "username",
    alignRight: false,
    disablePadding: false,
    label: "username",
  },
  { id: "actions", alignRight: false, disablePadding: false, label: "Дествия" },
  {
    id: "homedir",
    alignRight: false,
    disablePadding: false,
    label: "homedir",
  },
  {
    id: "folders",
    alignRight: false,
    disablePadding: false,
    label: "folders",
  },
  {
    id: "lastChangeDate",
    alignRight: false,
    disablePadding: false,
    label: "lastChangeDate",
  },
  {
    id: "expiryDate",
    alignRight: false,
    disablePadding: false,
    label: "expiryDate",
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

const UserList = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const alexRowsPerPage = localStorage.getItem("alexRowsPerPage");

  const [rowsPerPage, setRowsPerPage] = React.useState(
    alexRowsPerPage != null ? parseInt(alexRowsPerPage, 10) : 5
  );
  const [alexsRows, setAlexsRows] = React.useState([]);

  const alexDispatch = useAlexDispatch();
  const alexValue = useAlexState();
  // const openModal = (cell) => {
  //   actions.doOpenConfirm(cell)(alexDispatch);
  // };

  // const closeModal = () => {
  //   actions.doCloseConfirm()(alexDispatch);
  // };

  // const handleDelete = () => {
  //   actions.doDelete(alexValue.idToDelete)(alexDispatch);
  //   sendNotification("Запись удалена");
  // };

  React.useEffect(() => {
    async function fetchAPI() {
      try {
        await actions.doFetch({}, false)(alexDispatch);
        //setAlexsRows(alexValue.rows);
      } catch (e) {
        console.log(e);
      }
    }
    fetchAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classes = useStyles();

  // function sendNotification(text) {
  //   const componentProps = {
  //     type: "feedback",
  //     message: text,
  //     variant: "contained",
  //     color: "success",
  //   };
  //   const options = {
  //     type: "info",
  //     position: toast.POSITION.TOP_RIGHT,
  //     progressClassName: classes.progress,
  //     className: classes.notification,
  //     timeOut: 1000,
  //   };
  //   return toast(
  //     <Notification
  //       {...componentProps}
  //       className={classes.notificationComponent}
  //     />,
  //     options
  //   );
  // }

  React.useEffect(() => {
    setAlexsRows(alexValue.rows);
  }, [alexValue.rows]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = alexValue.rows.map((n) => n.id);
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
    localStorage.setItem("alexRowsPerPage", rowsPerPage);
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, alexsRows.length - page * rowsPerPage);

  const handleSearch = (e) => {
    const newArr = alexValue.rows.filter((c) => {
      return c.username
        .toLowerCase()
        .includes(e.currentTarget.value.toLowerCase());
    });

    setAlexsRows(newArr);
  };
  const Loading = () => (
    <Grid container justify="center" alignItems="center">
      <CircularProgress size={26} />
    </Grid>
  );

  return alexValue.loading ? (
    <Loading />
  ) : (
    <Grid container spacing={3}>
      {/* <Dialog
        open={alexValue.modalOpen}
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
      </Dialog>*/}
      <Grid item xs={12}>
        <Widget inheritHeight>
          <Grid container spacing={2}>
            {/* <Grid item md={6} xs={12}>
              <Link href="#/app/alex/add" underline="none" color="#fff">
                <Button variant={"contained"} color={"success"}>
                  <Box mr={1} display={"flex"}>
                    <AddIcon />
                  </Box>
                  Добавить
                </Button>
              </Link>
            </Grid> */}
            <Grid item md={6} xs={12}>
              <Input
                id="search-field"
                label="Поиск по username"
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
                rowCount={alexsRows.length}
              />
              <TableBody>
                {stableSort(alexsRows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.username);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.username)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.username}
                        selected={isItemSelected}
                      >
                        <TableCell component="th" id={labelId} scope="row">
                          <Typography variant={"body2"}>
                            {row.username}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Box
                            display={"flex"}
                            style={{
                              marginLeft: -12,
                            }}
                          >
                            <IconButton
                              color={"primary"}
                              title="change-expiry-date"
                            >
                              <Link
                                href={`#app/alex/${row.username}/change-expiry-date`}
                                color="#fff"
                              >
                                <CalendarIcon />
                              </Link>
                            </IconButton>

                            {/* <IconButton
                              onClick={() => openModal(row.username)}
                              color={"primary"}
                            >
                              <DeleteIcon />
                            </IconButton> */}
                          </Box>
                        </TableCell>

                        {headCells.map(
                          (item, inx) =>
                            inx > 1 && (
                              <TableCell align="left" key={item.id}>
                                {["expiryDate", "lastChangeDate"].includes(
                                  item.id
                                ) ? (
                                  moment(row[item.id]).format("DD.MM.YYYY")
                                ) : item.id === "folders" ? (
                                  <Accordion>
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                      aria-controls="panel1a-content"
                                      id="panel1a-header"
                                    >
                                      <Typography className={classes.heading}>
                                        {row["total"]}
                                      </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      <pre>{row[item.id]}</pre>
                                    </AccordionDetails>
                                  </Accordion>
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
            count={alexsRows.length}
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
