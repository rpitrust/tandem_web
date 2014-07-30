'use strict';

angular.module('TandemWeb')

  .controller('LoginCtrl', ['$scope', '$location', '$http', '$window',
    function($scope, $location, $http, $window) {

      $scope.credentials = {};

      $scope.login = function() {
        var data = {username: $scope.credentials.username,
                    password: $scope.credentials.password};

        $http({method: 'POST',
               url: appSettings.HOST_NAME + '/api-token-auth/',
               data: data})

        .success(function(data, status, headers, config) {
          $window.sessionStorage.token = data['token'];
          $scope.$parent.loggedIn = true;
          $location.path('/chart');
        })

        .error(function(data, status, headers, config) {
          console.log(data);
          delete $window.sessionStorage.token;

          $scope.$parent.loggedIn = false;
        });
      }

      $scope.logout = function() {
        delete $window.sessionStorage.token;
        $scope.$parent.loggedIn = false;
      }

    }]);
