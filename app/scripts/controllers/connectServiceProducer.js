'use strict';

/**
 * @ngdoc function
 * @name avApp.controller:AnslutCtrl
 * @description
 * # AnslutCtrl
 * Controller of the avApp
 */

angular.module('avApp')
  .controller('ConnectServiceProducerCtrl', ['$rootScope', '$scope', '$log', 'ServiceDomain', 'ServiceContract', 'ServiceComponent', 'environments', 'rivtaVersions', 'LogicalAddress', 'Order', 'configuration', '$state',
    function ($rootScope, $scope, $log, ServiceDomain, ServiceContract, ServiceComponent, environments, rivtaVersions, LogicalAddress, Order, configuration, $state) {
      $scope.targetEnvironments = environments;
      $scope.rivtaVersions = rivtaVersions;
      console.log($scope.rivtaVersions);

      $scope.newComponent = false;

      $scope.showDevStuff = configuration.devDebug;

      $scope.connectServiceProducerRequest = {
        serviceComponent: {},
        targetEnvironment: {},
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

      $scope.selectedTargetEnvironment = {};
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
        rowTemplate: 'templates/ui-grid/connect-service-producer-grid-row.html'
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
            _.remove(result, {hsaId: $scope.selectedServiceComponent.selected.hsaId});
          }

          $scope.filteredServiceConsumers = result;
        });
      };

      $scope.$watch('newComponent', function() {
        resetServiceComponent();
      });

      $scope.$watch('selectedServiceComponent.selected', function (newValue) {
          if (newValue) {
            reset();
            console.log('new service component selected:');
            console.log(newValue);
            ServiceComponent.getServiceComponent(newValue.hsaId).then(function (result) {
              console.log(result);
              $scope.connectServiceProducerRequest.serviceComponent = result;
            });
          } else {
            reset();
          }
        }
      );

      $scope.onSelectServiceConsumer = function(item, model) {
        ServiceComponent.getServiceComponent(item.hsaId).then(function (result) {
          $scope.connectServiceProducerRequest.serviceConsumer = result;
        });
      };

      $scope.enableNewServiceProducer = function() {

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

      $scope.targetEnvironmentSelected = function () {
        if ($scope.selectedTargetEnvironment && $scope.connectServiceProducerRequest.serviceComponent) {
          resetContracts();
          $scope.connectServiceProducerRequest.targetEnvironment = $scope.selectedTargetEnvironment;
          ServiceDomain.listDomains().then(function (domains) {
            $scope.serviceDomains = domains;
          });
        }
      };

      $scope.serviceDomainSelected = function () {
        if ($scope.selectedTargetEnvironment && $scope.connectServiceProducerRequest.serviceComponent && $scope.selectedServiceDomain) {
          resetContracts();
          var serviceComponentId = $scope.connectServiceProducerRequest.serviceComponent.hsaId;
          var environmentId = $scope.selectedTargetEnvironment.id;
          var serviceDomainId = $scope.selectedServiceDomain.tjansteDomanId;
          $scope.connectServiceProducerRequest.serviceDomain = $scope.selectedServiceDomain;
          ServiceContract.listContracts(serviceComponentId, environmentId, serviceDomainId).then(function (contracts) {
            $scope.gridOptions.data = contracts;
            _.each($scope.gridOptions.data, function(contractData) { //ui-grid doesn't seem to support composite field values in any other way
              contractData.getVersion = function() {
                return this.majorVersion + '.' + this.minorVersion;
              };
              contractData.getName = function() {
                var statusText = '';
                if (!this.installedInEnvironment) {
                  statusText = ' (ej installerat)';
                } else if (this.installedForProducerHsaId) {
                  statusText = ' (redan ansluten)';
                }
                return this.namn + statusText;
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

      $scope.sendServiceProducerConnectionOrder = function() {
        if(!validateForms()) {
          //TODO Tell the user that there is something wron with the form
          console.log("Some form has an error");
        } else {
          Order.createServiceProducerConnectionOrder($scope.connectServiceProducerRequest).then(function(status) {
            console.log('Status: ' + status);
            if (status === 201) {
              console.log("Going to state");
              $state.go('serviceProducerOrderConfirmed');
            }
          });

        }
      };

      $scope.$watch('newComponent', function(newValue) {
        //Everytime this scope model changes
        //reset all validation in the page
        $scope.$broadcast('show-errors-reset');
      });
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
        if (!row.entity.installedInEnvironment || row.entity.installedForProducerHsaId) {
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
          if ($scope.linkLogicalAddressChoice !== 'individualForContract' && $scope.logicalAddressesForAllServiceContracts) {
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
        $scope.selectedTargetEnvironment = {};
        $scope.selectedServiceDomain = {};
        $scope.selectedLogicalAddress = {};
        $scope.connectServiceProducerRequest = {
          serviceComponent: {},
          targetEnvironment: {},
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
        $scope.logicalAddresses = []; //So we don't get any logical address lingering in the tags input

        //Reset all form validation that we might have done
        $scope.$broadcast('show-errors-reset');
      };

      var resetServiceComponent = function() {
        delete $scope.selectedServiceComponent.selected;
        $scope.connectServiceProducerRequest.serviceComponent = {};
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

      var validateForms = function() {
        $scope.$broadcast('show-errors-check-validity');

        //Get all divs with class form-group, since it is these that show the
        //has-success or has-error classes
        var formGroupElements = document.getElementsByClassName("form-group");

        return !_.any(formGroupElements, function(formGroup) {
            return angular.element(formGroup).hasClass('has-error');
          }
        );
      };
    }
  ]
);
