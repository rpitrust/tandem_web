'use strict';

angular.module('TandemWeb')

  .controller('HeaderCtrl', ['$scope', '$location', function($scope, $location) {

    $scope.isActive = function (viewLocation) {
        return $location.path().indexOf(viewLocation) == 0;
    };

  }]);
