'use strict';

/**
 * @ngdoc function
 * @name avApp.controller:AnslutCtrl
 * @description
 * # AnslutCtrl
 * Controller of the avApp
 */

angular.module('avApp')
  .controller('ConnectServiceProducerCtrl', ['$rootScope', '$scope', '$log', 'ServiceDomain', 'ServiceContract', 'ServiceComponent', 'environments', 'rivtaVersions', 'LogicalAddress', 'configuration',
    function ($rootScope, $scope, $log, ServiceDomain, ServiceContract, ServiceComponent, environments, rivtaVersions, LogicalAddress, configuration) {
      $scope.environments = environments;
      $scope.rivtaVersions = rivtaVersions;
      console.log($scope.rivtaVersions);

      $scope.showDevStuff = configuration.devDebug;

      $scope.connectServiceProducerRequest = {
        serviceComponent: {},
        environment: {},
        serviceDomain: {},
        serviceContracts: [],
        serviceConsumer: {},
        slaFullfilled: false,
        otherInfo: '',
        client: {
          name: '',
          email: '',
          phone: ''
        }
      };

      $scope.selectedServiceComponent = {};
      $scope.filteredServiceComponents = [];

      $scope.selectedServiceConsumer = {};
      $scope.filteredServiceConsumers = [];

      $scope.serviceDomains = [];

      $scope.selectedEnvironment = {};
      $scope.selectedServiceDomain = {};

      $scope.selectedLogicalAddress = {};
      $scope.filteredLogicalAddresses = [];
      $scope.logicalAddresses = [];
      $scope.existingLogicalAddresses = [];
      $scope.selectedExistingLogicalAddresses = [];
      $scope.selectedServiceContracts = [];
      $scope.logicalAddressesForAllServiceContracts = [];

      $scope.linkLogicalAddressChoice = 'sameForAllContracts';

      $scope.requestForCallPermissionInSeparateOrder = true; //Default
      $scope.gridOptions = {
        enableRowSelection: true,
        enableSelectAll: true,
        multiSelect: true,
        columnDefs: [
          {name: 'Namn', field: 'getName()'},
          {name: 'version', field: 'getVersion()'}
        ],
        rowTemplate: 'templates/grid-row.html'
      };

      $scope.filterServiceComponents = function (query) {
        ServiceComponent.getFilteredServiceComponents(query).then(function (result) {
          $scope.filteredServiceComponents = result;
        });
      };

      $scope.filterServiceConsumers = function (query) {
        ServiceComponent.getFilteredServiceComponents(query).then(function (result) {
          //This line effectively removes, from the search result
          // the previously chosen service component
          if($scope.selectedServiceComponent.selected) {
            _.remove(result, {id: $scope.selectedServiceComponent.selected.id});
          }

          $scope.filteredServiceConsumers = result;
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

      $scope.onSelectServiceConsumer = function(item, model) {
        ServiceComponent.getServiceComponent(item.id).then(function (result) {
          $scope.connectServiceProducerRequest.serviceConsumer = result;
        });
      };

      $scope.requestForCallPermissionClicked = function() {
        //Reset stuff
        $scope.selectedServiceConsumer = {};
        $scope.connectServiceProducerRequest.serviceConsumer = {};
      };

      $scope.$watch('linkLogicalAddressChoice', function(newValue) {
        resetLogicalAddressesForServiceContracts();
        if(newValue === 'sourceSystemBased') {
          var logicalAddress = $scope.connectServiceProducerRequest.serviceComponent;
          $scope.logicalAddresses.push(logicalAddress);
          _addLogicalAddressToAllServiceContracts(logicalAddress);
        }
      });

      $scope.environmentSelected = function () {
        if ($scope.selectedEnvironment && $scope.connectServiceProducerRequest.serviceComponent) {
          resetContracts();
          $scope.connectServiceProducerRequest.environment = $scope.selectedEnvironment;
          ServiceDomain.listDomains().then(function (domains) {
            $scope.serviceDomains = domains;
          });
        }
      };

      $scope.serviceDomainSelected = function () {
        if ($scope.selectedEnvironment && $scope.connectServiceProducerRequest.serviceComponent && $scope.selectedServiceDomain) {
          resetContracts();
          var serviceComponentId = $scope.connectServiceProducerRequest.serviceComponent.hsaId;
          var environmentId = $scope.selectedEnvironment.id;
          var serviceDomainId = $scope.selectedServiceDomain.tjansteDomanId;
          $scope.connectServiceProducerRequest.serviceDomain = $scope.selectedServiceDomain;
          ServiceContract.listContracts(serviceComponentId, environmentId, serviceDomainId).then(function (contracts) {
            $scope.gridOptions.data = contracts;
            _.each($scope.gridOptions.data, function(contractData) { //ui-grid doesn't seem to support composite field values in any other way
              contractData.getVersion = function() {
                return this.majorVersion + '.' + this.minorVersion;
              };
              contractData.getName = function() {
                return this.namn + (this.installedInEnvironment ? ' (redan installerat)' : '');
              };
            });
          });
          LogicalAddress.getLogicalAddressesForEnvironmentAndServiceDomain(environmentId, serviceDomainId).then(function(logicalAddresses) {
            $scope.existingLogicalAddresses = logicalAddresses;
            console.log(logicalAddresses);
          });

        }
      };

      $scope.filterLogicalAddresses = function (logicalAddressQuery) {
        LogicalAddress.getFilteredLogicalAddresses(logicalAddressQuery).then(function (logicalAddresses) {
            $scope.filteredLogicalAddresses = logicalAddresses;
            console.log(logicalAddresses);

          }
        );
      };

      $scope.addFilteredLogicalAddressToAllServiceContracts = function () {
        var logicalAddress = $scope.selectedLogicalAddress.selected;
        var where = {hsaId: logicalAddress.hsaId};
        if (!_.find($scope.logicalAddresses, where)) {
          $scope.logicalAddresses.push(logicalAddress); //$scope.logicalAddresses is used to display the logical addresses in the tags-input
        } else {
          $log.log('Can\'t add a tag twice');
        }
        console.log('adding logical address to all service contracts');
        _addLogicalAddressToAllServiceContracts(logicalAddress);
      };

      $scope.addFilteredLogicalAddressToServiceContract = function (ngRepeatScope, serviceContract) {
        var logicalAddress = ngRepeatScope.selectedLogicalAddress;
        _addLogicalAddressToServiceContract(logicalAddress, serviceContract);
      };

      $scope.addSelectedExistingLogicalAddressesToAllServiceContracts = function() {
        _.each($scope.selectedExistingLogicalAddresses, function(logicalAddress) {
          if (!_.find($scope.logicalAddresses, {hsaId: logicalAddress.hsaId})) {
            $scope.logicalAddresses.push(logicalAddress); //$scope.logicalAddresses is used to display the logical addresses in the tags-input
          } else {
            $log.log('Can\'t add a tag twice');
          }
          _addLogicalAddressToAllServiceContracts(logicalAddress);
        });
      };

      $scope.addNewLogicalAddressForAllServiceContracts = function() {
          var logicalAddress = {
            hsaId: $scope.newLogicalAddressHSAID,
            namn: $scope.newLogicalAddressName
          };

          if (!_.find($scope.logicalAddresses, {hsaId: logicalAddress.hsaId})) {
            $scope.logicalAddresses.push(logicalAddress);
            _addLogicalAddressToAllServiceContracts(logicalAddress);
          } else {
            //TODO we should definitely validate here and give some useful response to the user
            $log.log('Can\'t add a tag twice');
          }

          //Reset the input fields again
          $scope.newLogicalAddressHSAID = null;
          $scope.newLogicalAddressName = null;

      };

      $scope.addNewLogicalAddressToServiceContract = function(ngRepeatScope, serviceContract) {
        var logicalAddress = {
          hsaId: ngRepeatScope.newLogicalAddressHSAID,
          namn: ngRepeatScope.newLogicalAddressName
        };

        _addLogicalAddressToServiceContract(logicalAddress, serviceContract);

        //Reset the input fields again
        ngRepeatScope.newLogicalAddressHSAID = null;
        ngRepeatScope.newLogicalAddressName = null;

      };

      $scope.addSelectedExistingLogicalAddressesToServiceContract = function(ngRepeatScope, serviceContract) {
        _.each(ngRepeatScope.selectedExistingLogicalAddresses, function(logicalAddress) {
          _addLogicalAddressToServiceContract(logicalAddress, serviceContract);
        });
      };

      $scope.addAllExistingLogicalAddressesToAllServiceContracts = function() {
        _.each($scope.existingLogicalAddresses, function(logicalAddress) {
          if (!_.find($scope.logicalAddresses, {hsaId: logicalAddress.hsaId})) {
            $scope.logicalAddresses.push(logicalAddress); //$scope.logicalAddresses is used to display the logical addresses in the tags-input
          } else {
            $log.log('Can\'t add a tag twice');
          }
          _addLogicalAddressToAllServiceContracts(logicalAddress);
        });
      };

      $scope.addAllExistingLogicalAddressesToServiceContract = function(serviceContract) {
        _.each($scope.existingLogicalAddresses, function(logicalAddress) {
          _addLogicalAddressToServiceContract(logicalAddress, serviceContract);
        });
      };

      $scope.removeLogicalAddressFromAllServiceContracts = function(tag) {
        var logicalAddressId = tag.hsaId;
        _.forEach($scope.connectServiceProducerRequest.serviceContracts, function(serviceContract) {
          if (angular.isDefined(serviceContract.logicalAddresses)) {
            _.remove(serviceContract.logicalAddresses, {hsaId: logicalAddressId});
          }
        });
      };

      $scope.removeLogicalAddressFromServiceContract = function(tag, serviceContract) {
        var logicalAddressId = tag.hsaId;
        if (angular.isDefined(serviceContract.logicalAddresses)) {
          _.remove(serviceContract.logicalAddresses, {hsaId: logicalAddressId});
        }

      };

      /*
       Grid config
       */

      $scope.gridOptions.onRegisterApi = function (gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          checkInstalledAndUpdate(gridApi, row);
        });

        gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
          _.forEach(rows, function (row) {
            checkInstalledAndUpdate(gridApi, row);
          });
        });
      };

      var checkInstalledAndUpdate = function(gridApi, row) {
        if (row.entity.installedInEnvironment) {
          gridApi.selection.unSelectRow(row.entity);
        } else {
          updateSelectedServiceContracts(row);
        }
      };

      var _addLogicalAddressToAllServiceContracts = function(logicalAddress) {
        _.forEach($scope.connectServiceProducerRequest.serviceContracts, function (serviceContract) {
          if (!angular.isDefined(serviceContract.logicalAddresses)) {
            serviceContract.logicalAddresses = [];
          }
          if (!_.find(serviceContract.logicalAddresses, {hsaId: logicalAddress.hsaId})) {
            serviceContract.logicalAddresses.push(logicalAddress);
          } else {
            $log.log('Can\'t add a tag twice');
          }
          if (!_.find($scope.logicalAddressesForAllServiceContracts, {hsaId: logicalAddress.hsaId})) {
            $scope.logicalAddressesForAllServiceContracts.push(logicalAddress);
          }
        });
      };

      var _addLogicalAddressToServiceContract = function(logicalAddress, serviceContract) {
        if (!angular.isDefined(serviceContract.logicalAddresses)) {
          serviceContract.logicalAddresses = [];
        }
        if (!_.find(serviceContract.logicalAddresses, {hsaId: logicalAddress.hsaId})) {
          serviceContract.logicalAddresses.push(logicalAddress);
        } else {
          $log.log('Can\'t add a tag twice');
        }
      };

      var updateSelectedServiceContracts = function (row) {
        var serviceContract = row.entity;
        var serviceContractIdentifier = {
          namnrymd: serviceContract.namnrymd,
          majorVersion: serviceContract.majorVersion,
          minorVersion: serviceContract.minorVersion
        };
        if (row.isSelected && !_.find($scope.selectedServiceContracts, serviceContractIdentifier)) {
          $scope.selectedServiceContracts.push(serviceContract);
          var newServiceContract = _getCleanServiceContract(serviceContract);
          if ($scope.linkLogicalAddressChoice === 'individualForContract' && $scope.logicalAddressesForAllServiceContracts) {
            newServiceContract.logicalAddresses = _.map($scope.logicalAddressesForAllServiceContracts, function(logicalAddress) {
              return _.clone(logicalAddress);
            });
          }
          $scope.connectServiceProducerRequest.serviceContracts.push(newServiceContract);
        } else if (!row.isSelected && _.find($scope.selectedServiceContracts, serviceContractIdentifier)) {
          _.remove($scope.selectedServiceContracts, serviceContractIdentifier);
          _.remove($scope.connectServiceProducerRequest.serviceContracts, serviceContractIdentifier);
        }
        $log.info($scope.selectedServiceContracts);
      };

      var _getCleanServiceContract = function(serviceContract) {
        return _.cloneDeep(serviceContract);
      };

      var reset = function () {
        $scope.selectedEnvironment = {};
        $scope.selectedServiceDomain = {};
        $scope.selectedLogicalAddress = {};
        $scope.connectServiceProducerRequest = {
          serviceComponent: {},
          environment: {},
          serviceDomain: {},
          serviceContracts: [],
          serviceConsumer: {},
          slaFullfilled: false,
          otherInfo: '',
          client: $scope.connectServiceProducerRequest.client //keep client info
        };
        $scope.gridOptions.data = [];
        $scope.selectedExistingLogicalAddresses = [];
        $scope.selectedServiceContracts = [];
        $scope.linkLogicalAddressChoice = 'sameForAllContracts';
        $scope.logicalAddressesForAllServiceContracts = [];
        $scope.selectedServiceConsumer = {};
        $scope.requestForCallPermissionInSeparateOrder = true;
      };

      var resetContracts = function() {
        $scope.gridOptions.data = [];
        $scope.selectedServiceContracts = [];
        $scope.connectServiceProducerRequest.serviceContracts = [];
      };

      var resetLogicalAddressesForServiceContracts = function() {
        $log.info('resetLogicalAddressesForServiceContracts()');
        _.forEach($scope.connectServiceProducerRequest.serviceContracts, function(serviceContract) {
          serviceContract.logicalAddresses = [];
        });
        $scope.logicalAddresses = [];
        $scope.logicalAddressesForAllServiceContracts = [];
      };
    }
  ]
);
