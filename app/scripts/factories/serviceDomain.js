'use strict';
angular.module('avApp')
  .factory('ServiceDomain', function() {
    return {
      listDomains: function(serviceComponentId, environment, callback) {

        //Obiviously mocked data
        if(serviceComponentId == 1 && environment === 'QA') {
          callback([
            {name: 'A random servicedomain'},
            {name: 'Another random domain'}]);
        } else {
          callback([
            {name: 'Oasis is fantastic'},
            {name: 'Blur is so great'}
          ]);
        }
      }
    };
  });
