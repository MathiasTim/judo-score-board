'use strict';
angular.module('controlPanel')
.controller('ControlPanelCtrl', function ($mdDialog, Settings) {
  var ipc = require('ipc');

  this.options = Settings.settings;

  this.players = {
    blue: '',
    white: ''
  };

  this.sendPlayers = function () {
    ipc.send('players', this.players);
  };

  this.toggleTimer = function (type) {
    type = type || 'default';
    if (type === 'default') {
      this.options.timerIsRunning = !this.options.timerIsRunning;
      this.options.timerIsRunning ? this.startTimer() : this.pauseTimer();
    } else {
      this.options.osaekomiTimerIsRunning = !this.options.osaekomiTimerIsRunning;
      this.options.osaekomiTimerIsRunning ? this.startTimer(type) : this.pauseTimer(type);
    }
  };

  this.startTimer = function (type) {
    type = type || 'default';
    if (type === 'default') {
      ipc.send('timer', {start: true});
    } else {
      ipc.send('timer', {startOsaekomi: true});
    }
  };

  this.pauseTimer = function (type) {
    type = type || 'default';
    if (type === 'default') {
      ipc.send('timer', {pause: true});
      this.options.timerIsRunning = false;
    } else {
      ipc.send('timer', {pauseOsaekomi: true});
      this.options.osaekomiTimerIsRunning = false;
    }
  };

  this.resetTimer = function (type) {
    type = type || 'default';
    if (type === 'default') {
      ipc.send('timer', {clear: true});
      this.options.timerIsRunning = false;
    } else {
      ipc.send('timer', {clearOsaekomi: true});
      this.options.osaekomiTimerIsRunning = false;
    }
  };

  this.showSettings = function (ev) {
    $mdDialog.show({
      controller: function ($scope) {
        $scope.settings = Settings.settings;

        $scope.cancel = function () {
          $mdDialog.cancel();
        };

        $scope.save = function () {
          $mdDialog.hide($scope.settings);
        };
      },
      templateUrl: 'settings.html',
      parent: angular.element(document.body),
      targetEvent: ev,
    })
    .then(function (settings) {
      ipc.send('timer', {clear: true, defaultDuration: settings.duration});
    }, function () {
      console.log('else');
    });
  };
});
