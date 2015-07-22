'use strict';
angular.module('controlPanel')
.controller('ControlPanelCtrl', function ($mdDialog, Settings) {
  var ipc = require('ipc');

  this.options = Settings.settings;

  this.toggleTimer = function () {
    this.options.timerIsRunning = !this.options.timerIsRunning;
    this.options.timerIsRunning ? this.startTimer() : this.pauseTimer();
  };

  this.startTimer = function () {
    ipc.send('timer', {start: true});
  };

  this.pauseTimer = function () {
    ipc.send('timer', {pause: true});
    this.options.timerIsRunning = false;
  };

  this.resetTimer = function () {
    ipc.send('timer', {clear: true});
    this.options.timerIsRunning = false;
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
