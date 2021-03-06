import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import { lighten, makeStyles } from "@material-ui/core/styles";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

import DeleteIcon from "@material-ui/icons/Delete";

const ReactMarkdown = require('react-markdown/with-html');

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
  { id: "title", numeric: false, disablePadding: false, label: "Tag Name" },
  { id: "newTitle", numeric: false, disablePadding: false, label: "Title" },
  { id: "leader", numeric: false, disablePadding: false, label: "Leader" },
  { id: "url", numeric: false, disablePadding: false, label: "URL" },
  { id: "days", numeric: false, disablePadding: false, label: "Days" },
  { id: "text", numeric: false, disablePadding: false, label: "Description" },
  { id: "colors", numeric: false, disablePadding: false, label: "Colors" },
];

function EnhancedTableHead(props) {
  const {
    classes,
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
            inputProps={{ "aria-label": "select all workshops" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"left"}
            className="table-header-text"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id === "colors" || headCell.id === "days"? 
              <div>
                {headCell.label}
              </div>:
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            }
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    minHeight: 0,
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          ({numSelected}) Workshop(s) Selected
        </Typography>
      ) : null}

      {numSelected > 0 ? (
        <>
          <Tooltip title="Delete">
            <IconButton aria-label="delete" onClick={props.askToDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : null}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

export default function RemovedWorkshopsTable({ workshopList, handleError, firebase, truncate, hasError, setError }) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [isLoading, setIsLoading] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const handleClose = () => {
    setConfirmOpen(false);
    setSelected([]); 
    setError(false);     
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = workshopList.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleDelete = () => {
    setIsLoading(true);
    const deleteWorkshopPromises = [];

    selected.forEach(workshopKey => {
      var workshopRef = firebase.database().ref(`workshops/${workshopKey}`);
      deleteWorkshopPromises.push(workshopRef.remove());
    });

    Promise.all(deleteWorkshopPromises)
      .then(() => {
        console.log("Workshop(s) deleted successfully.");
        setIsLoading(false);
        handleClose();
      }).catch((error) => {
        setIsLoading(false);
        handleError("Workshop(s) could not be deleted. Please try again.");
        handleClose();
      });
  };

  const askToDelete = () => {
    setConfirmOpen(true);
  };

  const closeAskforDelete = () => {
    setConfirmOpen(false);
  };

  const parseMarkdown = markdownText => {
    return (
      <ReactMarkdown 
        source={markdownText}
        escapeHTML={false}
      />
    );
  };

  const parseDays = days => {
    let dateStr = "";
    days.forEach((day, index) => {
      let convertedLocalDate = new Date(day.date);
      let parsedLocalDate = convertedLocalDate.toDateString() + " @ " + convertedLocalDate.toLocaleTimeString();

      if (index > 0) {
        dateStr += `, ${parsedLocalDate}`;
      } else {
        dateStr += parsedLocalDate;
      }
    });

    return dateStr;
  };

  const parseColors = (colors) => {
    let colorStr = "";

    if (colors) {
      colorStr += "Background: " + colors.background + ", ";
      colorStr += "Photo Shadow: " + colors.boxShadow + ", ";
      colorStr += "Photo Flag: " + colors.flag + ", ";
      colorStr += "Workshop Info: " + colors.info;
    }

    return colorStr;
  };

  return (
    <div className={classes.root}>
      <Dialog
        open={confirmOpen}
        onClose={isLoading ? null : closeAskforDelete}
        aria-labelledby="delete-workshop-dialog"
        className="workshop-dialog"
      >
        <DialogTitle id="delete-workshop-dialog-title">
          {isLoading
            ? `(${selected.length}) workshop(s) being deleted...`
            : `(${selected.length}) workshop(s) to be deleted.`}
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={closeAskforDelete}
            disabled={isLoading}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} disabled={isLoading} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          askToDelete={askToDelete}
        />
        <TableContainer>
          <Table
            stickyHeader
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={workshopList.length}
            />
            <TableBody>
              {stableSort(workshopList, getComparator(order, orderBy))
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
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        align="left"
                        className="workshop-table-cell"
                      >
                        {row.title}
                      </TableCell>
                      <TableCell
                        component="th"
                        align="left"
                        className="workshop-table-cell"
                      >
                        {row.newTitle? row.newTitle: row.title}
                      </TableCell>
                      <TableCell align="left" className="workshop-table-cell">
                        {row.leader}
                      </TableCell>
                      <TableCell align="left" className="workshop-table-cell">
                        {" "}
                        {row.url}
                      </TableCell>
                      <TableCell align="left" className="workshop-table-cell">
                        {parseDays(row.days)}
                      </TableCell>
                      <TableCell align="left" className="workshop-table-cell">
                        {parseMarkdown(row.shortInfo)}
                      </TableCell>
                      <TableCell align="left" className="workshop-table-cell">
                        {parseColors(row.colors)}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          labelRowsPerPage="Results"
          count={workshopList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
