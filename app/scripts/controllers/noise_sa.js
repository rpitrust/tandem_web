'use strict';

angular.module('TandemWeb')
  .controller('NoiseSaCtrl', ['$scope', '$http', '$location', 'version',
                              'endpoints', 'cumulativeLineChart',
    function($scope, $http, $location, version, endpoints, cumulativeLineChart) {

      $scope.$path = $location.path.bind($location);
      $scope.version = version;


      $scope.yAxis = {selected: {name: 'SA'}};
      $scope.yAxisOptions = [
        { name: 'SA'},
        { name: 'SA0'},
        { name: 'Comm'},
        { name: 'Comm0'},
        { name: 'Steps'},
        { name: 'Steps0'}
      ];

      $scope.$watch('yAxis.selected', function() {
        if ($scope.yAxis.hasOwnProperty('selected')) {
          $scope.agfSelected = false;

          resetChart();
          for (var agf in $scope.agfOptions) {
            $scope.agfOptions[agf] = false;
          }
        }
      });

      $scope.agfOptions = {
        1: false,
        2: false
      };

      $scope.trustOptions = 'False';

      $scope.$watch('trustOptions', function() {
        resetChart();
      });

      $scope.agfSelected = false;

      $scope.$watchCollection('agfOptions', function() {
        var arr = [];
        $scope.selectedFactorCheckboxes = [];
        for (var agf in $scope.agfOptions) {
          if ($scope.agfOptions[agf] === true) {
            arr.push(agf);
          }
        }
        if (arr.length !== 0) {
          getPlotData({agf: arr.join(',')});
          $scope.agfSelected = true;
        } else {
          resetChart();
        }
      });

      $scope.plotFactors = ['competence', 'willingness', 'spammer', 'selfish'];
      $scope.currentPlotFactor = 'competence';

      $scope.factorTabs = [
        {'id': 0, 'title': 'Competence'},
        {'id': 1, 'title': 'Willingness'},
        {'id': 2, 'title': 'Spammer'},
        {'id': 3, 'title': 'Selfish'}
      ];

      $scope.factorTabs.activeTab = 0;

      var resetChart = function() {
        for (var agf in $scope.agfOptions) {
          $scope.agfOptions[agf] = false;
        };
        $scope.agfSelected = false;
        $scope.currentFactors = [];
        $scope.updateChart();
      };

      $scope.updateActiveTab = function(tabId) {
        $scope.agfSelected = false;
        for (var agf in $scope.agfOptions) {
          $scope.agfOptions[agf] = false;
        }
        $scope.factorTabs.activeTab  = tabId;
      };


      $scope.$watch('factorTabs.activeTab', function() {
        console.log($scope.factorTabs.activeTab);
        $scope.currentPlotFactor = $scope.plotFactors[$scope.factorTabs.activeTab];
        getPlotData();
      });


      var getPlotData = function(options) {
        var opts = {};
        if (typeof options !== 'undefined') {
          var agf = options.agf || '1';
        }

        if ($scope.yAxis.hasOwnProperty('selected')) {
          var yAxis = $scope.yAxis.selected.name.toLowerCase();
        } else {
          var yAxis =  'sa';
        }

        var trustUsed = $scope.trustOptions.toUpperCase();

        endpoints.getNoiseVsSa($scope.currentPlotFactor, agf, yAxis, trustUsed)
        .success(function(data, status, headers, config) {
          $scope.result = data.results[0],
          $scope.factors = getAllFactors();
          $scope.currentFactors = [];
          $scope.updateChart();

        });
      };

      var getAllFactors = function() {
        var factorsArr = Object.keys($scope.result).sort();
        var finalArr = (function() {
          var arr = [];
          for (var index in factorsArr) {
            var factor = factorsArr[index];
            for (var agf in $scope.result[factor]['agf']) {
              arr.push([factor, agf]);
            }
          }
          return arr;
        }());
        return finalArr;
      };

      $scope.updateChart = function(event, factor) {
        if (typeof event !== 'undefined') {
          if (event.target.checked === true) {
            $scope.selectedFactorCheckboxes.push(factor);
          } else {
            for ( var idx = 0; idx < $scope.selectedFactorCheckboxes.length; idx++) {
              if ($scope.selectedFactorCheckboxes[idx][0] === factor[0] &&
                  $scope.selectedFactorCheckboxes[idx][1] === factor[1]) {
                $scope.selectedFactorCheckboxes.splice(idx, 1);
                break;
              }
            }
          }
        }

        $scope.selectedFactors = cumulativeLineChart.updateSelectedFactors(
                                   event, factor,  $scope.currentFactors);

        $scope.data = cumulativeLineChart.getChartData(
                        $scope.result, $scope.selectedFactors
                      ).data;
      };


      $scope.xaxisscalefunction = function() {
        // return d3.scale.quantile();
        return d3.scale.ordinal();
        // return d3.scale.linear();
      };
      $scope.xaxisdomainfunction = function() {
        return [0, 50, 500, 5000];
      };
      $scope.xaxisrangefunction = function() {
        return [0, 200, 400];
        // d3.scale.ordinal().rangeRoundBands([0, 300]);
      };

      $scope.yTickFormatFunction = function() {
        return d3.format('.2f')
      };


      var colorArray = d3.scale.category20().range();
      var colorMapping = {};
      colorMapping[1] = {};
      colorMapping[3] = {};

      $scope.selectedFactorCheckboxes = [];
      $scope.isSelected = function(factor) {
        for (var idx = 0; idx < $scope.selectedFactorCheckboxes.length; idx++) {
          if ($scope.selectedFactorCheckboxes[idx][0] === factor[0] &&
              $scope.selectedFactorCheckboxes[idx][1] === factor[1]) {
            return true;
          } else {
            continue;
          }
        }
        return false;
      };

      $scope.getSelectedClass = function(factor) {
        if ($scope.isSelected(factor) === true) {
          var color = colorMapping[factor[1]][factor[0]];
          return {
            color: 'white',
            backgroundColor: color,
            lineHeight: 1.5
          };
        } else {
          return {lineHeight: 1.5};
        }
      };


      $scope.colorFunction = function(){
        var agfArr = [1, 3];
        var colorCount = 0;
        for (var i = 0; i < colorArray.length; i++) {
          for (var j = 0; j < agfArr.length; j++) {
            colorMapping[agfArr[j]][(((i+1)/10)).toFixed(1)] = colorArray[i + j*10];
          }
        }
        return function(d) {
          return colorMapping[parseInt(d.key[1])][parseFloat(d.key[0]).toFixed(1)];
        };
      };

      var init = function() {
        getPlotData({plotFactor: 'competence'});
      };
      init();

    }
  ]);
