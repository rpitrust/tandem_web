'use strict';

angular.module('TandemWeb')
  .factory('endpoints', function ($http) {
    return {
      getNoiseVsSa: function() {
        return $http.get('http://localhost:8000/spatial_noise_sa')}
      };
  });

// Example:
// return $http.get('/spatial_noise_sa', {
//   type : 'getSource',
//   ID    : 'TP001'
// })};
