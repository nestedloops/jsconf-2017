const { app, BrowserWindow } = require('electron');
const portfinder = require('portfinder');
const express = require('express');
const log = require('electron-log');
const path = require('path');

let isProduction = false;
try {
  require('./prod.json');
  isProduction = true;
  log.info('running in prod mode');
} catch (e) {
  log.info('running in dev mode');
}

global.userDataDirectory = path.join(userData(), 'jsconf-2017');
log.info('user data dir: ' + global.userDataDirectory);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 960,
    height: 800,
    title: 'JSConf 2017'
  });

  if (isProduction) {
    log.info('trying to find a port');
    portfinder.getPort(function (err, port) {
      if (err) {
        log.error('Could not find a port');
        log.error(err.toString());
      }
      const expressApp = express();
      expressApp.use(express.static(__dirname));
      log.info('static path ' + __dirname);
      expressApp.use((_, res) => res.redirect('/'));

      expressApp.listen(port, function (a,b) {

        log.info('JSConf 2017 is running on port', port);

        // and load the index.html of the app.
        win.loadURL('http://localhost:' + port);
      });
    });
  } else {
    win.loadURL('http://localhost:3000');
  }

  // win.webContents.openDevTools()

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
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
});

/**
 * Had to import this helper from https://github.com/MrJohz/appdirectory and change it because of some issues on windows
 * Thei licence applies
 Copyright (c) 2014 Johz jonathan.frere@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function userData (roaming, platform) {
  var dataPath;
  platform = platform || process.platform
  if (platform === "darwin") {
    dataPath = path.join(process.env.HOME, 'Library', 'Application Support')
  } else if (platform === "win32") {
    var sysVariable
    if (roaming) {
      sysVariable = "APPDATA"
    } else {
      sysVariable = "LOCALAPPDATA" // Note, on WinXP, LOCALAPPDATA doesn't exist, catch this later
    }
    dataPath = path.join(process.env[sysVariable] || process.env.APPDATA /*catch for XP*/)
  } else {
    if (process.env.XDG_DATA_HOME) {
      dataPath = path.join(process.env.XDG_DATA_HOME)
    } else {
      dataPath = path.join(process.env.HOME, ".local", "share")
    }
  }
  return dataPath
}
