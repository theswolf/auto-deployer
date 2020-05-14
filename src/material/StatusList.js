import React from "react";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const mapStateToProps = (state) => {
  return { ...state[1] };
};

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const StatusList = (prop) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {prop.log.map((log) => {
        switch (log.type) {
          case "ERROR":
            return <Alert severity="error">{log.msg}</Alert>;
          case "SUCCESS":
            return <Alert severity="success">{log.msg}</Alert>;
          case "INFO":
            return <Alert severity="info">{log.msg}</Alert>;

          default:
            return "";
        }
      })}
    </div>
  );
};
export default connect(mapStateToProps)(StatusList);
