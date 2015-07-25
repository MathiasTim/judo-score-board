'use strict';
angular.module('displayPanel')
.controller('DisplayPanelCtrl', function ($rootScope) {
  var ipc = require('ipc');

  this.players = {};

  var that = this;
  ipc.on('players', function (value) {
    that.players = value;
    if (!$rootScope.$$phase) {
      $rootScope.$apply();
    }
  });
});
