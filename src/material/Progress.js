import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import  Paper  from "@material-ui/core/Paper";
import  Grid  from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
   marginTop:"20px"
  },
  padding: {
    padding:"26px !important"
  }
}));

const Progress = (prop) => {

  const classes = useStyles();

  const back = () => {
    prop.history.push("/")
  }

  return (
    <div  className={classes.root}>
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="sm">
          <Paper elevation={3}>
            <Grid container spacing={3} style={{ backgroundColor: prop.col }}>
              <Grid item xs={12} sm={12}>
                Suka
              </Grid>
              <Grid item xs={12} sm={12}  className={classes.padding}>
              <Button variant="contained" color="secondary" onClick={back} style={{float:"right"}}>
                  Back
              </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </React.Fragment>
    </div>
  );
};

export default Progress;
