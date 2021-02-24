/* eslint-disable no-use-before-define */
import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

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

const Tags = ({ handleWorkshopTags, workshopTags }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        id="happiness-tags"
        options={Journals}
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
        onChange={(e, updatedTags) => handleWorkshopTags(e, updatedTags)}
      />
    </div>
  );
}

export default Tags;

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const Journals = [
  'Purpose',
  'Growth mindset',
  'Confidence',
  'Law of attraction',
  'Self awareness',
  "Healing",
  'Anxiety',
  'Resilience',
  'Love & relationships',
  'Mindfulness',
  'Self love',
  'Acceptance',
  'Abundance',
  'Courage',
  'Dreams',
  'Health',
  'Self esteem',
];