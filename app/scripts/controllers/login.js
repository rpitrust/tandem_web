'use strict';

angular.module('TandemWeb')

  .controller('LoginCtrl', ['$scope', '$location', '$http', '$window', 'version', '$alert',
    function($scope, $location, $http, $window, $alert, version) {

      $scope.credentials = {};
      $scope.$path = $location.path.bind($location);
      $scope.version = version;

      $scope.login = function() {
        var data = {username: $scope.credentials.username,
                    password: $scope.credentials.password};

        $http({method: 'POST',
               url: 'http://localhost:8000/api-token-auth/',
               data: data})

        .success(function(data, status, headers, config) {
          $window.sessionStorage.token = data['token'];
          $scope.$parent.loggedIn = true;
          $location.path('/');
        })

        .error(function(data, status, headers, config) {
          delete $window.sessionStorage.token;
  $scope.alerts = [
    {
  "type": "info",
  "title": "Holy guacamole!",
    "content": "Best check yo self, you're not looking too good.<br>"
    }
  ]
          $scope.$parent.loggedIn = false;
        });
      }

      $scope.logout = function() {
        delete $window.sessionStorage.token;
      }

    }]);
