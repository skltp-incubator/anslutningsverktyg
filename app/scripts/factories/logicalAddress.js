'use strict';
angular.module('avApp')
  .factory('LogicalAddress', ['$q', '$http', 'configuration',
    function ($q, $http, configuration) {
    return {
      getFilteredLogicalAddresses: function(query) {
        var deferred = $q.defer();
        console.log('getFilteredLogicalAddresses query[' + query + ']');
        if (query) {
          var lowerCaseQuery = query.toLowerCase();
          $http.get(configuration.apiHost + '/anslutningsplattform/api/logicalAddresses', {
            params: {
              query: lowerCaseQuery
            }
          }).success(function (data) {
            deferred.resolve(data);
          }).error(function (data, status, headers) { //TODO: error handling
            deferred.reject();
          });
        }
        return deferred.promise;
      },
      getLogicalAddressesForEnvironmentAndServiceDomain: function(environmentId, serviceDomainId) {
        var deferred = $q.defer();
        console.log('getLogicalAddressesForEnvironmentAndServiceDomain: environmentId[' + environmentId + '], serviceDomainId[' + serviceDomainId + ']');
        if (environmentId && serviceDomainId) {
          $http.get(configuration.apiHost + '/anslutningsplattform/api/logicalAddresses', {
            params: {
              environmentId: environmentId,
              serviceDomainId: serviceDomainId
            }
          }).success(function (data) {
            deferred.resolve(data);
          }).error(function (data, status, headers) { //TODO: error handling
            deferred.reject();
          });
        }
        return deferred.promise;
      }
    };
  }]);
