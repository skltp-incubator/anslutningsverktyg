'use strict';
angular.module('avApp')
  .factory('ServiceContract', ['$q', '$http', 'config',
    function ($q, $http, config) {
    return {
      listContracts: function(serviceComponentId, environmentId, serviceDomainId) {
        console.log('serviceComponentId: ' + serviceComponentId + ', environmentId: ' + environmentId + ', serviceDomainId: ' + serviceDomainId);
        var deferred = $q.defer();
        $http.get(config.apiHost + '/anslutningsplattform/api/serviceContracts', {
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
        return deferred.promise;
      }
    };
  }]);
