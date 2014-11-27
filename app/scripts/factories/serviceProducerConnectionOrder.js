'use strict';
angular.module('avApp')
  .factory('ServiceProducerConnectionOrder', ['configuration', '$q', '$http',
    function (configuration, $q, $http) {
      return {
        createOrder: function (order) {
          var deferred = $q.defer();
          console.log(order);
          $http.post(configuration.apiHost + '/anslutningsplattform/api/serviceProducerConnectionOrders', order).success(function (data, status, headers) {
            deferred.resolve(response);
          }).error(function (data, status, headers) { //TODO: handle errors
            deferred.reject();
          });
          return deferred.promise;
        }
      };
    }]);
