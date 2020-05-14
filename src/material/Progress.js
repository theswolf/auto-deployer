import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import  Paper  from "@material-ui/core/Paper";
import  Grid  from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import StatusList from './StatusList';
import { makeStyles } from '@material-ui/core/styles';
import { clearLog } from '../redux/actions'
import { connect } from 'react-redux'


const useStyles = makeStyles((theme) => ({
  root: {
   marginTop:"20px"
  },
  padding: {
    padding:"26px !important"
  }
}));


const mapDispatchToProps = {
  clearLog
}


const Progress = (prop) => {

  const classes = useStyles();

  const back = () => {
    prop.clearLog()
    prop.history.push("/")
  }

  return (
    <div  className={classes.root}>
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="sm">
          <Paper elevation={3} style={{backgroundColor:"#daf578"}}>
            <Grid container spacing={3} >
            <Grid item xs={12} sm={12}>
                <h2>Wait for success or fail</h2>
              </Grid>
              <Grid item xs={12} sm={12}>
                <StatusList />
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

//export default Progress
export default connect(null, mapDispatchToProps)(Progress);
