'use strict';
angular.module('displayPanel')
.controller('DisplayPanelCtrl', function ($rootScope) {
  var ipc = require('ipc');

  this.players = {};

  this.settings = {
    zoomFactor: null,
    showMedication: false
  };

  var that = this;
  ipc.on('players', function (value) {
    that.players = value;
    if (!$rootScope.$$phase) {
      $rootScope.$apply();
    }
  });

  ipc.on('settings', function (value) {
    that.settings.zoomFactor = {'zoom': value.zoomFactor};
    that.settings.showMedication = value.showMedication;
    if (!$rootScope.$$phase) {
      $rootScope.$apply();
    }
  });
});
