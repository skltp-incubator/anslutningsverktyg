'use strict';
angular.module('avApp')
  .factory('ServiceContract', ['$q',
    function ($q) {
    return {
      listContracts: function(serviceComponentId, environmentId, serviceDomainId) {
        console.log('serviceComponentId: ' + serviceComponentId + ', environmentId: ' + environmentId + ', serviceDomainId: ' + serviceDomainId);
        var deferred = $q.defer();
        var data = [
          {
            kontrakt: 'tjanstekontrakt1',
            version: 1
          },
          {
            kontrakt: 'tjanstekontrakt2',
            version: 1
          },
          {
            kontrakt: 'tjanstekontrakt3',
            version: 1
          }
        ];
        deferred.resolve(data);
        return deferred.promise;
      }
    };
  }]);
