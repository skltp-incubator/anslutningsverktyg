'use strict';

angular.module('services.config', [])
  .constant('configuration', {
    apiHost: '@@apiHost',
    apiToken: '@@apiToken',
    devDebug: '@@devDebug'
  });
