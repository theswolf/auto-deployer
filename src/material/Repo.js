import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { setValue } from '../redux/actions'
import { connect } from 'react-redux'

import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const mapDispatchToProps = {
  setValue
}

const mapStateToProps = (state) => {
  return { ...state[0] }
}



const Repo = (prop) => {
  const classes = useStyles();

  const handleChange = (evt) => {
    prop.setValue(evt)
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3} style={{ backgroundColor: prop.col }}>
        <Grid item xs={12} sm={12}>
          <h2>{prop.title}</h2>
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            id={`${prop.prefix}Url`}
            label="Url"
            style={{ width: "100%" }}
            value={prop[`${prop.prefix}Url`]}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField id={`${prop.prefix}UserName`} label="UserName"  value={prop[`${prop.prefix}UserName`]} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField id={`${prop.prefix}Password`} label="Password"  value={prop[`${prop.prefix}Password`]}  onChange={handleChange}/>
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField id={`${prop.prefix}Branch`} label="Branch"  value={prop[`${prop.prefix}Branch`]}  onChange={handleChange}/>
        </Grid>
      </Grid>
    </div>
  );
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Repo)