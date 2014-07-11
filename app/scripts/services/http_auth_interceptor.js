'use strict';

angular.module('TandemWeb')
  .factory('AuthInterceptor', function ($window, $q) {
      return {
          request: function(config) {
              config.headers = config.headers || {};
              if ($window.sessionStorage.getItem('token')) {
                  config.headers.Authorization = 'Token ' + $window.sessionStorage.getItem('token');
              }
              return config || $q.when(config);
          },
          response: function(response) {
              if (response.status === 401) {
                  // TODO: Redirect user to login page.
              }
              return response || $q.when(response);
          }
      };
  });
