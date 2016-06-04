angular.module('ionicApp.mainCtrl', [])
  .controller('mainCtrl', function ($scope, $ionicSideMenuDelegate, $rootScope) {

    var coordPaint = null;
    var contextCoord = null;

    $rootScope.fileContentUser = null;

    $rootScope.machineSpeedLevel = 1;//加工速度
    $rootScope.getSpeed = 2;// 手动速度 设置速度初始值

    $rootScope.pulseWidthValue = 0;
    $rootScope.ratioValue = 0;

    $rootScope.toggleAxisUnlock = false;
    $rootScope.toggleStartWire = false;
    $rootScope.toggleWaterPump = false;
    $rootScope.toggleHighFrequence = false;
    $rootScope.toggleWireTransport = false;
    $rootScope.wireSpeedValue = 0;
    $rootScope.currentValue = 0;

    $rootScope.div_pos_x = parseFloat(numFormat(0));
    $rootScope.div_pos_y = parseFloat(numFormat(0));
    $rootScope.div_pos_u = parseFloat(numFormat(0));
    $rootScope.div_pos_v = parseFloat(numFormat(0));

    $scope.toggleLeft = function () {
      $ionicSideMenuDelegate.toggleLeft();
    };

  });
