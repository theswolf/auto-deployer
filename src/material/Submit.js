import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { toggleCommit,setValue } from '../redux/actions'
import { connect } from 'react-redux'





const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const mapDispatchToProps = {
  toggleCommit,
  setValue
}

const mapStateToProps = (state) => {
  return { ...state[0] }
}

const Submit = (prop) => {
  const classes = useStyles();

  const handleTransfer = (evt) => {
    prop.setValue(evt)
  }


  const handleChange = (evt) => {
    prop.toggleCommit()
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3} style={{backgroundColor:prop.col}}>
        <Grid item xs={12} sm={6}>
        <TextField id="proxyUrl" label="Proxy Url" value={prop.proxyUrl}
        onChange={handleTransfer} />
        </Grid>
        <Grid item xs={12} sm={6}>
        <TextField id="proxyPort" label="Proxy Port" value={prop.proxyPort}
        onChange={handleTransfer}/>
        </Grid>
        <Grid item xs={6} sm={3}>
        <FormControlLabel
        control={
          <Checkbox
            id="emptyCommit"
            name="emptyCommit"
            color="primary"
            checked={prop.isSingleCommit}
            onChange={handleChange}
          />
        }
        label="Empty Commit"
      />
        </Grid>
        <Grid item xs={6} sm={3}>
        <Button variant="contained" color="primary" type="submit">
          Vai
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Submit)