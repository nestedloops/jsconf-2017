const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs');
const portfinder = require('portfinder');
const express = require('express');
const isProduction = process.env['NODE_ENV'] === 'production';
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 960, height: 800})

  if (isProduction) {
    portfinder.getPort(function (err, port) {
      const expressApp = express();
      expressApp.use(express.static(path.join(__dirname, '..', 'build')));
      expressApp.use((_, res) => res.redirect('/'));

      expressApp.listen(port, function () {
        console.log('JSConf 2017 is running on port', port);

        // and load the index.html of the app.
        win.loadURL('http://localhost:' + port);
      });
    });
  } else {
    win.loadURL('http://localhost:3000');
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
