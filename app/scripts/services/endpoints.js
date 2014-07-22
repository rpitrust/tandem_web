'use strict';

angular.module('TandemWeb')
  .factory('endpoints', function ($http) {
    return {
      getNoiseVsSa: function(type, agf, yAxis, trustUsed) {
        return $http.get('http://localhost:8000/spatial_noise_sa/', {
          params: { plot_factor: type,
                    agf: agf,
                    plot_y_axis: yAxis,
                    trust_used: trustUsed }
        })}
      };
  });

// Example:
// return $http.get('/spatial_noise_sa', {
//   type : 'getSource',
//   ID    : 'TP001'
// })};
