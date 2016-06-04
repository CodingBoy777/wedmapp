angular.module('ionicApp.mainCtrl', [])
  .controller('mainCtrl', function ($scope, $ionicSideMenuDelegate, $rootScope,$state) {

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

    //$rootScope.div_pos_x = parseFloat(numFormat(0));
    //$rootScope.div_pos_y = parseFloat(numFormat(0));
    //$rootScope.div_pos_u = parseFloat(numFormat(0));
    //$rootScope.div_pos_v = parseFloat(numFormat(0));
    $rootScope.div_pos_x = numFormat(0);
    $rootScope.div_pos_y = numFormat(0);
    $rootScope.div_pos_u = numFormat(0);
    $rootScope.div_pos_v = numFormat(0);

    $rootScope.img = {
        waternot: 'img/btn-move-water-not.png',
        water: 'img/btn-move-water.png',
        watertemp: 'img/btn-move-water-not.png',
        frequencynot: 'img/btn-move-frequency-not.png',
        frequency: 'img/btn-move-frequency.png',
        frequencytemp: 'img/btn-move-frequency-not.png',
        movenot: 'img/btn-move-move-not.png',
        move: 'img/btn-move-move.png',
        movetemp: 'img/btn-move-move-not.png',
        axisnot: 'img/btn-move-axis-not.png',
        axis: 'img/btn-move-axis.png',
        axistemp: 'img/btn-move-axis-not.png',
        wirenot: 'img/btn-move-wire-not.png',
        wire: 'img/btn-move-wire.png',
        wiretemp: 'img/btn-move-wire-not.png'
    };

    $scope.returnHome = function () {
      $state.go('app.tabs.home');
    };

    $scope.toggleLeft = function () {
      $ionicSideMenuDelegate.toggleLeft();
    };

  });
