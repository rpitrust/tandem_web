'use strict';

angular.module('TandemWeb')
  .controller('NoiseVsXCtrl', ['$scope', '$http',
                              'endpoints', 'cumulativeLineChart',
    function($scope, $http, endpoints, cumulativeLineChart) {

      // Initial constants
      $scope.trustUsed = 'TRUE,FALSE'
      $scope.plotFactors = ['competence', 'willingness', 'spammer', 'selfish'];
      $scope.currentPlotFactor = 'competence';
      $scope.yAxisOptions = [
        { name: 'SA'},
        { name: 'SA0'},
        { name: 'Comm'},
        { name: 'Comm0'},
        { name: 'Steps'},
        { name: 'Steps0'}
      ];


      // Y-axis selection
      $scope.yAxis = {selected: {name: 'SA'}};

      $scope.$watch('yAxis.selected', function() {
        if ($scope.yAxis.hasOwnProperty('selected')) {
          $scope.agfSelected = false;

          resetChart();
          for (var agf in $scope.agfOptions) {
            $scope.agfOptions[agf] = false;
          }
        }
      });


      // AGF selection
      $scope.agfOptions = {
        1: false,
        3: false
      };

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

      // Trust used selection
      $scope.trustOptions = {
        true: true,
        false: true
      };

      $scope.$watchCollection('trustOptions', function() {
        var arr  = []
        for (var option in $scope.trustOptions) {
          if ($scope.trustOptions[option] == true) {
            arr.push(option.toUpperCase());
          }
        }
        if (arr.length > 0) {
          $scope.trustUsed = arr.join(',');
        }
        resetChart();
      });


      // Tabs displayed on the top of the page
      $scope.factorTabs = [
        {'id': 0, 'title': 'Competence'},
        {'id': 1, 'title': 'Willingness'},
        {'id': 2, 'title': 'Spammer'},
        {'id': 3, 'title': 'Selfish'}
      ];

      $scope.factorTabs.activeTab = 0;

      $scope.updateActiveTab = function(tabId) {
        $scope.agfSelected = false;
        for (var agf in $scope.agfOptions) {
          $scope.agfOptions[agf] = false;
        }
        $scope.factorTabs.activeTab  = tabId;
      };


      $scope.$watch('factorTabs.activeTab', function() {
        $scope.currentPlotFactor = $scope.plotFactors[$scope.factorTabs.activeTab];
        getPlotData();
      });


      var resetChart = function() {
        for (var agf in $scope.agfOptions) {
          $scope.agfOptions[agf] = false;
        };
        $scope.agfSelected = false;
        $scope.currentFactors = [];
        $scope.updateChart();
      };


      // Get data from the API
      var getPlotData = function(options) {
        var opts = {};
        if (typeof options !== 'undefined') {
          var agf = options.agf || '1';
        }

        if ($scope.yAxis.hasOwnProperty('selected')) {
          var yAxis = $scope.yAxis.selected.name.toLowerCase();
        } else {
          var yAxis = 'sa';
        }
        endpoints.getNoiseVsSa($scope.currentPlotFactor, agf, yAxis,
                               $scope.trustUsed)
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


      // Plot a new line when a factor data point is selected in the sidebar
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


      $scope.yTickFormatFunction = function() {
        return d3.format('.4f')
      };


      // Color mapping logic for line chart plotting and color-coding the list
      // of factors in the sidebar
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
          var bgColor = colorMapping[factor[1]][factor[0]];
          return {
            color: 'white',
            backgroundColor: bgColor,
            lineHeight: 1.5
          };
        } else {
          return {lineHeight: 1.5};
        }
      };


      // Used by the color attribute of the line chart directive
      $scope.colorFunction = function(){
        var agfArr = [1, 3];

        // Hard-coded colors for cases where the factor = 0.0
        colorMapping[1][0.0.toFixed(1)] = '#A22630'
        colorMapping[3][0.0.toFixed(1)] = '#A26A0A'

        for (var i = 0; i < colorArray.length; i++) {
          for (var j = 0; j < agfArr.length; j++) {
            colorMapping[agfArr[j]][(((i+1)/10)).toFixed(1)] = colorArray[i + j*10];
          }
        }
        // console.log(colorMapping);
        return function(d) {
          return colorMapping[parseInt(d.key[1])][parseFloat(d.key[0]).toFixed(1)];
        };
      };

    }
  ]);
