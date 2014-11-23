'use strict';

angular.module('avApp')
  .factory('SessionInterceptor', ['appConfig', function (appConfig) {
    var sessionInterceptor = {
      request: function (config) {
        config.headers = config.headers || {};
        config.headers['X-ap-auth'] = appConfig.apiToken;
        return config;
      }
    };

    return sessionInterceptor;
  }]);
