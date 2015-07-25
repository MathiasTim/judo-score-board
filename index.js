'use strict';
const app = require('app');
const BrowserWindow = require('browser-window');
const Communicator = require('./communicator.js');

// const console = require('console');

// report crashes to the Electron project
require('crash-reporter').start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being GC'd
let controlPanel;
let displayPanel;

function onClosed () {
  // deref the window
  // for multiple windows store them in an array
  controlPanel = null;
}

function createMainWindow (path, width, height, offsetX) {
  const win = new BrowserWindow({
    x: offsetX || 0,
    width: width || 600,
    height: height || 400,
    resizable: true,
    // 'zoom-factor': 2.0
  });

  win.loadUrl(`file://${__dirname}/${path}`);
  win.on('closed', onClosed);

  return win;
}

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate-with-no-open-windows', function () {
  if (!controlPanel) {
    controlPanel = createMainWindow();
  }
});

app.on('ready', function () {
  displayPanel = createMainWindow('display-panel/index.html', 600, 400, 5000);
  controlPanel = createMainWindow('control-panel/index.html', 600, 400, 0);

  Communicator.startListener(controlPanel, displayPanel);
});
