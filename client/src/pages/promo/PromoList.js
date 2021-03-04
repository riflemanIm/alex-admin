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
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import Notification from "../../components/Notification/Notification";
import { toast } from "react-toastify";

import { Typography, Link } from "../../components/Wrappers/Wrappers";
import { usePromoDispatch, usePromoState } from "../../context/PromoContext";

import useStyles from "./styles";
// Icons
import {
  Add as AddIcon,
  Search as SearchIcon,
  CreateOutlined as CreateIcon,
} from "@material-ui/icons";

import { actions } from "../../context/PromoContext";
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
    id: "medicalnet_actions_id",
    numeric: false,
    disablePadding: false,
    label: "ID",
  },
  { id: "actions", numeric: false, disablePadding: false, label: "Дествия" },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Промо",
  },
  {
    id: "action_text",
    numeric: false,
    disablePadding: false,
    label: "Детали",
  },

  { id: "url", numeric: false, disablePadding: false, label: "URL" },
  { id: "date_from", numeric: false, disablePadding: false, label: "С" },
  { id: "date_to", numeric: false, disablePadding: false, label: "По" },
  {
    id: "sort_order",
    numeric: false,
    disablePadding: false,
    label: "Сортировка",
  },
  { id: "image", numeric: false, disablePadding: false, label: "Картинка" },
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

const PromoList = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);

  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [promosRows, setPromosRows] = React.useState([]);

  const promoDispatch = usePromoDispatch();
  const promoValue = usePromoState();
  const openModal = (cell) => {
    actions.doOpenConfirm(cell)(promoDispatch);
  };

  const closeModal = () => {
    actions.doCloseConfirm()(promoDispatch);
  };

  const handleDelete = () => {
    actions.doDelete(promoValue.idToDelete)(promoDispatch);
    sendNotification("Промо удалена");
  };

  React.useEffect(() => {
    async function fetchAPI() {
      try {
        await actions.doFetch({}, false)(promoDispatch);
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
    setPromosRows(promoValue.rows);
  }, [promoValue.rows]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = promoValue.rows.map((n) => n.id);
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
    rowsPerPage - Math.min(rowsPerPage, promosRows.length - page * rowsPerPage);

  const handleSearch = (e) => {
    const newArr = promoValue.rows.filter((c) => {
      return `${c.action_text}${c.description}`
        .toLowerCase()
        .includes(e.currentTarget.value.toLowerCase());
    });

    setPromosRows(newArr);
  };

  return (
    <Grid container spacing={3}>
      <Dialog
        open={promoValue.modalOpen}
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
          <Box
            justifyContent={"space-between"}
            display={"flex"}
            alignItems={"flex-start"}
          >
            <Box>
              <Link href="#/app/promo/add" underline="none" color="#fff">
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
              <Input
                id="search-field"
                label="Поиск"
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
            <Table aria-labelledby="tableTitle" aria-label="enhanced table">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={promosRows.length}
              />
              <TableBody>
                {stableSort(promosRows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(
                      row.medicalnet_actions_id
                    );
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={(event) =>
                          handleClick(event, row.medicalnet_actions_id)
                        }
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.medicalnet_actions_id}
                        selected={isItemSelected}
                      >
                        <TableCell component="th" id={labelId} scope="row">
                          <Typography variant={"body2"}>
                            {row.medicalnet_actions_id}
                          </Typography>
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
                                href={`#app/promo/${row.medicalnet_actions_id}/edit`}
                                color="#fff"
                              >
                                <CreateIcon />
                              </Link>
                            </IconButton>

                            <IconButton
                              onClick={() =>
                                openModal(row.medicalnet_actions_id)
                              }
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
                                {["date_from", "date_to"].includes(item.id) ? (
                                  moment(row[item.id]).format("DD.MM.YYYY")
                                ) : item.id === "image" ? (
                                  <img
                                    src={`data:image/jpeg;base64, ${
                                      row[item.id]
                                    }`}
                                    alt="Alt"
                                  />
                                ) : ["description", "action_text"].includes(
                                    item.id
                                  ) ? (
                                  row[item.id].length > 100 ? (
                                    `${row[item.id].slice(0, 100)}...`
                                  ) : (
                                    row[item.id]
                                  )
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
            count={promosRows.length}
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

export default PromoList;
