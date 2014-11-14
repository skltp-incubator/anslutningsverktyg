'use strict';
angular.module('avApp')
  .factory('ServiceContract', function () {
    return {
      listContracts: function(serviceComponentId, environment, serviceDomain, callback) {
        var data = [{'kontrakt': 'tjanstekontrakt1', version: 1},
          {'kontrakt': 'tjanstekontrakt2', version: 1},
          {'kontrakt': 'tjanstekontrakt3', version: 1}];

        callback(data);
      }
    };
  });
