'use strict';
angular.module('controlPanel')
.controller('ControlPanelCtrl', function ($scope, $mdDialog, Settings) {
  var ipc = require('ipc');

  this.options = Settings.settings;

  this.players = {
    info: '',
    blue: {
      name: '',
      score: {
        ippon: false,
        wazaAri: 0,
        yuko: 0
      },
      penalty: {
        shido: 0,
        medication: 0
      }
    },
    white: {
      name: '',
      score: {
        ippon: false,
        wazaAri: 0,
        yuko: 0
      },
      penalty: {
        shido: 0,
        medication: 0
      }
    }
  };

  this.playersResetObj = angular.copy(this.players);

  this.resetPlayers = function () {
    angular.copy(this.playersResetObj, this.players);
  };

  var that = this;
  $scope.$watch(angular.bind(this, function () {
    return this.players;
  }), function () {
    ipc.send('players', that.players);
  }, true);

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
      ipc.send('settings', {zoomFactor: settings.zoomFactor, showMedication: settings.showMedication});
    }, function () {
      console.log('else');
    });
  };
});
