'use strict';

angular.module('TandemWeb')
  .factory('endpoints', function ($http) {
    return {
      getNoiseVsSa: function(type, agf, yAxis, trustUsed) {
        return $http.get(appSettings.HOST_NAME + '/spatial_noise_sa/', {
          params: { plot_factor: type,
                    agf: agf,
                    plot_y_axis: yAxis,
                    trust_used: trustUsed }
        })}
      };
  });
