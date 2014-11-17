'use strict';

/**
 * @ngdoc function
 * @name avApp.controller:AnslutCtrl
 * @description
 * # AnslutCtrl
 * Controller of the avApp
 */

angular.module('avApp')
  .controller('AnslutCtrl', ['$scope', 'ServiceDomain', 'ServiceContract', 'environments', 'rivtaVersions', function ($scope, ServiceDomain, ServiceContract, environments, rivtaVersions) {

    $scope.serviceComponents = [
      {name: 'Tjänsteproducent 1', hsaid: '1'},
      {name: 'Tjänsteproducent 2', hsaid: '2'},
      {name: 'Tjänsteproducent 3', hsaid: '3'},
      {name: 'asnsteproducent 2', hsaid: '4'},
      {name: 'sdteproducent 2', hsaid: '5'},
      {name: 'edefroducent 2', hsaid: '5'},
      {name: 'fsdsdsteproducent 2', hsaid: '6'},
      {name: 'dsdseproducent 2', hsaid: '7'},
      {name: 'dsdsnsteproducent 2', hsaid: '8'},];

    $scope.serviceComponent = {};

    //This is just mock code for now
    $scope.$watch('serviceComponent.selected', function(newValue, oldValue) {
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

    $scope.environments = environments;
    $scope.rivtaVersions = rivtaVersions;

    $scope.serviceDomains = {};

    $scope.environmentSelected = function() {
      if($scope.selectedEnvironment && $scope.serviceComponent.selected) {
        var serviceComponentId = $scope.serviceComponent.selected.hsaid;
        var environmentId = $scope.selectedEnvironment.id;
        ServiceDomain.listDomains(serviceComponentId, environmentId).then(function(domains){
          $scope.serviceDomains = domains;
        });
      }
    };

    $scope.serviceDomainSelected = function() {
      if($scope.selectedEnvironment && $scope.serviceComponent.selected && $scope.selectedServiceDomain) {
        var serviceComponentId = $scope.serviceComponent.selected.hsaid;
        var environmentId = $scope.selectedEnvironment.id;
        var serviceDomainId = $scope.selectedServiceDomain.id;
        ServiceContract.listContracts(serviceComponentId, environmentId, serviceDomainId).then(function(contracts){
          $scope.gridOptions.data = contracts;
        });
      }
    };

    /*
      Grid config
     */

    $scope.gridOptions = {
      enableRowSelection: true,
      enableSelectAll: true
    };

    $scope.gridOptions.columnDefs = [
      { name: 'Namn', field: 'kontrakt' },
      { name: 'version'}
    ];

    $scope.gridOptions.multiSelect = true;

    $scope.selectedServiceContracts = [];

    $scope.gridOptions.onRegisterApi = function(gridApi){
      //set gridApi on scope
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        updateSelectedServiceContracts(row);
      });

      gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
        _.forEach(rows, function(row) {
          updateSelectedServiceContracts(row);
        })
      });
    };

    function updateSelectedServiceContracts(row) {
      var where = { 'kontrakt': row.entity.kontrakt};
      if(row.isSelected && !_.find($scope.selectedServiceContracts, where)) {
        $scope.selectedServiceContracts.push(row.entity);
      } else if(!row.isSelected && _.find($scope.selectedServiceContracts, where)){
        _.remove($scope.selectedServiceContracts, where);
      }
    }
  }]);
