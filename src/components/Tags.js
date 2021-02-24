/* eslint-disable no-use-before-define */
import React from 'react';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const filter = createFilterOptions();

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
    marginTop: "8px",
    marginBottom: "4px"
  },
}));

const Tags = ({ 
  handleWorkshopTags, 
  workshopTags, 
  happinessTags, 
  addNewTag, 
  openTagDialog, 
  setTagDialogOpen, 
  addTagLoading 
}) => {
  const classes = useStyles();
  const [newTag, setNewTag] = React.useState('');

  const handleClose = () => {
    setNewTag('');
    setTagDialogOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addNewTag(newTag);
  };

  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        id="happiness-tags"
        options={happinessTags}
        getOptionLabel={(option) => option}
        value={workshopTags? workshopTags: []}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Workshop Tags"
            placeholder="Workshop Tags"
          />
        )}
        onChange={(e, updatedTags) => {
          if (updatedTags.length > 0) {
            if (happinessTags.includes(updatedTags[updatedTags.length - 1])) {
              handleWorkshopTags(updatedTags);
            } else {
              // timeout to avoid instant validation of the dialog's form
              setTimeout(() => {
                setTagDialogOpen(true);
                const parsedNewTag = updatedTags[updatedTags.length - 1].substring(4).replace(/['"]+/g, '');
                setNewTag(parsedNewTag);
              });
            }
          } else {
            handleWorkshopTags(updatedTags);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== '') {
            filtered.push(`Add "${params.inputValue}"`);
          }

          return filtered;
        }}
      />
      <Dialog open={openTagDialog} onClose={() => handleClose()} aria-labelledby="add-tag-form">
        <form onSubmit={handleSubmit}>
          <DialogTitle id="add-tag-form-title">Add a new tag</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Do you want to add a new tag to the Happiness Planner?
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="new-tag"
              value={newTag}
              onChange={() => setNewTag(newTag)}
              label="Happiness Planner Tag"
              type="text"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => handleClose()} 
              color="primary"
              disabled={addTagLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              color="primary"
              disabled={addTagLoading}
            >
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default Tags;