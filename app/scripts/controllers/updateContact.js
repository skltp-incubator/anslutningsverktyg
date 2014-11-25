'use strict';

angular.module('avApp')
  .controller('UpdateContactCtrl', ['$scope', '$log', 'ServiceComponent',
    function ($scope, $log, ServiceComponent) {

      $scope.updateContactRequest = {
        serviceComponent: {}
      };

      $scope.selectedServiceComponent = {};
      $scope.filteredServiceComponents = [];

      $scope.filterServiceComponents = function (query) {
        ServiceComponent.getFilteredServiceComponents(query).then(function (result) {
          $scope.filteredServiceComponents = result;
        });
      };

      $scope.$watch('selectedServiceComponent.selected', function (newValue) {
          if (newValue) {
            reset();
            ServiceComponent.getServiceComponent(newValue.id).then(function (result) {
              $scope.updateContactRequest.serviceComponent = _.cloneDeep(result);
            });
          } else {
            reset();
          }
        }
      );

      var reset = function () {
        $scope.updateContactRequest = {
          serviceComponent: {}
        };
      };
    }
  ]
);
