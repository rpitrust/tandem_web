'use strict';

angular.module('TandemWeb')

  .controller('UserCtrl', function($scope, $location, version) {

    $scope.$path = $location.path.bind($location);
    $scope.version = version;

  });
