'use strict';

angular.module('TandemWeb')
  .factory('cumulativeLineChart', function () {
      return {
        updateSelectedFactors: function(event, factor, currentFactors) {
          var selectedFactors = [];
          // if this function has been triggered by a click event to select a
          // factor in the sidebar
          // console.log(factor[1]);
          if(typeof event != 'undefined') {
            // when a factor has been checked...
            if(event.target.checked == true ) {
              // if the factor isn't already present in the array of
              // current factors, add it
              for (var index in currentFactors) {
                if (_.isEqual(factor, currentFactors[index])) {
                  var present = true;
                  break;
                }
              }
              // console.log(present == undefined);
              if(present == undefined) {
                currentFactors.push(factor);
              }
              selectedFactors = angular.copy(currentFactors);
            // when a factor has been unchecked...
            } else {
              // Update the array of selected factors by removing the unchecked
              // factor
              selectedFactors = angular.copy(currentFactors);
              for (index in selectedFactors) {
                if (_.isEqual(factor, selectedFactors[index])) {
                  selectedFactors.splice(index, 1);
                }
              }
            }
          // none of the factors are seleted by default on a fresh page load
          } else {
            selectedFactors = [];
          }
          return selectedFactors;
        },

        getChartData: function(result, selectedFactors, noiseLevels) {
          return {
            // series: selectedFactors,
            series: (function() {
              var arr = [];
              for (var index in selectedFactors) {
                arr.push(['C ' + selectedFactors[index][0] + ', ' + 'AGF ' +
                          selectedFactors[index][1]]);
              }
              return arr;
            })(),
            data: (function() {
              var plot_data = [];
              for(var i=0; i < noiseLevels.length; i++) {
                var datum = {
                  x: noiseLevels[i],
                  y: function() {
                    var arr = [];
                    for(var j=0; j < selectedFactors.length; j++) {
                      arr.push(result[selectedFactors[j][0]]['agf'][selectedFactors[j][1]][noiseLevels[i]]);
                    }
                    return arr;
                  }()
                }
                plot_data.push(datum);
              }
              // console.log(plot_data);
              return plot_data;
            })()
          };
        }

      };
  });
