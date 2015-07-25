'use strict';

// const BrowserWindow = require('browser-window');
// const console = require('console');

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

    // var that = this;
    ipc.on('timer', function (event, arg) {
      displayPanel.webContents.send('timer', arg);
      controlPanel.webContents.send('timer', arg);

      // if (arg.start) {
      //   that.startTimer(arg);
      // } else if (arg.pause) {
      //   that.pauseTimer();
      // } else if (arg.clear) {
      //   that.clearTimer();
      // }
    });

    ipc.on('players', function (event, arg) {
      displayPanel.webContents.send('players', arg);
    });
  },
  // timer: null,
  // time: undefined,
  // duration: 300000,
  // startTimer: function (settings) {
  //   settings = settings || {time: 300000};
  //   this.duration = settings.time;
  //   var that = this;
  //   that.time = that.time || that.duration;
  //   this.timer = setInterval(function () {
  //     that.time = that.time - 100;
  //     if (that.time === 0) {
  //       clearInterval(that.timer);
  //     }
  //   }, 100);
  // },
  // pauseTimer: function () {
  //   clearInterval(this.timer);
  // },
  // clearTimer: function () {
  //   this.pauseTimer();
  //   this.time = 300000;
  // }
};
