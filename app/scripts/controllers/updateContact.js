'use strict';

angular.module('avApp')
  .controller('UpdateContactCtrl', ['$scope', '$log', 'ServiceComponent',
    function ($scope, $log, ServiceComponent) {

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
            ServiceComponent.getServiceComponent(newValue.hsaId).then(function (result) {
              $scope.serviceComponent = _.cloneDeep(result);
            });
          } else {
            reset();
          }
        }
      );

      $scope.updateComponent = function() {
        console.log('updateComponent: ');
        console.log($scope.serviceComponent);
        ServiceComponent.updateServiceComponent($scope.serviceComponent);
      };

      var reset = function () {
        delete $scope.serviceComponent;
      };
    }
  ]
);
