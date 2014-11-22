'use strict';

angular.module('avApp')
  .factory('SessionInterceptor', function () {
    var sessionInterceptor = {
      request: function (config) {
        config.headers = config.headers || {};
        config.headers['X-ap-auth'] = 'to_replaced_with_real_token';

        return config;
      }
    };

    return sessionInterceptor;
  });
