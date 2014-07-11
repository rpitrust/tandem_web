'use strict';

angular.module('TandemWeb')
  .controller('NoiseSaCtrl', ['$scope', '$http', '$location', 'version', 'endpoints',
    function($scope, $http, $location, version, endpoints) {

      $scope.roles = [0.2, 0.4, 0.6, 0.8]

      $scope.user = {
        roles: [0.2, 0.8]
    }

      $scope.$path = $location.path.bind($location);
      $scope.version = version;

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

      $scope.result = {};

      var getNoiseLevels = function() {
        var noiseArray = [];
        for(var competency in $scope.result) {
          for(var noiseLevel in $scope.result[competency]) {
            noiseArray.push(noiseLevel);
          }
          break;
        }
        return noiseArray.sort();
      };

      $scope.updateChart = function(event, comp) {
        if(typeof event != 'undefined') {
          if(event.target.checked == true ) {
            if($scope.currentComps.indexOf(comp) == -1) {
              $scope.currentComps.push(comp);
            }
            $scope.selectedComps = angular.copy($scope.currentComps);
          } else {
            $scope.selectedComps = angular.copy(_.difference($scope.currentComps, [comp]));
          }
        } else {
          $scope.selectedComps = angular.copy($scope.currentComps);
        }

        $scope.data = {
          series: $scope.selectedComps,
          data: (function() {
            var plot_data = [];
            $scope.noiseLevels = getNoiseLevels();
            for(var i=0; i < $scope.noiseLevels.length; i++) {
              var datum = {
                x: $scope.noiseLevels[i],
                y: function() {
                  var arr = [];
                  for(var j=0; j < $scope.selectedComps.length; j++) {
                    arr.push($scope.result[$scope.selectedComps[j]][$scope.noiseLevels[i]]);
                  }
                  return arr
                }()
              }
              plot_data.push(datum);
            }
            return plot_data
          })()
        }

      }

      var init = function() {

        endpoints.getNoiseVsSa()
        .success(function(data, status, headers, config) {
          $scope.result = data.results[0],
          $scope.competencies = Object.keys($scope.result).sort();
          $scope.currentComps = Object.keys($scope.result).sort();
          $scope.updateChart();
        })
      }
      init();


    }
  ]);









          // }(),
          // $scope.data = {
          //   series: Object.keys($scope.result),
          //   data: [
          //     {
          //       x: "50",
          //       y: function() {
          //            var arr = [];
          //            for(var comp in $scope.result) arr.push($scope.result[comp]['50']);
          //             // console.log($scope.result['0.8']);
          //            return arr
          //         }()
          //     },
          //     {
          //       x: "500",
          //       y: function() {
          //            var arr = [];
          //            for(var comp in $scope.result) arr.push($scope.result[comp]['500']);
          //             // console.log($scope.result['0.8']);
          //            return arr
          //         }()
          //     },
          //     {
          //       x: "5000",
          //       y: function() {
          //            var arr = [];
          //            for(var comp in $scope.result) arr.push($scope.result[comp]['5000']);
          //             // console.log($scope.result['0.8']);
          //            return arr
          //         }()
          //     }
          //   ]
          // };
