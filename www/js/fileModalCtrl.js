angular.module('ionicApp.fileModalCtrl', ['ionic'])
.controller('fileModalCtrl', function ($scope, $rootScope, $cordovaToast, $cordovaFile) {
  /*
  fileModal.html的cache已禁用（在app.js里设置），即每次看到fileModal.html都是重新加载的。
  在textarea编辑后，$rootScope.fileContentUser的值并不改变（尽管ng-model="fileContentUser"），
  但fileModal.html上的fileContentUser是改变的。
  画图需要获取textarea编辑后的值，用带参数的函数，像下面的$scope.saveFileContent(fileContentUser)。
  $rootScope.fileContentUser和fileModal.html上的fileContentUser的类型都是String，换行是\r\n。
  */
  $scope.showToast = function(message) {
    	$cordovaToast.showShortBottom(message);
  };

  $scope.clearFileContent = function() {
      document.getElementById('fileTextarea').value = "";
  };

	$scope.resetFileContent = function() {
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