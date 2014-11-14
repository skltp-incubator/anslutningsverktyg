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
    $scope.tjansteProducenter = [
      {name: 'Tjänsteproducent 1'},
      {name: 'Tjänsteproducent 2'},
      {name: 'Tjänsteproducent 3'}];

    $scope.tjansteProducent = {};

    $scope.selectedProducent = null;

    $scope.$watch('selectedProducent', function(newValue, oldValue) {
        if(newValue && newValue.name === 'Tjänsteproducent 1' ) {
          $scope.tjansteProducent.huvudansvarig = {name: 'A Bsson', mail: 'email@email.se', phone: '192912912'};
          $scope.tjansteProducent.kontakt = {name: 'En kontakt', mail: 'email@email.se', phone: '192912912'};
          $scope.tjansteProducent.brevlada = {mail: 'funktion@email.se', phone: '192912912'};
          $scope.tjansteProducent.ovrigt = {ip: '127.0.0.1'};
        } else {
          $scope.tjansteProducent = {};
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
