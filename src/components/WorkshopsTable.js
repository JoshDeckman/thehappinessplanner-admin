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
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import InputAdornment from '@material-ui/core/InputAdornment';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import RemoveIcon from '@material-ui/icons/HighlightOff';

import CameraIcon from '../images/camera.svg';

import MarkdownEditor from "./MarkdownEditor";
import ColorPicker from 'material-ui-color-picker';

import Dropzone from 'react-dropzone';

const ReactMarkdown = require('react-markdown/with-html');

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box"
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden"
};

const img = {
  display: "block",
  height: "100%",
  width: "100%,"
};

const workshopColorKeys = ["background", "boxShadow", "flag", "info"];

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
            inputProps={{ "aria-label": "select all desserts" }}
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

export default function WorkshopsTable({ workshopList, handleError, firebase, truncate, addWorkshopOpen, setAddWorkshopOpen, hasError, setError }) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [isLoading, setIsLoading] = React.useState(false);
  const [editWorkshopOpen, setEditWorkshopOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [workshopFormInfo, setWorkshopFormInfo] = React.useState({});
  const [photo, setPhotoPreview] = React.useState(null);
  const [file, setFile] = React.useState(null);

  const handleClickOpen = () => {
    if (selected.length === 1) {
      var findSelected = workshopList.find((workshop) => workshop.id === selected[0]);
      setWorkshopFormInfo(findSelected);
      setEditWorkshopOpen(true);
    }
  };

  const handleClose = () => {
    if (addWorkshopOpen) {
      setAddWorkshopOpen(false);
    } else if (editWorkshopOpen) {
      setEditWorkshopOpen(false);
    } else if (confirmOpen) {
      setConfirmOpen(false);
    }
    
    setWorkshopFormInfo({});
    setSelected([]); 
    setPhotoPreview(null);
    setFile(null);
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

  const updateWorkshop = () => {
    setIsLoading(true);

    var workshopRef = firebase.database().ref(`workshops/${selected[0]}`);

    if (file) {
      const storageRef = firebase.storage().ref();
      const storageWorkshopRef = storageRef.child(`workshops/${selected[0]}/image.jpg`);

      storageWorkshopRef
        .put(file)
        .then((snapshot) => {
          workshopRef
            .child(selected[0])
            .update({
              newTitle: workshopFormInfo.newTitle? workshopFormInfo.newTitle: "",
              leader: workshopFormInfo.leader,
              days: workshopFormInfo.days,
              text: workshopFormInfo.text,
              colors: workshopFormInfo.colors,
            })
            .then(() => {
              setIsLoading(false);
              handleClose();
            })
            .catch((error) => {
              setIsLoading(false);
              handleClose();
              handleError("Workshop could not be updated. Please try again.");
            });
        })
        .catch(error => {
          handleError("Workshop could not be updated. Please try again.");
          setIsLoading(false);
          handleClose();
        });
    } else {
      workshopRef
        .update({ 
          newTitle: workshopFormInfo.newTitle? workshopFormInfo.newTitle: "",
          leader: workshopFormInfo.leader,
          days: workshopFormInfo.days,
          text: workshopFormInfo.text,
          colors: workshopFormInfo.colors
        })
        .then(() => {
          setIsLoading(false);
          handleClose();
        })
        .catch((error) => {
          setIsLoading(false);
          handleClose();
          handleError("Workshop could not be updated. Please try again.");
        });
    }
  };

  const addWorkshop = () => {
    setIsLoading(true);

    const requiredFields = 
      workshopFormInfo.colors && workshopFormInfo.days && workshopFormInfo.leader && 
      workshopFormInfo.text && workshopFormInfo.title && workshopFormInfo.url && 
      file;
    
    if (requiredFields) {
      const workshopRef = firebase.database().ref("workshops/");

      const newWorkshopRef = workshopRef.push();
      const newWorkshopKey = newWorkshopRef.key;
  
      const storageRef = firebase.storage().ref();
      const storageWorkshopRef = storageRef.child(`workshops/${newWorkshopKey}/image.jpg`);

      storageWorkshopRef
        .put(file)
        .then((snapshot) => {
          workshopRef
            .child(newWorkshopKey)
            .update({
              colors: workshopFormInfo.colors,
              days: workshopFormInfo.days,
              leader: workshopFormInfo.leader,
              moreInfo: "",
              removed: "false",
              text: workshopFormInfo.text,
              title: workshopFormInfo.title,
              url: workshopFormInfo.url
            })
            .then(() => {
              setIsLoading(false);
              handleClose();
            })
            .catch((error) => {
              setIsLoading(false);
              handleClose();
              handleError("Workshop could not be added. Please try again.");
            });
        })
        .catch(error => {
          handleError("Workshop could not be added. Please try again.");
          setIsLoading(false);
          handleClose();
        });
    } else {
      handleError("Please complete the required fields");
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    setIsLoading(true);
    const deleteWorkshopPromises = [];

    selected.forEach(workshopKey => {
      var workshopRef = firebase.database().ref(`workshops/${workshopKey}`);
      deleteWorkshopPromises.push(workshopRef.update({ removed: "true" }));
    });

    Promise.all(deleteWorkshopPromises)
      .then(() => {
        console.log("Workshop(s) removed successfully.");
        setIsLoading(false);
        handleClose();
      }).catch((error) => {
        setIsLoading(false);
        handleError("Workshop(s) could not be removed. Please try again.");
        handleClose();
      });
  };

  const workshopRecord = (e) => {
    var updateVal = e.target.value;
    var updateKey = e.target.id;

    setWorkshopFormInfo(prevFormInfo => ({
      ...prevFormInfo,
      [`${updateKey}`]: updateVal
    }));
  };

  const updateDescription = (text) => {
    setWorkshopFormInfo(prevFormInfo => ({
      ...prevFormInfo,
      text
    }));
  };

  const updateDateTime = (e, day, arrIndex) => {
    const newDateTime = e.target.value;
    const date = new Date(newDateTime).toGMTString();

    if (workshopFormInfo.days) {
      setWorkshopFormInfo(prevFormInfo => ({
        ...prevFormInfo,
        days: [
          ...prevFormInfo.days.slice(0, arrIndex),
          {
            date,
            index: day.index
          },
          ...prevFormInfo.days.slice(arrIndex + 1)
        ]
      }));
    } else {
      setWorkshopFormInfo(prevFormInfo => ({
        ...prevFormInfo,
        days: [
          {
            date,
            index: 0
          }
        ]
      }));
    }
  };

  const removeDateTime = (index) => {
    setWorkshopFormInfo(prevFormInfo => ({
      ...prevFormInfo,
      days: [
        ...prevFormInfo.days.slice(0, index),
        ...prevFormInfo.days.slice(index + 1)
      ]
    }));

    console.log("wfi", workshopFormInfo)
  };

  const updateColor = (newColor, colorKey) => {
    if (newColor) {
      if (workshopFormInfo.colors) {
        setWorkshopFormInfo(prevFormInfo => ({
          ...prevFormInfo,
          colors: {
            ...prevFormInfo.colors,
            [colorKey]: newColor
          }
        }));        
      } else {
        setWorkshopFormInfo(prevFormInfo => ({
          ...prevFormInfo,
          colors: {
            [colorKey]: newColor
          }
        }));        
      }
    }
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

  const parseDateString = (date) => {   
    const year = new Date(date).getFullYear();   
    const month = ("0" + (new Date(date).getMonth() + 1)).slice(-2);
    const day = ("0" + new Date(date).getDate()).slice(-2);
    const hour = ("0" + new Date(date).getHours()).slice(-2);
    const minutes = ("0" + new Date(date).getMinutes()).slice(-2);

    const parsedDate = `${year}-${month}-${day}T${hour}:${minutes}`;

    return parsedDate;
  };

  const addWorkshopDateTime = () => {
    const date = new Date().toGMTString();
    const index = workshopFormInfo.days? workshopFormInfo.days.length : 0;

    if (workshopFormInfo.days) {
      setWorkshopFormInfo(prevFormInfo => ({
        ...prevFormInfo,
        days: [
          ...prevFormInfo.days,
          {
            date,
            index
          }
        ]
      }));
    } else {
      setWorkshopFormInfo(prevFormInfo => ({
        ...prevFormInfo,
        days: [
          {
            date,
            index
          }
        ]
      }));
    }
  };

  const onDrop = acceptedFiles => {
    const fileObj = URL.createObjectURL(acceptedFiles[0]);
    
    setPhotoPreview(fileObj);
    setFile(acceptedFiles[0]);
  };

  const titleValue = workshopFormInfo.newTitle
    ? workshopFormInfo.newTitle
    : workshopFormInfo.title;

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
            ? `(${selected.length}) workshop(s) being removed...`
            : `(${selected.length}) workshop(s) to be removed.`}
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
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add or Edit Workshop Dialog */}
      <Dialog
        open={addWorkshopOpen || editWorkshopOpen}
        onClose={isLoading ? null : handleClose}
        aria-labelledby="workshop-dialog"
        className="workshop-dialog"
      >
        <DialogTitle id="workshop-dialog-title">
          {addWorkshopOpen? "Add Workshop" : "Edit Workshop"}
        </DialogTitle>
          <DialogContent className="workshop-dialog-form">
            <TextField
              autoFocus
              margin="dense"
              id={addWorkshopOpen? "title": "newTitle"}
              disabled={isLoading}
              label={addWorkshopOpen? "Title / Tag" : "Title"}
              className="workshop-title"
              type="title"
              onChange={workshopRecord}
              value={titleValue}
              fullWidth
              required
              error={hasError && !titleValue}
            />
            <div className="input-table">
              <TextField
                autoFocus
                margin="dense"
                id="leader"
                disabled={isLoading}
                label="Leader"
                className="workshop-leader input-cell"
                onChange={workshopRecord}
                value={
                  workshopFormInfo.leader
                    ? workshopFormInfo.leader
                    : ""
                }
                required
                required
                error={hasError && !workshopFormInfo.leader}
              />
              <TextField
                autoFocus
                margin="dense"
                id="url"
                disabled={isLoading}
                label="URL"
                className="workshop-url input-cell"
                onChange={workshopRecord}
                value={
                  workshopFormInfo.url
                    ? workshopFormInfo.url
                    : ""
                }
                required
                error={hasError && !workshopFormInfo.url}
              />
              <div className="datetime-field-container">
                {workshopFormInfo.days?
                  workshopFormInfo.days.map((day, index) => (
                    <TextField
                      key={`datetime-${index}`}
                      id="days"
                      label={`Day* (Local time, GMT ${-(new Date().getTimezoneOffset() / 60)})`}
                      type="datetime-local"
                      value={parseDateString(day.date)}
                      className="workshop-days input-cell"
                      onChange={(e) => updateDateTime(e, day, index)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={index > 0? {
                        endAdornment: (
                          <InputAdornment position="end" onClick={() => removeDateTime(index)}>
                            <RemoveIcon />
                          </InputAdornment>
                        ),
                      }: {}}
                    />
                  )):
                  <TextField
                    key="datetime-0"
                    id="days"
                    label={`Day (Local time, GMT ${-(new Date().getTimezoneOffset() / 60)})`}
                    type="datetime-local"
                    className="workshop-days input-cell"
                    onChange={(e) => updateDateTime(e, { date: new Date(), index: 0 }, 0)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    error={hasError && !workshopFormInfo.days}
                  />
                }
              </div>
              {workshopFormInfo.days? 
                <div
                  className="input-cell add-more"
                  onClick={addWorkshopDateTime}
                  >
                  <AddIcon />
                  <Typography>Add More</Typography>
                </div>              
              : null}
              <div className="color-field-container">
                {workshopColorKeys.map((colorKey, index) => (
                 <div className="color-field">
                   <ColorPicker
                     key={`color-${index}`}
                     name="color"
                     label={colorKey}
                     value={workshopFormInfo.colors && workshopFormInfo.colors[colorKey]? `${workshopFormInfo.colors[colorKey]}`: "#00000"}
                     onChange={(color) => updateColor(color, colorKey)}
                     InputProps={{ value: workshopFormInfo.colors && workshopFormInfo.colors[colorKey]? `${workshopFormInfo.colors[colorKey]}`: "#00000" }}
                   />
                 </div>
                ))}
              </div>
            </div>
            <MarkdownEditor
              text={
                workshopFormInfo.text
                  ? workshopFormInfo.text
                  : "Enter text here..."
              }
              onChange={updateDescription}
            />
            <div
              className={
                photo
                  ? "drop-uploader-wrap uploader-has-thumb"
                  : "drop-uploader-wrap"
              }
            >
              <Dropzone accept="image/*" onDrop={onDrop}>
                {({ getRootProps, getInputProps, isDragActive }) => (
                  <div
                    {...getRootProps()}
                    className={
                      isDragActive
                        ? "drop-new-wrap drag-active"
                        : "drop-new-wrap"
                    }
                  >
                    <input {...getInputProps()} />
                    <Typography className="drop-photo-text">Drop Photo</Typography>
                  </div>
                )}
              </Dropzone>
              {photo || workshopFormInfo.imageURL? 
                <aside>
                  <div style={thumb}>
                    <div style={thumbInner}>
                      <img src={photo? photo: workshopFormInfo.imageURL? workshopFormInfo.imageURL: CameraIcon} style={img} alt="Thumb" />
                    </div>
                  </div>
                </aside>              
              :null}
            </div>
          </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading} color="primary">
            Cancel
          </Button>
          <Button onClick={addWorkshopOpen? addWorkshop: updateWorkshop} disabled={isLoading} color="primary">
            {addWorkshopOpen? "Add": "Save"}
          </Button>
        </DialogActions>
      </Dialog>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          handleClickOpen={handleClickOpen}
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
