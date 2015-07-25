'use strict';
angular.module('shared')
.service('Settings', function () {
  this.settings = {
    timerIsRunning: false,
    osaekomiTimerIsRunning: false,
    duration: 180000,
    list: [
      {
        label: 'test',
        value: 2000
      },
      {
        label: '1 Min',
        value: 60000
      },
      {
        label: '2 Mins',
        value: 120000
      },
      {
        label: '3 Mins',
        value: 180000
      },
      {
        label: '4 Mins',
        value: 240000
      },
      {
        label: '5 Mins',
        value: 300000
      }
    ]
  };
});
