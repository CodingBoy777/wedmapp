angular.module('ionicApp.fileModalCtrl', ['ionic'])
  .controller('fileModalCtrl', function ($scope, $rootScope, $cordovaToast, $cordovaFile, $cordovaVibration,$state,$timeout) {

    $scope.vibration = function (time) {
      $cordovaVibration.vibrate(time);
    };

    $scope.showToast = function (message) {
      $cordovaToast.showShortBottom(message);
    };

    $scope.clearFileContent = function () {
      $scope.vibration(200);
      document.getElementById('fileTextarea').value = "";
    };

    $scope.resetFileContent = function () {
      $scope.vibration(200);
      document.getElementById('fileTextarea').value = $rootScope.fileContentUser;
    };

    $scope.saveFileContent = function (fileContentUser) {
      $cordovaFile.writeFile(cordova.file.externalRootDirectory + "aWEDM/files/", $rootScope.fileTitle, fileContentUser, true)
        .then(function (success) {
          // alert('成功写入filelist.json文件到' + cordova.file.externalRootDirectory + "aWEDM/data/" + '路径下');
          $scope.showToast($rootScope.fileTitle + '文件已保存');
          // alert(fileContentUser);
        }, function (error) {
          alert(JSON.stringify(error));
        });
    };

    $scope.processFileContent = function () {

      $state.go('app.tabs.process');

      $timeout(function(){

        xValueMin = 0;xValueMax =0;
        yValueMin = 0;yValueMax = 0;
        paintScale = 1;
        var stage2 = new Kinetic.Stage({
          container: "graphicsStage2", //<div>��id
          //container: "testImage", <div>��id
          colour: "red",
          //offsetX: -(window.screen.width-30)/2,//Math.floor(-stage.getWidth() / 2) - 0.5,
          //offsetY: -150,
          width: window.screen.width-30, //��������̨���
          height: 180 //��������̨�߶�
        });


        var shape2 = new Kinetic.Layer({
          //offsetX: -(window.screen.width-30)/2,//Math.floor(-stage.getWidth() / 2) - 0.5,
          //offsetY: -150,//Math.floor(-stage.getHeight() / 2) - 0.5,

          id: "shape"
        });
        stage2.add(shape2);

        var str = $rootScope.fileContentUser;
        //highlight(str);
        var myInterpreter = new gcodeInterpreter(str);
        var result = myInterpreter.interpreter();

        shape2.setOffsetX((xValueMin+xValueMax)*paintScale/2-160);
        shape2.setOffsetY(-80-(yValueMin+yValueMax)*paintScale/2);
        //shape.setOffsetX(-250);
        //shape.setOffsetY(-150);
        toIdealShape(result, shape2, paintScale);

        window.onresize = function(){
          stage2.setWidth(300);
          stage2.setHeight(200);

        };

      },500);

    };

  });
