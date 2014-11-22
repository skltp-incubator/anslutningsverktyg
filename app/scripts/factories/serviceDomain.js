'use strict';
angular.module('avApp')
  .factory('ServiceDomain', ['$q', '$http', 'config',
    function ($q, $http, config) {
      return {
        listDomains: function (serviceComponentHsaId, environmentId) {
          console.log('listDomains: serviceComponentHsaId[' + serviceComponentHsaId + '], environmentId[' + environmentId + ']');
          var deferred = $q.defer();
          $http.get(config.apiHost + '/anslutningsplattform/api/serviceDomains', {
            params: {
              hsaId: serviceComponentHsaId,
              environmentId: environmentId
            }
          }).success(function(data) {
            console.log(data);
            deferred.resolve(data);
          }).error(function(data, status, headers) { //TODO: handle errors
            deferred.reject();
          });
          return deferred.promise;
        }
      };
    }]);
