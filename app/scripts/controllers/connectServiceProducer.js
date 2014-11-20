'use strict';

/**
 * @ngdoc function
 * @name avApp.controller:AnslutCtrl
 * @description
 * # AnslutCtrl
 * Controller of the avApp
 */

angular.module('avApp')
  .controller('ConnectServiceProducerCtrl', ['$rootScope', '$scope', '$log', 'ServiceDomain', 'ServiceContract', 'ServiceComponent', 'environments', 'rivtaVersions', 'LogicalAddress',
    function ($rootScope, $scope, $log, ServiceDomain, ServiceContract, ServiceComponent, environments, rivtaVersions, LogicalAddress) {
      $scope.environments = environments;
      $scope.rivtaVersions = rivtaVersions;

      $scope.showDevStuff = false;

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
      $scope.selectedExistingLogicalAddresses = [];
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

      $scope.$watch('selectedServiceComponent.selected', function (newValue) {
          if (newValue) {
            reset();
            console.log('new service component selected:');
            console.log(newValue);
            ServiceComponent.getServiceComponent(newValue.id).then(function (result) {
              console.log(result);
              $scope.connectServiceProducerRequest.serviceComponent = result;
            });
          } else {
            reset();
          }
        }
      );

      $scope.$watch('individualLogicalAddress', function() {
        resetLogicalAddressesForServiceContracts();
      });

      $scope.environmentSelected = function () {
        if ($scope.selectedEnvironment && $scope.connectServiceProducerRequest.serviceComponent) {
          var serviceComponentId = $scope.connectServiceProducerRequest.serviceComponent.hsaId;
          var environmentId = $scope.selectedEnvironment.id;
          $scope.connectServiceProducerRequest.environment = $scope.selectedEnvironment;
          ServiceDomain.listDomains(serviceComponentId, environmentId).then(function (domains) {
            $scope.serviceDomains = domains;
          });
        }
      };

      $scope.serviceDomainSelected = function () {
        if ($scope.selectedEnvironment && $scope.connectServiceProducerRequest.serviceComponent && $scope.selectedServiceDomain) {
          var serviceComponentId = $scope.connectServiceProducerRequest.serviceComponent.hsaId;
          var environmentId = $scope.selectedEnvironment.id;
          var serviceDomainId = $scope.selectedServiceDomain.id;
          $scope.connectServiceProducerRequest.serviceDomain = $scope.selectedServiceDomain;
          ServiceContract.listContracts(serviceComponentId, environmentId, serviceDomainId).then(function (contracts) {
            //$scope.existingLogicalAddresses = contracts.existingLogicalAddresses;
            $scope.gridOptions.data = contracts.serviceContracts;
          });
          LogicalAddress.getLogicalAddressesForServiceDomain(serviceDomainId).then(function(logicalAddresses) {
            $scope.existingLogicalAddresses = logicalAddresses;
          });

        }
      };

      $scope.filterLogicalAddresses = function (logicalAddressQuery) {
        LogicalAddress.getFilteredLogicalAddresses(logicalAddressQuery).then(function (data) {
            $scope.filteredLogicalAddresses = data;
          }
        );
      };

      $scope.addFilteredLogicalAddressToAllServiceContracts = function () {
        var logicalAddress = $scope.selectedLogicalAddress.selected;
        var where = {id: logicalAddress.id};
        if (!_.find($scope.logicalAddresses, where)) {
          $scope.logicalAddresses.push(logicalAddress); //$scope.logicalAddresses is used to display the logical addresses in the tags-input
        } else {
          $log.log('Can\'t add a tag twice');
        }
        console.log('adding logical address to all service contracts');
        _.forEach($scope.connectServiceProducerRequest.serviceContracts, function (serviceContract) {
          if (!angular.isDefined(serviceContract.logicalAddresses)) {
            serviceContract.logicalAddresses = [];
          }
          if (!_.find(serviceContract.logicalAddresses, where)) {
            serviceContract.logicalAddresses.push(logicalAddress);
          } else {
            $log.log('Can\'t add a tag twice');
          }
        });
      };

      $scope.addFilteredLogicalAddressToServiceContract = function (ngRepeatScope, serviceContractId) {
        var logicalAddress = ngRepeatScope.selectedLogicalAddress;
        console.log('adding logical address to service contract with id=' + serviceContractId);
        var serviceContract = _.find($scope.connectServiceProducerRequest.serviceContracts, {id: serviceContractId});
        if (!angular.isDefined(serviceContract.logicalAddresses)) {
          serviceContract.logicalAddresses = [];
        }
        if (!_.find(serviceContract.logicalAddresses, {id: logicalAddress.id})) {
          serviceContract.logicalAddresses.push(logicalAddress);
        } else {
          $log.log('Can\'t add a tag twice');
        }
      };

      $scope.addSelectedExistingLogicalAddressesToAllServiceContracts = function() {
        _.each($scope.selectedExistingLogicalAddresses, function(logicalAddress) {
          if (!_.find($scope.logicalAddresses, {id: logicalAddress.id})) {
            $scope.logicalAddresses.push(logicalAddress); //$scope.logicalAddresses is used to display the logical addresses in the tags-input
          } else {
            $log.log('Can\'t add a tag twice');
          }
          _addLogicalAddressToAllServiceContracts(logicalAddress);
        });
      };

      $scope.addSelectedExistingLogicalAddressesToServiceContract = function(ngRepeatScope, serviceContractId) {
        _.each(ngRepeatScope.selectedExistingLogicalAddresses, function(logicalAddress) {
          _addLogicalAddressToServiceContract(logicalAddress, serviceContractId);
        });
      };

      $scope.addAllExistingLogicalAddressesToAllServiceContracts = function() {
        _.each($scope.existingLogicalAddresses, function(logicalAddress) {
          if (!_.find($scope.logicalAddresses, {id: logicalAddress.id})) {
            $scope.logicalAddresses.push(logicalAddress); //$scope.logicalAddresses is used to display the logical addresses in the tags-input
          } else {
            $log.log('Can\'t add a tag twice');
          }
          _addLogicalAddressToAllServiceContracts(logicalAddress);
        });
      };

      $scope.addAllExistingLogicalAddressesToServiceContract = function(serviceContractId) {
        _.each($scope.existingLogicalAddresses, function(logicalAddress) {
          _addLogicalAddressToServiceContract(logicalAddress, serviceContractId);
        });
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
          });
        });
      };

      var _addLogicalAddressToAllServiceContracts = function(logicalAddress) {
        _.forEach($scope.connectServiceProducerRequest.serviceContracts, function (serviceContract) {
          if (!angular.isDefined(serviceContract.logicalAddresses)) {
            serviceContract.logicalAddresses = [];
          }
          if (!_.find(serviceContract.logicalAddresses, {id: logicalAddress.id})) {
            serviceContract.logicalAddresses.push(logicalAddress);
          } else {
            $log.log('Can\'t add a tag twice');
          }
        });
      };

      var _addLogicalAddressToServiceContract = function(logicalAddress, serviceContractId) {
        var serviceContract = _.find($scope.connectServiceProducerRequest.serviceContracts, {id: serviceContractId});
        if (!angular.isDefined(serviceContract.logicalAddresses)) {
          serviceContract.logicalAddresses = [];
        }
        if (!_.find(serviceContract.logicalAddresses, {id: logicalAddress.id})) {
          serviceContract.logicalAddresses.push(logicalAddress);
        } else {
          $log.log('Can\'t add a tag twice');
        }
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
        $scope.selectedExistingLogicalAddresses = [];
        $scope.selectedServiceContracts = [];
        $scope.individualLogicalAddress = false;
      };

      var resetLogicalAddressesForServiceContracts = function() {
        $log.info('resetLogicalAddressesForServiceContracts()');
        _.forEach($scope.connectServiceProducerRequest.serviceContracts, function(serviceContract) {
          serviceContract.logicalAddresses = [];
        });
        $scope.logicalAddresses = [];
      };
    }
  ]
);
