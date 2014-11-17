'use strict';

angular.module('avApp')
  .factory('RivtaVersion', ['$q',
    function ($q) {
    return {
      getAvailableVersions: function() {
        var deferred = $q.defer();
        var data = [
          {
            id: "RIVTA_1_0"
          },
          {
            id: "RIVTA_1_1"
          },
          {
            id: "RIVTA_1_2"
          }
        ];
        deferred.resolve(data);
        return deferred.promise;
      }
    }
  }]);
