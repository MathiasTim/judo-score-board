'use strict';

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

const ipc = require('ipc');

module.exports = {
  startListener: function (controlPanel, displayPanel) {
    if (!controlPanel || !displayPanel) {
      return;
    }

    controlPanel.webContents.on('did-finish-load', function () {
      //do something
    });

    displayPanel.webContents.on('did-finish-load', function () {
      // do something
    });

    ipc.on('timer', function (event, arg) {
      displayPanel.webContents.send('timer', arg);
      controlPanel.webContents.send('timer', arg);
    });

    ipc.on('players', function (event, arg) {
      displayPanel.webContents.send('players', arg);
    });

    ipc.on('settings', function (event, arg) {
      displayPanel.webContents.send('settings', arg);
    });
  },
};
