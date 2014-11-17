'use strict';

angular.module('avApp')
  .factory('RivtaVersion', ['$q',
    function ($q) {
    return {
      getAvailableVersions: function() {
        var deferred = $q.defer();
        var data = [
          {
            id: "RIVTA_1_0",
            name: "RIVTA 1.0"
          },
          {
            id: "RIVTA_1_1",
            name: "RIVTA 1.1"
          },
          {
            id: "RIVTA_1_2",
            name: "RIVTA 1.2"
          },
          {
            id: "RIVTA_2_0",
            name: "RIVTA 2.0"
          },
          {
            id: "RIVTA_2_1",
            name: "RIVTA 2.1"
          }
        ];
        deferred.resolve(data);
        return deferred.promise;
      }
    }
  }]);
