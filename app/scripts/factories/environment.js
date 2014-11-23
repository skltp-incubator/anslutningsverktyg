'use strict';

angular.module('avApp')
  .factory('Environment', ['$q', '$http', 'appConfig',
    function ($q, $http, appConfig) {
    return {
      getAvailableEnvironments: function() {
        var deferred = $q.defer(); //forcing the use of a promise to set the interface for later
        console.log('getAvailableEnvironments');
        $http.get(appConfig.apiHost + '/anslutningsplattform/api/environments').success(function(data) {
          deferred.resolve(data);
        }).error(function (data, status, headers) { //TODO: error handling
          deferred.reject();
        });
        return deferred.promise;
      }
    };
  }]);
