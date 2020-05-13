import React from "react";
import logo from "./logo.svg";
import "./App.css";
import GitUI from "./material/GitUI";
import Progress from "./material/Progress";
import Communicator from "./material/Communicator";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { Switch, Route } from "react-router-dom";

import { createStore } from "redux";
import { Provider } from "react-redux";

import commitReducer from "./redux/reducer";
import progressLog from "./redux/progressLog";

import { makeStyles } from "@material-ui/core/styles";
import { combineReducers } from 'redux'

const reducer = combineReducers([
  commitReducer,
  progressLog
]);

const store = createStore(reducer);
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(4),
      width: "100%",
    },
  },
}));

function App(prop) {
  const classes = useStyles();

  return (
    <Provider store={store}>
      <Communicator />
      <Switch>
        <Route exact path="/" component={GitUI} />
        <Route path="/progress" component={Progress} />
      </Switch>
    </Provider>
  );
}

export default App;
