import React from 'react';
import { connect } from 'react-redux';
import { importFrom } from '../redux/actions'


const {ipcRenderer} = require('electron')





const mapStateToProps = (state) => {
    return { ...state[0] }
  }

  const mapDispatchToProps = {
    importFrom
  }


const  Communicator = (prop) => {
    ipcRenderer.on('loadFromDisk', (event, arg) => {
        console.log(arg);
        prop.importFrom(arg)
     })

     ipcRenderer.on('requestConf', (event, arg) => {
        ipcRenderer.send("userProp",prop)
     })

     return ""
 }

 export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Communicator)