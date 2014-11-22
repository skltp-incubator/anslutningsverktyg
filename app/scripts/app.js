'use strict';

/**
 * @ngdoc overview
 * @name anslutningsverktygetApp
 * @description
 * # anslutningsverktygetApp
 *
 * Main module of the application.
 */
angular
  .module('avApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ui.grid',
    'ui.grid.selection',
    'ui.select',
    'ngTagsInput'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    // Now set up the states
    $stateProvider
      .state('connectServiceProducer', {
        url: '/connectServiceProducer',
        templateUrl: 'views/serviceProducer/connect.html',
        controller: 'ConnectServiceProducerCtrl',
        resolve: {
          environments: ['Environment',
            function(EnvironmentFactory) {
              return EnvironmentFactory.getAvailableEnvironments();
            }],
          rivtaVersions: ['RivtaVersion',
            function(RivtaVersionFactory) {
              return RivtaVersionFactory.getAvailableVersions();
            }
          ]
        }
      });
  }])
  .config(['uiSelectConfig', function(uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
  }])
  .config(['tagsInputConfigProvider', function(tagsInputConfigProvider) {
    tagsInputConfigProvider
      .setDefaults('tagsInput', {
        placeholder: '',
        addOnEnter: true
      });
  }]).config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('SessionInterceptor');
  }])
  .value('config', {})
  .run(['Configuration','config', function(Configuration, config) {
    Configuration.getConfig().then(function(appConfig) {
      //Copy props to our value object;
      for(var propName in appConfig) {
        config[propName]=appConfig[propName];
      }
    });
  }]);
