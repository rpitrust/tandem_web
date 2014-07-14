'use strict';

angular.module('TandemWeb')
  .factory('endpoints', function ($http) {
    return {
      getNoiseVsSa: function(type, agf) {
        return $http.get('http://localhost:8000/spatial_noise_sa', {
          params: { plot_type: type, agf: agf }
        })}
      };
  });

// Example:
// return $http.get('/spatial_noise_sa', {
//   type : 'getSource',
//   ID    : 'TP001'
// })};
