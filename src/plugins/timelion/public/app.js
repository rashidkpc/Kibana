'use strict';

var _ = require('lodash');

var logoUrl = require('./logo.png');

require('./chart_directive');
require('./main.css');

require('ui/chrome')
.setTabDefaults({
  activeIndicatorColor: '#FFF'
})
.setTabs([
  {
    id: '',
    title: 'TimeLion'
  }
])
.setRootTemplate(require('plugins/timelion/index.html'));

var app = require('ui/modules').get('apps/timelion', []);

app.controller('timelion', function ($scope, $http, timefilter) {
  timefilter.enabled = true;

  var blankSheet = ['(`-*`)', '(`-*`)', '(`-*`)'];

  $scope.logoUrl = logoUrl;

  $scope.input = {
    expressions: blankSheet,
    selected: 0,
    interval: '1w'
  };

  $scope.$listen(timefilter, 'fetch', function () {
    $scope.search();
  });

  var init = function () {
    $scope.running = false;
    $scope.search();
  };


  $scope.newSheet = function () {
    $scope.input.expressions = _.cloneDeep(blankSheet);
    init();
  };

  $scope.newCell = function () {
    $scope.input.expressions.push('(`-*`)');
    $scope.search();
  };

  $scope.removeCell = function (index) {
    _.pullAt($scope.input.expressions, index);
    $scope.search();
  };

  $scope.setActiveCell = function (cell) {
    $scope.input.selected = cell;
  };

  $scope.search = function () {
    //localStorageService.set('expressions', $scope.input.expressions);
    $scope.running = true;

    $http.post('/timelion/sheet', {
      sheet:$scope.input.expressions,
      time: _.extend(timefilter.time, {
        interval: $scope.input.interval
      }),
    }).
    // data, status, headers, config
    success(function (resp) {
      $scope.error = null;
      $scope.stats = resp.stats;
      $scope.sheet = resp.sheet;
      _.each(resp.sheet, function (cell) {
        if (cell.exception) {
          $scope.input.selected = cell.plot;
        }
      });
      $scope.running = false;
    })
    .error(function (resp) {
      $scope.error = resp.error;
      $scope.sheet = [];
      $scope.running = false;
    });
  };

  init();
});
