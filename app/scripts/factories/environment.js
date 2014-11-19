'use strict';

angular.module('avApp')
  .factory('Environment', ['$q',
    function ($q) {
    return {
      getAvailableEnvironments: function() {
        var deferred = $q.defer(); //forcing the use of a promise to set the interface for later
        var envs = [
          {
            id: 'Test',
            name: 'Test'
          },
          {
            id: 'QA',
            name: 'Quality Assurance (QA)'

          },
          {
            id: 'PROD',
            name: 'Production'
          }
        ];
        deferred.resolve(envs);
        return deferred.promise;
      }
    };
  }]);
