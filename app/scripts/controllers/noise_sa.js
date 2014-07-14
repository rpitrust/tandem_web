'use strict';

angular.module('TandemWeb')
  .controller('NoiseSaCtrl', ['$scope', '$http', '$location', 'version',
                              'endpoints', 'cumulativeLineChart',
    function($scope, $http, $location, version, endpoints, cumulativeLineChart) {

      $scope.$path = $location.path.bind($location);
      $scope.version = version;

      $scope.selectedIcons = ['1'];
      $scope.icons = [ {value: '1', label: '1'},
                       {value: '3', label: '3'} ];

      $scope.$watch('selectedIcons', function() {
        if ($scope.selectedIcons.length == 0) {
          $scope.selectedIcons = ['1'];
        }
        getPlotData($scope.plotTypes[$scope.factorTabs.activeTab])
      })


      $scope.plotTypes = ['competence', 'willingness', 'spammer', 'selfish']

      $scope.factorTabs = [
        {"title": "Competence"},
        {"title": "Willingness"},
        {"title": "Spammer"},
        {"title": "Selfish"}
      ]

      $scope.factorTabs.activeTab = 0;


      $scope.config = {
        title: 'Noise vs SA',
        tooltips: true,
        labels: false,
        mouseover: function() {},
        mouseout: function() {},
        click: function() {}
        // legend: {
        //   display: false,
        //   //could be 'left, right'
        //   position: 'right'
        // }
      };

      var getNoiseLevels = function() {
        var noiseArray = [];
        for(var factor in $scope.result) {
          for(var noiseLevel in $scope.result[factor]['agf'][$scope.selectedIcons[0]]) {
            noiseArray.push(noiseLevel);
          }
          break;
        }
        return noiseArray.sort();
      };

      $scope.$watch('factorTabs.activeTab', function() {
        getPlotData($scope.plotTypes[$scope.factorTabs.activeTab]);
      });

      var getAllFactors = function() {
        var factors_arr = Object.keys($scope.result).sort();
        var final_arr = (function() {
          var arr = [];
          for (var index in factors_arr) {
            var factor = factors_arr[index];
            for (var agf in $scope.result[factor]['agf']) {
              arr.push([factor, agf]);
            }
          }
          return arr;
        }());
        return final_arr;
      };

      var getPlotData = function(plot_type) {
        endpoints.getNoiseVsSa(plot_type, $scope.selectedIcons.join(','))
        .success(function(data, status, headers, config) {
          $scope.result = data.results[0],
          $scope.factors = getAllFactors();
          $scope.currentFactors = [];
          $scope.updateChart();
        })
      };

      $scope.updateChart = function(event, factor) {
        $scope.selectedFactors = cumulativeLineChart.updateSelectedFactors(
                                   event, factor,  $scope.currentFactors);
        // console.log($scope.selectedFactors);

        $scope.data = cumulativeLineChart.getChartData(
                        $scope.result, $scope.selectedFactors, getNoiseLevels()
                      );
      }

      var init = function() {
        getPlotData('competence');
      }
      init();

    }
  ]);
