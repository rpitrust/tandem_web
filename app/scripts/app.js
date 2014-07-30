'use strict';

var app = angular.module('TandemWeb', [
  'ngAnimate',
  'ngSanitize',
  'ngCookies',
  'ngRoute',
  'nvd3ChartDirectives',
  'checklist-model',
  'ui.bootstrap',
  'ui.select'
  ])

  .constant('version', 'v0.1.0')

  .config(function($httpProvider, $locationProvider, $routeProvider) {

    $locationProvider.html5Mode(false);

    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/logout', {
        template: '',
        controller: 'LogoutCtrl'
      })
      .when('/chart', {
        templateUrl: 'views/noise_vs_x.html',
        controller: 'NoiseVsXCtrl'
      })
      .otherwise({
        redirectTo: '/chart'
      });
  })

  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  });

