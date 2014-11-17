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
      ServiceComponent.getFilteredServiceComponents(query).then(function(result) {
        $scope.filteredServiceComponents = result;
      });
    };

    $scope.selectedServiceComponent = {};

    //This is just mock code for now
    $scope.$watch('selectedServiceComponent.selected', function(newValue, oldValue) {
        if (newValue) {
          console.log(newValue);
          $scope.connectServiceProducerRequest = {}; //reset everything when select new service component
          $scope.connectServiceProducerRequest.serviceComponent = newValue;
          reset();
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
      if($scope.selectedEnvironment && $scope.selectedServiceComponent.selected) {
        var serviceComponentId = $scope.selectedServiceComponent.selected.hsaid;
        var environmentId = $scope.selectedEnvironment.id;
        $scope.connectServiceProducerRequest.environment = $scope.selectedEnvironment;
        ServiceDomain.listDomains(serviceComponentId, environmentId).then(function(domains){
          $scope.serviceDomains = domains;
        });
      }
    };

    $scope.serviceDomainSelected = function() {
      if($scope.selectedEnvironment && $scope.selectedServiceComponent.selected && $scope.selectedServiceDomain) {
        var serviceComponentId = $scope.selectedServiceComponent.selected.hsaid;
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

    var reset = function() {
      delete $scope.selectedEnvironment;
      delete $scope.selectedServiceDomain;
      $scope.gridOptions.data = [];
      $scope.selectedServiceContracts = [];
    };
  }]);
