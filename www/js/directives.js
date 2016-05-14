angular.module('ionicApp.directives', ['ionic'])
.directive('fileOnTap', function($ionicGesture) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      $ionicGesture.on('tap', function(e) {
        $scope.$eval($attr.fileOnTap);
      }, $element);
    }
  };
})
.directive('fileOnHold', function($ionicGesture) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      $ionicGesture.on('hold', function(e) {
        $scope.$eval($attr.fileOnHold);
      }, $element);
    }
  };
});