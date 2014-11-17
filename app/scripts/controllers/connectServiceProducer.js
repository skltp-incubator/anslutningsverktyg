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

      $scope.selectedServiceContracts = [];

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
            $scope.gridOptions.data = contracts;
          });
        }
      };

      $scope.filterLogicalAddresses = function (logicalAddressQuery) {
        LogicalAddress.getFilteredLogicalAddresses(logicalAddressQuery).then(function (data) {
            $scope.filteredLogicalAddresses = data;
          }
        );
      };

      $scope.addFilteredLogicalAddressToTags = function () {
        var logicalAddress = $scope.selectedLogicalAddress.selected;
        var where = {id: logicalAddress.id};
        if(!_.find($scope.logicalAddresses, where)) {
          //Just pushing it did not previously exist
          $scope.logicalAddresses.push(logicalAddress);
        } else {
          $log.log("Can't add a tag twice");
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

      function updateSelectedServiceContracts(row) {
        $log.info(row);
        var where = {'id': row.entity.id};
        if (row.isSelected && !_.find($scope.selectedServiceContracts, where)) {
          $scope.selectedServiceContracts.push(row.entity);
        } else if (!row.isSelected && _.find($scope.selectedServiceContracts, where)) {
          _.remove($scope.selectedServiceContracts, where);
        }
        $scope.connectServiceProducerRequest.serviceContracts = $scope.selectedServiceContracts;
        $log.info($scope.selectedServiceContracts);
      }

      var reset = function () {
        $scope.selectedEnvironment = {};
        $scope.selectedServiceDomain = {};
        $scope.selectedLogicalAddress = {};
        $scope.connectServiceProducerRequest = {};
        $scope.gridOptions.data = [];
        $scope.selectedServiceContracts = [];
      };
    }
  ]
);
