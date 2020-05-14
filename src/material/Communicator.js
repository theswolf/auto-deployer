import React from "react";
import { connect } from "react-redux";
import { importFrom, progressLog } from "../redux/actions";

const { ipcRenderer } = require("electron");

const mapStateToProps = (state) => {
  return { ...state[0] };
};

const mapDispatchToProps = {
  importFrom,
  progressLog,
};

const Communicator = (prop) => {

  ipcRenderer.removeAllListeners()
  .on("loadFromDisk", (event, arg) => {
    console.log(arg);
    prop.importFrom(arg);
  })
  .on("requestConf", (event, arg) => {
    ipcRenderer.send("userProp", prop);
  })
  .on("errorLog", (event, arg) => {
    prop.progressLog({
      type: "ERROR",
      msg: arg,
    });
  })
  .on("successLog", (event, arg) => {
    prop.progressLog({
      type: "SUCCESS",
      msg: arg,
    });
  })
  .on("infoLog", (event, arg) => {
    prop.progressLog({
      type: "INFO",
      msg: arg,
    });
  });

  return "";
};

export default connect(mapStateToProps, mapDispatchToProps)(Communicator);
