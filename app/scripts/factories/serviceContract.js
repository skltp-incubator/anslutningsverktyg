'use strict';
angular.module('avApp')
  .factory('ServiceContract', ['$q', '$http',
    function ($q, $http) {
    return {
      listContracts: function(serviceComponentId, environmentId, serviceDomainId) {
        console.log('serviceComponentId: ' + serviceComponentId + ', environmentId: ' + environmentId + ', serviceDomainId: ' + serviceDomainId);
        var deferred = $q.defer();
        $http.get('http://localhost:8080/anslutningsverktyg/api/serviceContracts', {
          params: {
            hsaId: serviceComponentId,
            environmentId: environmentId,
            serviceDomainId: serviceDomainId
          }
        }).success(function(data) {
          console.log(data);
          deferred.resolve(data);
        }).error(function(data, status, headers) { //TODO: handle errors
          deferred.reject();
        });
      }
    };
  }]);
