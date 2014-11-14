'use strict';

/**
 * @ngdoc function
 * @name avApp.controller:AnslutCtrl
 * @description
 * # AnslutCtrl
 * Controller of the avApp
 */

angular.module('avApp')
  .controller('AnslutCtrl', ['$scope', function ($scope) {
    $scope.serviceComponents = [
      {name: 'Tjänsteproducent 1'},
      {name: 'Tjänsteproducent 2'},
      {name: 'Tjänsteproducent 3'},
      {name: 'asnsteproducent 2'},
      {name: 'sdteproducent 2'},
      {name: 'edefroducent 2'},
      {name: 'fsdsdsteproducent 2'},
      {name: 'dsdseproducent 2'},
      {name: 'dsdsnsteproducent 2'},];

    $scope.serviceComponent = {};

    $scope.$watch('serviceComponent.selected', function(newValue, oldValue) {
        console.log("In here");
        console.log(newValue);
        if(newValue && newValue.name === 'Tjänsteproducent 1' ) {
          $scope.serviceComponent.huvudansvarig = {name: 'A Bsson', mail: 'email@email.se', phone: '192912912'};
          $scope.serviceComponent.kontakt = {name: 'En kontakt', mail: 'email@email.se', phone: '192912912'};
          $scope.serviceComponent.brevlada = {mail: 'funktion@email.se', phone: '192912912'};
          $scope.serviceComponent.ovrigt = {ip: '127.0.0.1'};
        } else {
          $scope.serviceComponent = {};
        }
      }
    );

    $scope.environments = [
      {name: 'Produktion'},
      {name: 'QA'},
      {name: 'Test'}];


    /*
      Grid
     */

    $scope.gridOptions = {
      enableRowSelection: true,
      enableSelectAll: true
    };

    $scope.gridOptions.columnDefs = [
      { name: 'Tjänstekontrakt', field: 'kontrakt' },
      { name: 'version'}
    ];

    $scope.gridOptions.multiSelect = true;
    $scope.gridOptions.data = [{'kontrakt': 'tjanstekontrakt1', version: 1},
      {'kontrakt': 'tjanstekontrakt2', version: 1},
      {'kontrakt': 'tjanstekontrakt3', version: 1}];
  }]);
