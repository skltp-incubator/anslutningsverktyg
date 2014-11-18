'use strict';
angular.module('avApp')
  .factory('LogicalAddress', ['$q', function ($q) {

    return {
      getFilteredLogicalAddresses: function(query) {
        var deferred = $q.defer();
        var data = [
          {
            id: 'hsaId1',
            name: 'Nässjö'
          },
          {
            id: 'hsaId2',
            name: 'Mölndal'
          },
          {
            id: 'hsaId3',
            name: 'Älvängen'
          }
        ];
        deferred.resolve(data);
        return deferred.promise;
      },
      getLogicalAddressesForServiceDomain: function(serviceDomainId) {
        console.log(serviceDomainId);
        var deferred = $q.defer();
        var data = [
          {
            "id": "hsaId9",
            "name": "Gnosjö"
          },
          {
            "id": "hsaId261",
            "name": "Landskrona"
          }
        ];
        deferred.resolve(data);
        return deferred.promise;
      }
    };
  }]);
