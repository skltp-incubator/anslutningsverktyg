'use strict';

/**
 * @ngdoc function
 * @name avApp.controller:AnslutCtrl
 * @description
 * # AnslutCtrl
 * Controller of the avApp
 */

angular.module('avApp')
  .controller('ConnectServiceProducerCtrl', ['$scope', '$log', 'ServiceDomain', 'ServiceContract', 'ServiceComponent', 'environments', 'rivtaVersions', 'LogicalAddress',
    function ($scope, $log, ServiceDomain, ServiceContract, ServiceComponent, environments, rivtaVersions, LogicalAddress) {

      $scope.environments = environments;
      $scope.rivtaVersions = rivtaVersions;

      $scope.connectServiceProducerRequest = {
        serviceComponent: {},
        environment: {},
        serviceDomain: {},
        serviceContracts: []
      };

      $scope.selectedServiceComponent = {};
      $scope.filteredServiceComponents = [];
      $scope.serviceDomains = [];

      $scope.selectedEnvironment = {};
      $scope.selectedServiceDomain = {};

      $scope.selectedLogicalAddress = {};
      $scope.filteredLogicalAddresses = [];
      $scope.logicalAddresses = [];
      $scope.existingLogicalAddresses = [];
      $scope.selectedServiceContracts = [];

      $scope.individualLogicalAddress = false;

      $scope.gridOptions = {
        enableRowSelection: true,
        enableSelectAll: true,
        multiSelect: true,
        columnDefs: [
          {name: 'Namn', field: 'name'},
          {name: 'version'}
        ]
      };

      $scope.filterServiceComponents = function (query) {
        ServiceComponent.getFilteredServiceComponents(query).then(function (result) {
          $scope.filteredServiceComponents = result;
        });
      };

      $scope.$watch('selectedServiceComponent.selected', function (newValue, oldValue) {
          if (newValue) {
            reset();
            $scope.connectServiceProducerRequest.serviceComponent = newValue;
          } else {
            reset();
          }
        }
      );

      $scope.environmentSelected = function () {
        if ($scope.selectedEnvironment && $scope.selectedServiceComponent.selected) {
          var serviceComponentId = $scope.selectedServiceComponent.selected.hsaid;
          var environmentId = $scope.selectedEnvironment.id;
          $scope.connectServiceProducerRequest.environment = $scope.selectedEnvironment;
          ServiceDomain.listDomains(serviceComponentId, environmentId).then(function (domains) {
            $scope.serviceDomains = domains;
          });
        }
      };

      $scope.serviceDomainSelected = function () {
        if ($scope.selectedEnvironment && $scope.selectedServiceComponent.selected && $scope.selectedServiceDomain) {
          var serviceComponentId = $scope.selectedServiceComponent.selected.hsaid;
          var environmentId = $scope.selectedEnvironment.id;
          var serviceDomainId = $scope.selectedServiceDomain.id;
          $scope.connectServiceProducerRequest.serviceDomain = $scope.selectedServiceDomain;
          ServiceContract.listContracts(serviceComponentId, environmentId, serviceDomainId).then(function (contracts) {
            $scope.existingLogicalAddresses = contracts.existingLogicalAddresses;
            $scope.gridOptions.data = contracts.serviceContracts;
          });
        }
      };

      $scope.filterLogicalAddresses = function (logicalAddressQuery) {
        LogicalAddress.getFilteredLogicalAddresses(logicalAddressQuery).then(function (data) {
            $scope.filteredLogicalAddresses = data;
          }
        );
      };

      $scope.addFilteredLogicalAddressToTags = function (serviceContractId) {
        var logicalAddress = $scope.selectedLogicalAddress.selected;
        var where = {id: logicalAddress.id};
        if (!_.find($scope.logicalAddresses, where)) {
          //Just pushing it did not previously exist
          $scope.logicalAddresses.push(logicalAddress);
        } else {
          $log.log("Can't add a tag twice");
        }
        if (!serviceContractId) { //add to all service contracts
          console.log('adding logical address to all service contracts');
          _.forEach($scope.connectServiceProducerRequest.serviceContracts, function(serviceContract) {
            if (!angular.isDefined(serviceContract.logicalAddresses)) {
              serviceContract.logicalAddresses = [];
            }
            if (!_.find(serviceContract.logicalAddresses, where)) {
              serviceContract.logicalAddresses.push(logicalAddress);
            } else {
              $log.log("Can't add a tag twice");
            }
          });


        } else { //add to specific service contracts
          console.log('adding logical address to service contract with id=' + serviceContractId);
          var serviceContract = _.find($scope.connectServiceProducerRequest.serviceContracts, {id: serviceContractId});
          if (!angular.isDefined(serviceContract.logicalAddresses)) {
            serviceContract.logicalAddresses = [];
          }
          if (!_.find(serviceContract.logicalAddresses, where)) {
            serviceContract.logicalAddresses.push(logicalAddress);
          } else {
            $log.log("Can't add a tag twice");
          }
        }
      };

      $scope.removeLogicalAddressFromAllServiceContracts = function(tag) {
        var logicalAddressId = tag.id;
        _.forEach($scope.connectServiceProducerRequest.serviceContracts, function(serviceContract) {
          if (angular.isDefined(serviceContract.logicalAddresses)) {
            _.remove(serviceContract.logicalAddresses, {id: logicalAddressId});
          }
        });
      };

      $scope.removeLogicalAddressFromServiceContract = function(tag, serviceContractId) {
        var logicalAddressId = tag.id;
        var serviceContract = _.find($scope.connectServiceProducerRequest.serviceContracts, {id: serviceContractId});
        if (angular.isDefined(serviceContract.logicalAddresses)) {
          _.remove(serviceContract.logicalAddresses, {id: logicalAddressId});
        }

      };

      /*
       Grid config
       */

      $scope.gridOptions.onRegisterApi = function (gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          updateSelectedServiceContracts(row);
        });

        gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
          _.forEach(rows, function (row) {
            updateSelectedServiceContracts(row);
          })
        });
      };

      var updateSelectedServiceContracts = function (row) {
        $log.info(row);
        var where = {'id': row.entity.id};
        if (row.isSelected && !_.find($scope.selectedServiceContracts, where)) {
          $scope.selectedServiceContracts.push(row.entity);
        } else if (!row.isSelected && _.find($scope.selectedServiceContracts, where)) {
          _.remove($scope.selectedServiceContracts, where);
        }
        $scope.connectServiceProducerRequest.serviceContracts = $scope.selectedServiceContracts;
        $log.info($scope.selectedServiceContracts);
      };

      var reset = function () {
        $scope.selectedEnvironment = {};
        $scope.selectedServiceDomain = {};
        $scope.selectedLogicalAddress = {};
        $scope.connectServiceProducerRequest = {};
        $scope.gridOptions.data = [];
        $scope.selectedServiceContracts = [];
        $scope.individualLogicalAddress = false;
      };
    }
  ]
);
