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
  displayPanel = null;
}

function createMainWindow (path, width, height, zoomFactor) {
  const win = new BrowserWindow({
    width: width || 600,
    height: height || 400,
    resizable: true,
    'zoom-factor': zoomFactor || 1
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
  displayPanel = createMainWindow('display-panel/index.html', 1000, 600);
  controlPanel = createMainWindow('control-panel/index.html', 600, 800);

  Communicator.startListener(controlPanel, displayPanel);
});
