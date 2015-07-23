'use strict';
angular.module('shared')
.directive('osaekomiTimer', function ($interval, $rootScope) {
  return {
    templateUrl: '../shared/osaekomi-timer.html',
    restrict: 'E',
    scope: {},
    link: function (scope) {

      scope.settings = {
        isFinished: false
      };

      scope.timer = {
        seconds: 0
      };

      var convertTimer = function (time) {
        if (!time && time !== 0) {
          return false;
        }
        var seconds = Math.floor(time / 1000);
        if (seconds < 10) {
          seconds = '0' + seconds;
        } else if (seconds === 0) {
          seconds = '00';
        }
        return {
          seconds: seconds
        };
      };

      var osaekomiTimer = null;
      var competitionTime = 0;
      scope.startClock = function () {
        osaekomiTimer = $interval(function () {
          competitionTime = competitionTime + 100;
          if (competitionTime >= 25000) {
            $interval.cancel(osaekomiTimer);
            scope.settings.isFinished = true;
          } else {
            scope.timer = convertTimer(competitionTime);
          }
        }, 100);
      };

      scope.pauseClock = function () {
        $interval.cancel(osaekomiTimer);
      };

      scope.clearClock = function () {
        scope.pauseClock();
        scope.timer = convertTimer(0);
        competitionTime = 0;
        scope.settings.isFinished = false;
      };

      var ipc = require('ipc');

      ipc.on('timer', function (value) {
        if (value.startOsaekomi) {
          scope.startClock();
        } else if (value.pauseOsaekomi) {
          scope.pauseClock();
        } else if (value.clearOsaekomi) {
          scope.clearClock(value);
          if (!scope.$$phase) {
            $rootScope.$apply();
          }
        }
      });

      scope.clearClock();
    }
  };
});
