
const {app, BrowserWindow} = require('electron')
const path = require('path')
const isDev = require("electron-is-dev"); 

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1300,
    height: 900,
    minHeight:750,
    minWidth:900,
    icon: isDev
    ? path.join(__dirname,'../public/favicon.ico')
    : path.join(__dirname,'../favicon.ico')
  })
  // mainWindow.setMenuBarVisibility(false)

  mainWindow.loadURL(
    isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../index.html")}`
    );

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}


app.whenReady().then(() => {
  require('./server/server.js')
  createWindow()
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
