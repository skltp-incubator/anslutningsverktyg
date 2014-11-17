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
  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    // Now set up the states
    $stateProvider
      .state('anslut', {
        url: '/anslut',
        templateUrl: 'views/tjansteproducent/anslut.html',
        controller: 'AnslutCtrl',
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
  })
  .config(function(uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
  })
  .config(function(tagsInputConfigProvider) {
    tagsInputConfigProvider
      .setDefaults('tagsInput', {
        placeholder: '',
        addOnEnter: true
      });
  });
