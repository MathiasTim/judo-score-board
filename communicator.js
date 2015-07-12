'use strict';

// const BrowserWindow = require('browser-window');
// const console = require('console');

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

const ipc = require('ipc');

module.exports = {
  startListener: function(controlPanel, displayPanel) {
    if (!controlPanel || !displayPanel) {
      return;
    }

    controlPanel.webContents.on('did-finish-load', function() {
      //do something
    });

    displayPanel.webContents.on('did-finish-load', function() {
      displayPanel.webContents.send('timer', {clear: true});
    });

    ipc.on('timer', function(event, arg) {
			console.log(displayPanel);
      displayPanel.webContents.send('timer', arg);
    });
  }
};
