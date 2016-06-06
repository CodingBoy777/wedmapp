angular.module('ionicApp.uiSettingCtrl', ['ionic'])
	.controller('uiSettingCtrl', function($scope, $cordovaStatusbar) {
		$scope.statusBarChange = function() {
			if ($cordovaStatusbar.isVisible()) {
        $cordovaStatusbar.hide();//如果显示则隐藏
      } else {
        $cordovaStatusbar.show();//如果隐藏则显示
      }
		};

	});