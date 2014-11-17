'use strict';
angular.module('avApp')
  .factory('ServiceDomain', ['$q',
    function ($q) {
      var QA_DOMAINS = [
        {
          id: 'riv:domain:a',
          name: 'A random servicedomain'
        },
        {
          id: 'riv:domain:b',
          name: 'Another random domain'
        }
      ];

      var OTHER_DOMAINS = [
        {
          id: 'riv:domain:c',
          name: 'Oasis are fantastic'
        },
        {
          id: 'riv:domain:d',
          name: 'Blur are so great'
        }
      ];

      return {
        listDomains: function (serviceComponentId, environment) {
          console.log('serviceComponentId: ' + serviceComponentId + ', environment: ' + environment);
          var deferred = $q.defer();
          if (serviceComponentId == 1 && environment === 'QA') {
            deferred.resolve(QA_DOMAINS);
          } else {
            deferred.resolve(OTHER_DOMAINS);
          }
          return deferred.promise;
        }
      };
    }]);
