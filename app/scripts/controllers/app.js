'use strict';

angular.module('TandemWeb')

  .controller('AppCtrl', ['$scope', '$location', '$window', 'version',
    function($scope, $location, $window, version) {

    $scope.$path = $location.path.bind($location);
    $scope.version = version;

    $scope.loggedIn = !!($window.sessionStorage.token);

  }]);
