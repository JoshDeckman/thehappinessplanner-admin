import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import clsx from 'clsx';

import { lighten, makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import DialogContent from "@material-ui/core/DialogContent";

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from '@material-ui/icons/Delete';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const headCells = [
  { id: 'tagName', numeric: false, disablePadding: true, label: 'Tag Name' },
  { id: 'workshops', numeric: false, disablePadding: true, label: 'Workshops' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
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
            inputProps={{ 'aria-label': 'select all tags' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'left'}
            className="table-header-text"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    minHeight: 0
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
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
          ({numSelected}) Tag(s) Selected
        </Typography>
      ) : null}

      {numSelected === 1? (
        <>
          <Tooltip title="Edit">
            <IconButton aria-label="edit" onClick={props.handleClickOpen}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </>
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
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function TagsTable({ tagList, workshopList, handleError, firebase, requiredError, handleRequiredError }) {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [selected, setSelected] = useState([]);
  const [editTagName, setEditTagName] = useState("");
  const [page, setPage] = useState(0);
  const [dense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editTagOpen, setEditTagOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const tagNames = Object.keys(tagList);

  const handleEditTag = () => {
    setIsLoading(true);
    const selectedTagRef = firebase.database().ref(`tags/${selected[0]}/`);
    const updatedTagRef = firebase.database().ref(`tags/${editTagName}/`);

    if (selected[0] === editTagName) {
      // Tag Name is the same, do not allow edit
      handleRequiredError("Please enter a new tag name");
      setIsLoading(false);
    } else {
      selectedTagRef.once('value').then((snapshot) => {
        const tagData = snapshot.val();
  
        // Copy data to node with updated name
        updatedTagRef.update(tagData).then(() => {
          // Remove previous node
          selectedTagRef.remove().then(() => {
            setIsLoading(false);
            setSelected([]);
            setEditTagOpen(false);
          })
          .catch(err => {
            setIsLoading(false);
            setSelected([]);
            setEditTagOpen(false);
            handleError("Tag could not be edited. Please try again.");
          });
        })
        .catch(err => {
          setIsLoading(false);
          setSelected([]);
          setEditTagOpen(false);
          handleError("Tag could not be edited. Please try again.");
        });
      });  
    }
  };

  const tagRecord = (e) => {
    console.log(e.target.value);
    setEditTagName(e.target.value);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = tagNames.map((n) => n);
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
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleClickOpen = () => {
    if (selected.length === 1) {
      setEditTagName(selected[0]);
      setEditTagOpen(true);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleDelete = () => {
    setIsLoading(true);
    
    const deleteTagPromises = [];

    selected.forEach(selectedTagName => {
      let workshopTagRef = firebase.database().ref(`tags/${selectedTagName}/`);
      deleteTagPromises.push(workshopTagRef.remove());
    });

    Promise.all(deleteTagPromises).then(() => {
      setIsLoading(false);
      setSelected([]);
      closeAskforDelete();
    })
    .catch(err => {
      setIsLoading(false);
      setSelected([]);
      closeAskforDelete();
      handleError("Tag(s) could not be removed. Please try again.");
    });
  }

  const askToDelete = () => {
    setConfirmOpen(true);
  }

  const closeAskforDelete = () => {
    setConfirmOpen(false);
  }

  const closeEditTagOpen = () => {
    setEditTagName('');
    setSelected([]);
    setEditTagOpen(false);
  };

  const getWorkshops = tagName => {
    const tagData = tagList[tagName];
    let workshopTitles = "";

    if (tagData.workshops) {
      const workshopIds = Object.keys(tagData.workshops);
  
      workshopIds.forEach((workshopId, index) => {
        const workshopData = workshopList.find(workshopData => workshopData.id === workshopId);
  
        if (workshopData) {
          if (index < workshopIds.length - 1) {
            workshopTitles += `${workshopData.title}, `
          } else {
            workshopTitles += workshopData.title;
          }
        }
      });
    }
    
    return workshopTitles;
  };

  return (
    <div className={classes.root}>

      <Dialog open={confirmOpen} onClose={isLoading? null: closeAskforDelete} aria-labelledby="delete-tag-dialog" className="workshop-dialog">
        <DialogTitle id="form-dialog-title">{isLoading? `(${selected.length}) tags being deleted...`: `(${selected.length}) tags to be deleted`}</DialogTitle>
        <DialogActions>
          <Button onClick={closeAskforDelete} disabled={isLoading} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} disabled={isLoading} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editTagOpen} onClose={isLoading? null: closeEditTagOpen} aria-labelledby="edit-tag-dialog" className="workshop-dialog">
        <DialogTitle id="form-dialog-title">{isLoading? `(${selected.length}) editing tag...`: `Edit Tag`}</DialogTitle>
        <DialogContent className="workshop-dialog-form">
          <TextField
            autoFocus
            margin="dense"
            id="edit-tag"
            disabled={isLoading}
            label="Edit Tag"
            className="workshop-title"
            type="tag name"
            onChange={tagRecord}
            value={editTagName}
            fullWidth
            required
            error={requiredError && !editTagName}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditTagOpen} disabled={isLoading} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditTag} disabled={isLoading} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} askToDelete={askToDelete} handleClickOpen={handleClickOpen} />
        <TableContainer>
          <Table
            stickyHeader
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={tagNames.length}
            />
            <TableBody>
              {stableSort(tagNames, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={`${row.id}-${index}`}
                      selected={isItemSelected}
                    >
                    <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" align="left">{row}</TableCell>
                      <TableCell align="left">{getWorkshops(row)}</TableCell>
                    </TableRow>
                  );
                })}
             
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={tagNames.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}