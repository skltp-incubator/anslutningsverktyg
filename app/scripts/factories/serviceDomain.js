'use strict';
angular.module('avApp')
  .factory('ServiceDomain', ['$q', '$http', 'configuration',
    function ($q, $http, configuration) {
      return {
        listDomains: function (serviceComponentHsaId) {
          console.log('listDomains');
          var deferred = $q.defer();
          $http.get(configuration.apiHost + '/anslutningsplattform/api/serviceDomains').success(function(data) {
            console.log(data);
            deferred.resolve(data);
          }).error(function(data, status, headers) { //TODO: handle errors
            deferred.reject();
          });
          return deferred.promise;
        }
      };
    }]);
