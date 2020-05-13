import React from 'react';
import Repo from './Repo'
import Submit from './Submit'
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';


import { connect } from 'react-redux'


import { makeStyles } from '@material-ui/core/styles';



const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(4),
      width: '100%',
    },
  },
}));


const mapStateToProps = (state) => {
    return { ...state[0] }
  }

const  GitUI = (prop) => {
  const classes = useStyles();

  const isHidden = () => {
     return prop.isSingleCommit
    
  }

  const handleSubmit = (evt) => {
      debugger;
      console.log(evt)
      prop.history.push('/progress');
  }

  return (
    <div> 
    <React.Fragment>
    <CssBaseline />
    <Container maxWidth="sm">
      <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
      <div hidden={isHidden()}>
      <Paper elevation={3} >
      <Repo col="#78f5d2" prefix="from" title="From" />
      </Paper>
      </div>
     
      <Paper elevation={3} >
      <Repo col="#daf578" prefix="to" title="To"/>
      </Paper>
       
    
     
      <Paper elevation={3} >
        <Submit col="#9cf578" />
      </Paper>
      
    </form>
    </Container>
  </React.Fragment>
  </div>


   
    
  );
}



export default connect(
    mapStateToProps
  )(GitUI)
