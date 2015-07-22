'use strict';
angular.module('shared')
.directive('countDownTimer', function ($interval, $rootScope, Settings) {
  return {
    templateUrl: '../shared/timer.html',
    restrict: 'E',
    link: function (scope) {

      scope.settings = {
        competitionTimer:  Settings.settings.duration,
        isFinished: false
      };

      scope.timer = {
        minutes: 0,
        seconds: 0
      };

      var convertTimer = function (time) {
        if (!time) {
          return false;
        }
        var minutes = Math.floor(time / 1000 / 60);
        var seconds = Math.floor((time / 1000) - (minutes * 60));
        if (seconds < 10) {
          seconds = '0' + seconds;
        } else if (seconds === 60) {
          seconds = '00';
        }
        return {
          minutes: '0' + minutes,
          seconds: seconds
        };
      };

      var competitionTimer = null;
      var competitionTime = 5 * 60 * 1000; //5min
      scope.startClock = function () {
        competitionTimer = $interval(function () {
          competitionTime = competitionTime - 100;
          if (competitionTime === 0) {
            $interval.cancel(competitionTimer);
            Settings.settings.timerIsRunning = false;
            scope.settings.isFinished = true;
          } else {
            scope.timer = convertTimer(competitionTime);
          }
        }, 100);
      };

      scope.pauseClock = function () {
        $interval.cancel(competitionTimer);
      };

      scope.clearClock = function () {
        scope.pauseClock();
        competitionTime = scope.settings.competitionTimer;
        scope.timer = convertTimer(competitionTime);
        scope.settings.isFinished = false;
      };

      var ipc = require('ipc');

      ipc.on('timer', function (value) {
        if (value.start) {
          scope.startClock();
        } else if (value.pause) {
          scope.pauseClock();
        } else if (value.clear) {
          if (value.defaultDuration) {
            scope.settings.competitionTimer = value.defaultDuration;
          }
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
