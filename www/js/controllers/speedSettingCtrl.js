angular.module('ionicApp.speedSettingCtrl', ['ionic'])
  .controller('speedSettingCtrl', function ($scope, $rootScope, $timeout, $ionicPopup,$state) {
    console.log('speedSettingCtrl');

    innerSpeed1Change = function () {
      settings.innerSpeed[0] = innerSpeed1.value;
    };
    innerSpeed2Change = function () {
      settings.innerSpeed[1] = innerSpeed2.value;
    };
    innerSpeed3Change = function () {
      settings.innerSpeed[2] = innerSpeed3.value;
    };
    innerSpeed4Change = function () {
      settings.innerSpeed[3] = innerSpeed4.value;
    };
    innerSpeed5Change = function () {
      settings.innerSpeed[4] = innerSpeed5.value;
    };
    innerSpeed6Change = function () {
      settings.innerSpeed[5] = innerSpeed6.value;
    };
    innerSpeed7Change = function () {
      settings.innerSpeed[6] = innerSpeed7.value;
    };
    innerSpeed8Change = function () {
      settings.innerSpeed[7] = innerSpeed8.value;
    };
    innerSpeed9Change = function () {
      settings.innerSpeed[8] = innerSpeed9.value;
    };
    innerSpeed10Change = function () {
      settings.innerSpeed[9] = innerSpeed10.value;
    };


    machineSpeed1Change = function () {
      settings.outerSpeed[0] = machineSpeed1.value;
    };
    machineSpeed2Change = function () {
      settings.outerSpeed[1] = machineSpeed2.value;
    };
    machineSpeed3Change = function () {
      settings.outerSpeed[2] = machineSpeed3.value;
    };
    machineSpeed4Change = function () {
      settings.outerSpeed[3] = machineSpeed4.value;
    };
    machineSpeed5Change = function () {
      settings.outerSpeed[4] = machineSpeed5.value;
    };
    machineSpeed6Change = function () {
      settings.outerSpeed[5] = machineSpeed6.value;
    };
    machineSpeed7Change = function () {
      settings.outerSpeed[6] = machineSpeed7.value;
    };
    machineSpeed8Change = function () {
      settings.outerSpeed[7] = machineSpeed8.value;
    };
    machineSpeed9Change = function () {
      settings.outerSpeed[8] = machineSpeed9.value;
    };
    machineSpeed10Change = function () {
      settings.outerSpeed[9] = machineSpeed10.value;
    };

    firstSpeedChange = function () {
      settings.findEdgeSpeed[0] = firstSpeed.value;
    };
    secondSpeedChange = function () {
      settings.findEdgeSpeed[1] = secondSpeed.value;
    };
    rollBackChange = function () {
      settings.rollBack = rollBackValue.value;
    };
    ignoreDistanceChange = function () {
      settings.ignoreDistance = ignoreDistanceValue.value;
    }




  });
