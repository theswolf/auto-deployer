const electron = require('electron');
const  { Menu, app, shell, dialog, ipcMain} = electron;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const isDev = require('electron-is-dev');
const fs = require('fs')

const defaultMenu = require('electron-default-menu');


let mainWindow;

function readFile(fileName,wc) {
  try {
    let json = JSON.parse(fs.readFileSync(fileName.filePaths[0]).toString())

    wc.send("loadFromDisk",json)
  }
  catch(e) {
    console.log(e.message)
  }
 
}

function storeFile(fileName,store,wc) {
 
  try {
    store.fileName = fileName.filePath;
    wc.send("requestConf")

  }
  catch(e) {
    console.log(e.message)
  }

}

function createWindow() {

  const menu = defaultMenu(app, shell);

  

  mainWindow = new BrowserWindow({width: 900, height: 680,
    webPreferences: {
        nodeIntegration: true
    }});
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
  }
  mainWindow.on('closed', () => mainWindow = null);

  const storeObj = {
    fileName: "/tmp/tmp.json"
  }

  ipcMain.on("userProp", (event,arg) => {
    let fileName = storeObj.fileName
    fs.writeFileSync(fileName,JSON.stringify(arg))
  })

  menu.splice(4, 0, {
    label: 'Util',
    submenu: [
      {
        label: 'Import from file',
        click: (item, focusedWindow) => {
          dialog.showOpenDialog()
          .then(

            (fileNames) => {
              if(fileNames === undefined){
                  console.log("No file selected");
              }else{
                readFile(fileNames,mainWindow.webContents);
              }
          } 

          );
        }
      },
      {
        label: 'Save data to file',
        click: (item, focusedWindow) => {
          dialog.showSaveDialog().then((filename) => {
            storeFile(filename,storeObj,mainWindow.webContents)
          })
        }
       
        /*click: (item, focusedWindow) => {
          mainWindow.webContents.send("requestConf")
        }*/
      }
    ]
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});