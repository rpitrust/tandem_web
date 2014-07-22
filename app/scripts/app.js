'use strict';

var app = angular.module('TandemWeb', [
  'ngAnimate',
  'ngSanitize',
  'ngCookies',
  'ngRoute',
  'restangular',
  'nvd3ChartDirectives',
  // 'angularCharts',
  'checklist-model',
  'ui.bootstrap',
  'ui.select'
  ])

  .constant('version', 'v0.1.0')

  .config(function($httpProvider, $locationProvider, $routeProvider, RestangularProvider) {

    $locationProvider.html5Mode(false);

    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/chart', {
        // templateUrl: 'views/noise_sa_main.html',
        templateUrl: 'views/nvd3.html',
        controller: 'NoiseSaCtrl'
      })
      .when('/logout', {
        template: '',
        controller: 'LogoutCtrl'
      })
      .when('/features', {
        templateUrl: 'views/features.html'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

      RestangularProvider.setBaseUrl('http://localhost:8000/api/v1')
  })

  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  });

