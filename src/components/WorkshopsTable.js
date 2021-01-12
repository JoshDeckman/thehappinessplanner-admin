import React from 'react';

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
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
  { id: 'title', numeric: false, disablePadding: true, label: 'タイトル' },
  { id: 'status', numeric: false, disablePadding: false, label: 'ステータス' },
  { id: 'price', numeric: true, disablePadding: false, label: '一人当りの価格' },
  { id: 'childPrice', numeric: true, disablePadding: false, label: '子供料金' },
  { id: 'minGroup', numeric: true, disablePadding: false, label: '最低催行人員' },
  { id: 'maxGroup', numeric: true, disablePadding: false, label: '最大催行人員' },
  { id: 'address', numeric: false, disablePadding: false, label: '住所' },
  { id: 'user', numeric: false, disablePadding: false, label: '名前' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Eメール' },
  { id: 'phone', numeric: false, disablePadding: false, label: '電話番号' },
];

const toASCII = (chars) => {
  var ascii = '';
    for(var i=0, l=chars.length; i<l; i++) {
        var c = chars[i].charCodeAt(0);

        // make sure we only convert half-full width char
        if (c >= 0xFF00 && c <= 0xFFEF) {
           c = 0xFF & (c + 0x20);
        }

        ascii += String.fromCharCode(c);
    }

    return ascii;
};


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
            inputProps={{ 'aria-label': 'select all desserts' }}
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
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          ({numSelected})Workshop
        </Typography>
      ) : (null
      )}

      {numSelected > 0 ? (
        <>
        <Tooltip title="Edit">
          <IconButton aria-label="edit" onClick={props.handleClickOpen}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton aria-label="delete" onClick={props.askToDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        </>
      ) :null}
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

export default function UsersTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [isLoading, setIsLoading] = React.useState(false);
  const [tourEditFormInfo, setTourEditFormInfo] = React.useState(null);
  const [isGroupEdit, setIsGroupEdit] = React.useState(false);
  const [groupEditInfo, setGroupEditInfo] = React.useState({status: "pending"});
  const [open, setOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const handleClickOpen = () => {
    if(selected.length > 1) {
      setIsGroupEdit(true);
      setGroupEditInfo({status: "pending"});
      setOpen(true);
    } else {
      setIsGroupEdit(false);
      var findSelected = props.tourList.find((tour) => tour.id === selected[0]);
      setTourEditFormInfo(findSelected);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = props.tourList.map((n) => n.id);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const updateWorkshop = () => {
    setIsLoading(true);
    //TODO: Update Workshop Function
  }

  const handleDelete = () => {
    setIsLoading(true);
    //TODO: Handle Workshop Delete
  };

  const signupRecord = (e) => {
    var updateVal = e.target.value;
    var updateKey = e.target.id;
    setTourEditFormInfo(prevFormInfo => ({
      ...prevFormInfo,
      [`${updateKey}`]: updateVal
    }));
  };

  const updateStatusGroup = (e) => {
    var updateVal = e.target.value;
    setGroupEditInfo({status: updateVal})
  };

   const updateStatus = (e) => {
    var updateVal = e.target.value;
     setTourEditFormInfo(prevFormInfo => ({
      ...prevFormInfo,
      status: updateVal
    }));
  };

  const askToDelete = () => {
    setConfirmOpen(true);
  };

  const closeAskforDelete = () => {
    setConfirmOpen(false);
  };

  return (
    <div className={classes.root}>
      <Dialog open={confirmOpen} onClose={isLoading? null: closeAskforDelete} aria-labelledby="form-dialog-title" className="edit-tour-dialog">
        <DialogTitle id="form-dialog-title">{isLoading? `(${selected.length})件のツアーを削除中`: `(${selected.length})件のツアーを削除`}</DialogTitle>
        <DialogActions>
          <Button onClick={closeAskforDelete} disabled={isLoading} color="primary">
            キャンセル
          </Button>
          <Button onClick={handleDelete} disabled={isLoading} color="primary">
            削除
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={isLoading? null: handleClose} aria-labelledby="form-dialog-title" className="edit-tour-dialog">
        <DialogTitle id="form-dialog-title">{isLoading? `(${selected.length})件のツアーをアップデート中`: `(${selected.length})件のツアーを編集`}</DialogTitle>
        {isGroupEdit?
          <DialogContent className="edit-dialog-form">
          <FormControl variant="outlined" className="edit-status-from">
            <InputLabel id="status-label">ステータス</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              className="status-dropdown"
              value={groupEditInfo.status? groupEditInfo.status: "pending"}
              disabled={isLoading}
              onChange={updateStatusGroup}
              label={"Status"}
            >
              <MenuItem
                value={"pending"}
                key={'status-1'}
              >
                Pending
              </MenuItem>
               <MenuItem
                value={"draft"}
                key={'status-2'}
              >
                Draft
              </MenuItem>
               <MenuItem
                value={"live"}
                key={'status-3'}
              >
                Live
              </MenuItem>
            </Select>
          </FormControl>
          </DialogContent>:null
        }

        {tourEditFormInfo && !isGroupEdit?
          <DialogContent className="edit-dialog-form">

          <TextField
            autoFocus
            margin="dense"
            id="title"
            disabled={isLoading}
            label="ツアータイトル"
            className="edit-title-from"
            type="title"
            onChange={signupRecord}
            value={decodeURIComponent(tourEditFormInfo.title)}
            fullWidth
          />
          <TextField
            id="description"
            label={"ツアー詳細"}
            multiline
            className="edit-description-from"
            disabled={isLoading}
            rows={10}
            fullWidth={true}
            onChange={signupRecord}
            variant="outlined"
            value={
              tourEditFormInfo.description ? decodeURIComponent(tourEditFormInfo.description) : ""
            }
          />

          <FormControl variant="outlined" className="edit-status-from">
              <InputLabel id="status-label">ステータス</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                className="status-dropdown"
                value={`${tourEditFormInfo.status? tourEditFormInfo.status: ""}`}
                disabled={isLoading}
                onChange={updateStatus}
                label={"Status"}
              >
                <MenuItem
                  value={"pending"}
                  key={'status-1'}
                >
                  Pending
                </MenuItem>
                 <MenuItem
                  value={"draft"}
                  key={'status-2'}
                >
                  Draft
                </MenuItem>
                 <MenuItem
                  value={"live"}
                  key={'status-3'}
                >
                  Live
                </MenuItem>
              </Select>
            </FormControl>
        </DialogContent>:null
        }
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading} color="primary">
            Cancel
          </Button>
          <Button onClick={updateWorkshop} disabled={isLoading} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} handleClickOpen={handleClickOpen} askToDelete={askToDelete}/>
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
              rowCount={props.tourList.length}
            />
            <TableBody>
              {stableSort(props.tourList, getComparator(order, orderBy))
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
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" align="left">{decodeURIComponent(row.title)}</TableCell>
                      <TableCell align="left">{row.status}</TableCell>
                      <TableCell align="left">
                        ¥{numberWithCommas(toASCII(row.price))}
                      </TableCell>
                      <TableCell align="left">
                        {row.childPrice && parseInt(row.childPrice)?
                          `¥${numberWithCommas(toASCII(row.childPrice))}`:"なし"
                        }
                      </TableCell>
                      <TableCell align="left">{row.minGroup}</TableCell>
                      <TableCell align="left">{row.maxGroup}</TableCell>
                      <TableCell align="left">{`
                        ${row.address && row.address.postal? row.address.postal:""}
                        ${row.address && row.address.prefecture? row.address.prefecture:""}
                        ${row.address && row.address.city? row.address.city:""}
                        ${row.address && row.address.address? row.address.address:""}`}
                      </TableCell>
                      <TableCell align="left">{`${row.user.lastName} ${row.user.firstName}`}</TableCell>
                      <TableCell align="left">{row.user.email}</TableCell>
                      <TableCell align="left">{row.user.phoneNumber}</TableCell>
                    </TableRow>
                  );
                })}
             
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          labelRowsPerPage="表示件数"
          count={props.tourList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}