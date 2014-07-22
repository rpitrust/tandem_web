'use strict';

angular.module('TandemWeb')
  .factory('cumulativeLineChart', function () {
      return {
        updateSelectedFactors: function(event, factor, currentFactors) {
          var selectedFactors = [];
          // if this function has been triggered by a click event to select a
          // factor in the sidebar
          if(typeof event !== 'undefined') {
            // when a factor has been checked...
            if(event.target.checked === true ) {
              // if the factor isn't already present in the array of
              // current factors, add it
              for (var index in currentFactors) {
                if (_.isEqual(factor, currentFactors[index])) {
                  var present = true;
                  break;
                }
              }
              if(present == undefined) {
                currentFactors.push(factor);
              }
              selectedFactors = angular.copy(currentFactors);
            // when a factor has been unchecked...
            } else {
              // update the array of selected factors by removing the unchecked
              // factor
              selectedFactors = angular.copy(currentFactors);
              for (var i in selectedFactors) {
                if (_.isEqual(factor, selectedFactors[i])) {
                  selectedFactors.splice(i, 1);
                }
              }
            }
          // none of the factors are seleted by default on a fresh page load
          } else {
            selectedFactors = currentFactors;
          }
          return selectedFactors;
        },

        getChartData: function(result, selectedFactors) {
          return {
            data: (function() {
              var plotData = [];
              for(var i=0; i < selectedFactors.length; i++) {
                var datum = {
                  key: selectedFactors[i],
                  values: function() {
                    var arr = [];
                    var noises = result[selectedFactors[i][0]]['agf'][selectedFactors[i][1]];

                    var noiseLevels = sortNoiseObject(noises);
                    for (var noise in noiseLevels) {
                      arr.push([noise, result[selectedFactors[i][0]]['agf'][selectedFactors[i][1]][noise]]);
                    }
                    return arr;
                  }()
                };
                plotData.push(datum);
              }
              var finalPlotData = plotData.sort(plotDataCompare)
              return finalPlotData;
            })()
          };
        }

      };
  });
