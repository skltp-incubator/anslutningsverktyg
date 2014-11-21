'use strict';

angular.module('avApp')
  .factory('Configuration', ['$http', '$q', function($http, $q) {
    function getConfig() {
      var deferred = $q.defer();
      $http.get('/config.json').success(function(data) {
        deferred.resolve(data);
      }).error(function(data, status, headers) { //TODO: handle errors
        deferred.reject();
      });
      return deferred.promise;
    }

    return {
      getConfig: getConfig
    };

  }]);

