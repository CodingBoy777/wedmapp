angular.module('ionicApp.fileModalCtrl', ['ionic'])
.controller('fileModalCtrl', function ($scope, $rootScope, $cordovaToast, $cordovaFile, $cordovaVibration) {

  $scope.vibration = function(time) {
      $cordovaVibration.vibrate(time);
  };

  $scope.showToast = function(message) {
    	$cordovaToast.showShortBottom(message);
  };

  $scope.clearFileContent = function() {
      $scope.vibration(200);
      document.getElementById('fileTextarea').value = "";
  };

	$scope.resetFileContent = function() {
      $scope.vibration(200);
      document.getElementById('fileTextarea').value = $rootScope.fileContentUser;
  };

  $scope.saveFileContent = function(fileContentUser) {
      $cordovaFile.writeFile(cordova.file.externalRootDirectory + "aWEDM/files/", $rootScope.fileTitle, fileContentUser, true)
          .then(function (success) {
              // alert('成功写入filelist.json文件到' + cordova.file.externalRootDirectory + "aWEDM/data/" + '路径下');
              $scope.showToast($rootScope.fileTitle + '文件已保存');
              // alert(fileContentUser);
          }, function (error) {
              alert(JSON.stringify(error));
          });
  };
  
});