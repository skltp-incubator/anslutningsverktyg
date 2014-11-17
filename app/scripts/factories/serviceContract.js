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
            id: 'serviceContract1',
            name: 'tjanstekontrakt1',
            version: 1
          },
          {
            id: 'serviceContract2',
            name: 'tjanstekontrakt2',
            version: 1
          },
          {
            id: 'serviceContract3',
            name: 'tjanstekontrakt3',
            version: 1
          }
        ];
        deferred.resolve(data);
        return deferred.promise;
      }
    };
  }]);
