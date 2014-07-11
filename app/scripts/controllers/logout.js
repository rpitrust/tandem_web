'use strict';

angular.module('TandemWeb')
  .controller('LogoutCtrl', ['$scope', '$location', '$window',
    function($scope, $location, $window) {
      delete $window.sessionStorage.token;
      $scope.$parent.loggedIn = false;
      $location.path('/');
    }
  ]);
