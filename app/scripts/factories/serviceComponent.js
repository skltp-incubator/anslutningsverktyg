'use strict';
angular.module('avApp')
  .factory('ServiceComponent', ['$q',
    function ($q) {

      var serviceComponents = [
        {name: 'Tjänsteproducent 1', hsaid: '1'},
        {name: 'Tjänsteproducent 2', hsaid: '2'},
        {name: 'Tjänsteproducent 3', hsaid: '3'},
        {name: 'asnsteproducent 2', hsaid: '4'},
        {name: 'sdteproducent 2', hsaid: '5'},
        {name: 'edefroducent 2', hsaid: '5'},
        {name: 'fsdsdsteproducent 2', hsaid: '6'},
        {name: 'dsdseproducent 2', hsaid: '7'},
        {name: 'dsdsnsteproducent 2', hsaid: '8'}];

      return {
        getFilteredServiceComponents: function (query) {
          console.log('getFilteredServiceComponents: ' + query);
          var lowerCaseQuery = query.toLowerCase();
          return _.filter(serviceComponents, function(serviceComponent) {
            return serviceComponent.name.toLowerCase().indexOf(lowerCaseQuery) == 0;
          });
        }
      };
    }]);
