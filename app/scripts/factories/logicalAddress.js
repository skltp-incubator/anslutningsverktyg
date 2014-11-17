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
      }
    };
  }]);
