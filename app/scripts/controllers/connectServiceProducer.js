'use strict';

/**
 * @ngdoc function
 * @name avApp.controller:AnslutCtrl
 * @description
 * # AnslutCtrl
 * Controller of the avApp
 */

angular.module('avApp')
  .controller('ConnectServiceProducerCtrl', ['$scope', '$log', 'ServiceDomain', 'ServiceContract', 'ServiceComponent', 'environments', 'rivtaVersions', function ($scope, $log, ServiceDomain, ServiceContract, ServiceComponent, environments, rivtaVersions) {

    $scope.connectServiceProducerRequest = {
      serviceComponent: {},
      environment: {},
      serviceDomain: {},
      serviceContracts: []
    };

    $scope.filteredServiceComponents = [];

    $scope.filterServiceComponents = function(query) {

      //$scope.filteredServiceComponents = _.filter(serviceComponents, function(serviceComponent) {
      //  return serviceComponent.name.toLowerCase().indexOf(lowerCaseQuery) == 0;
      //});

      $scope.filteredServiceComponents = ServiceComponent.getFilteredServiceComponents(query);
    };

    $scope.serviceComponent = {};

    //This is just mock code for now
    $scope.$watch('serviceComponent.selected', function(newValue, oldValue) {
        if(newValue && newValue.name === 'Tjänsteproducent 1' ) {
          $scope.serviceComponent.huvudansvarig = {name: 'A Bsson', mail: 'email@email.se', phone: '192912912'};
          $scope.connectServiceProducerRequest.serviceComponent.huvudansvarig = {name: 'A Bsson', mail: 'email@email.se', phone: '192912912'};
          $scope.serviceComponent.kontakt = {name: 'En kontakt', mail: 'email@email.se', phone: '192912912'};
          $scope.connectServiceProducerRequest.serviceComponent.kontakt = {name: 'En kontakt', mail: 'email@email.se', phone: '192912912'};
          $scope.serviceComponent.brevlada = {mail: 'funktion@email.se', phone: '192912912'};
          $scope.connectServiceProducerRequest.serviceComponent.brevlada = {mail: 'funktion@email.se', phone: '192912912'};
          $scope.serviceComponent.ovrigt = {ip: '127.0.0.1'};
          $scope.connectServiceProducerRequest.serviceComponent.ovrigt = {ip: '127.0.0.1'};
        } else {
          $scope.serviceComponent = {};
          $scope.connectServiceProducerRequest.serviceComponent = {};
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
        $scope.connectServiceProducerRequest.environment = $scope.selectedEnvironment;
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
        $scope.connectServiceProducerRequest.serviceDomain = $scope.selectedServiceDomain;
        ServiceContract.listContracts(serviceComponentId, environmentId, serviceDomainId).then(function(contracts){
          $scope.gridOptions.data = contracts;
        });
      }
    };

    $scope.logicalAddress = {};

    $scope.logicalAddresses = [];
    $scope.refreshLogicalAddresses = function(logicalAddress) {
      //Implement this properly
      console.log("Searching for logical addresses");
      $scope.logicalAddresses = [{name: "dummy data"}];
    };
    /*
      Grid config
     */

    $scope.gridOptions = {
      enableRowSelection: true,
      enableSelectAll: true
    };

    $scope.gridOptions.columnDefs = [
      { name: 'Namn', field: 'name' },
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
      $log.info(row);
      var where = { 'id': row.entity.id};
      if(row.isSelected && !_.find($scope.selectedServiceContracts, where)) {
        $scope.selectedServiceContracts.push(row.entity);
      } else if(!row.isSelected && _.find($scope.selectedServiceContracts, where)){
        _.remove($scope.selectedServiceContracts, where);
      }
      $scope.connectServiceProducerRequest.serviceContracts = $scope.selectedServiceContracts;
      $log.info($scope.selectedServiceContracts);
    }
  }]);
