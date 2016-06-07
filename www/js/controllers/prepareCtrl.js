angular.module('ionicApp.prepareCtrl', ['ionic'])
  .controller('prepareCtrl', function ($scope, $rootScope, edmData, $timeout, $cordovaToast) {

    console.log('prepareCtrl');

    $scope.showToast = function(message) {
      $cordovaToast.showShortBottom(message);
    };

    speedChange = function(){
      //var resSpeedValue;

      //if(speed.value == 1){
      //  resSpeedValue=40;
      //}
      //else if(speed.value == 2){
      //  resSpeedValue=76;
      //}
      //else if(speed.value == 3){
      //  resSpeedValue=112;
      //}
      //else if(speed.value == 4){
      //  resSpeedValue=148;
      //}start
      //else if(speed.value == 5){
      //  resSpeedValue=184;
      //}
      //else if(speed.value == 6){
      //  resSpeedValue=220;
      //}
      //else if(speed.value == 7){
      //  resSpeedValue=292;
      //}
      //else if(speed.value == 8){
      //  resSpeedValue=328;
      //}
      //else if(speed.value == 9){
      //  resSpeedValue=364;
      //}
      //else if(speed.value == 10){
      //  resSpeedValue=400;
      //}

      console.log(JSON.stringify({'cmd':'setInnerSpeed', level: speed.value}));
      resCmdWebSocket.send(JSON.stringify({'cmd':'setInnerSpeed', level: speed.value}));

    };


    //x轴正向移动
    $scope.xPosPointMove=function(){
      document.getElementById("button02").style.width = "40px";
      //var socket = io.connect($rootScope.ipLocation);
      resCmdWebSocket.send(JSON.stringify({'cmd':'pointMove','axis':'x','dir': 1}));
    };
    //x轴负向移动
    $scope.xNegPointMove=function(){
      document.getElementById("button01").style.width = "40px";
      //socket.send("x-Move is done contraller!!");
      resCmdWebSocket.send(JSON.stringify({'cmd':'pointMove','axis':'x','dir': -1}));
    };

    //y轴正向移动
    $scope.yPosPointMove=function(){
      document.getElementById("button04").style.width = "40px";
      //socket.send("y+Move is done contraller!!");
      resCmdWebSocket.send(JSON.stringify({'cmd':'pointMove','axis':'y','dir': 1}));
    };
    //y轴负向移动
    $scope.yNegPointMove=function(){
      document.getElementById("button03").style.width = "40px";
      //socket.send("y-Move is done contraller!!");
      resCmdWebSocket.send(JSON.stringify({'cmd':'pointMove','axis':'y','dir': -1}));
    };

    //u轴正向移动
    $scope.uPosPointMove=function(){
      document.getElementById("button06").style.width = "40px";
      //socket.send("u+Move is done contraller!!");
      resCmdWebSocket.send(JSON.stringify({'cmd':'pointMove','axis':'u','dir': 1}));
    };
    //u轴负向移动
    $scope.uNegPointMove=function(){
      document.getElementById("button05").style.width = "40px";
      //socket.send("u-Move is done contraller!!");
      resCmdWebSocket.send(JSON.stringify({'cmd':'pointMove','axis':'u','dir': -1}));
    };

    //v轴正向移动
    $scope.vPosPointMove=function(){
      document.getElementById("button08").style.width = "40px";
      //socket.send("v+Move is done contraller!!");
      resCmdWebSocket.send(JSON.stringify({'cmd':'pointMove','axis':'v','dir': 1}));
    };
    //v轴负向移动
    $scope.vNegPointMove=function(){
      document.getElementById("button07").style.width = "40px";
      //socket.send("v-Move is done contraller!!");
      resCmdWebSocket.send(JSON.stringify({'cmd':'pointMove','axis':'v','dir': -1}));
    };

    //点动停止函数
    $scope.stopPointMove = function(){
      document.getElementById("button01").style.width = "34px";
      document.getElementById("button02").style.width = "34px";
      document.getElementById("button03").style.width = "34px";
      document.getElementById("button04").style.width = "34px";
      document.getElementById("button05").style.width = "34px";
      document.getElementById("button06").style.width = "34px";
      document.getElementById("button07").style.width = "34px";
      document.getElementById("button08").style.width = "34px";
      resCmdWebSocket.send(JSON.stringify({'cmd':'stopPointMove'}));
    };

    $scope.waterPumpChange = function(){
      if($rootScope.img.watertemp == $rootScope.img.water) {
        $rootScope.img.watertemp = $rootScope.img.waternot;
        outputValue= outputValue&0xffffffef;
      } else {
        $rootScope.img.watertemp = $rootScope.img.water;
        outputValue = CmdGPIOOutType.OUT4_PUMP_SW | outputValue;
      }
      /*if($rootScope.toggleWaterPump) {
        outputValue = CmdGPIOOutType.OUT4_PUMP_SW | outputValue;
      }else{
        outputValue= outputValue&0xffffffef;
      }*/
      console.log("outputValue",outputValue);
      if(!resCmdWebSocketOpen) return;
      resCmdWebSocket.send(JSON.stringify({'cmd': 'setIOOutput','value': outputValue}));
    };
    $scope.highFrequenceChange = function(){
      if($rootScope.img.frequencytemp == $rootScope.img.frequency) {
        $rootScope.img.frequencytemp = $rootScope.img.frequencynot;
        outputValue= outputValue&0xffffdfff;
      } else {
        $rootScope.img.frequencytemp = $rootScope.img.frequency;
        outputValue= (CmdGPIOOutType.OUT13_VF_SW)|outputValue;
      }
      /*if($rootScope.toggleHighFrequence) {
        outputValue= (CmdGPIOOutType.OUT13_VF_SW)|outputValue;
      }else{
        outputValue= outputValue&0xffffdfff;
      }*/
      console.log("outputValue",outputValue);
      if(!resCmdWebSocketOpen) return;
      resCmdWebSocket.send(JSON.stringify({'cmd': 'setIOOutput','value': outputValue}));
    };
    $scope.wireTransportChange = function(){
      if($rootScope.img.movetemp == $rootScope.img.move) {
        $rootScope.img.movetemp = $rootScope.img.movenot;
        outputValue= outputValue&0xffffffdf;
      } else {
        $rootScope.img.movetemp = $rootScope.img.move;
        outputValue = CmdGPIOOutType.OUT5_WIRE_SW | outputValue;
      }
      /*if($rootScope.toggleWireTransport) {
        outputValue = CmdGPIOOutType.OUT5_WIRE_SW | outputValue;
      }else{
        outputValue= outputValue&0xffffffdf;
      }*/
      console.log("outputValue",outputValue);
      if(!resCmdWebSocketOpen) return;
      resCmdWebSocket.send(JSON.stringify({'cmd': 'setIOOutput','value': outputValue}));
    };
    $scope.axisUnlockChange = function(){
      if($rootScope.img.axistemp == $rootScope.img.axis) {
        $rootScope.img.axistemp = $rootScope.img.axisnot;
        resCmdWebSocket.send(JSON.stringify({'cmd': 'UnlockCmd','value': 1}));
      } else {
        $rootScope.img.axistemp = $rootScope.img.axis;
        resCmdWebSocket.send(JSON.stringify({'cmd': 'UnlockCmd','value': 0}));
      }
      if(!resCmdWebSocketOpen) return;
      /*if($rootScope.toggleAxisUnlock) {
        resCmdWebSocket.send(JSON.stringify({'cmd': 'UnlockCmd','value': 0}));
      }else{
        resCmdWebSocket.send(JSON.stringify({'cmd': 'UnlockCmd','value': 1}));
      }*/
    };

    $scope.startWireChange = function(){
      if($rootScope.img.wiretemp == $rootScope.img.wire) {
        $rootScope.img.wiretemp = $rootScope.img.wirenot;
        resCmdWebSocket.send(JSON.stringify({'cmd': 'SetWireReplace','value': 1}));
      } else {
        $rootScope.img.wiretemp = $rootScope.img.wire;
        resCmdWebSocket.send(JSON.stringify({'cmd': 'SetWireReplace','value': 0}));
      }
      if(!resCmdWebSocketOpen) return;
      /*if($rootScope.toggleStartWire) {
        resCmdWebSocket.send(JSON.stringify({'cmd': 'SetWireReplace','value': 0}));
      }else{
        resCmdWebSocket.send(JSON.stringify({'cmd': 'SetWireReplace','value': 1}));
      }*/
    };

    $scope.showFindEdge = function() {
      document.getElementById("IOSetting").style.display = "none";
      document.getElementById("findEdge").style.display = "block";
    };

    $scope.showIOSetting = function() {
      document.getElementById("findEdge").style.display = "none";
      document.getElementById("IOSetting").style.display = "block";
    };

    /*$scope.xSubf = function () {
      findEdgeDir = 1;
    };
    $scope.xAddf = function () {
      findEdgeDir = 0;
    };
    $scope.ySubf = function () {
      findEdgeDir = 3;
    };
    $scope.yAddf = function () {
      findEdgeDir = 2;
    };


    $scope.typeEdge = function () {
      findEdgeType = 0;
    };
    $scope.typeMid = function () {
      findEdgeType = 1;
    };
    $scope.typeCenter = function () {
      findEdgeType = 2;
    };*/

    //$scope.findEdgeDir = "X+";
    //$scope.findEdgeType = "找边";


    $scope.findEdgeStart = function(){

      if(isfindEdgeStart==0)
      {
        $scope.showToast('已开始向' + $rootScope.findEdgeDir + '方向' +$rootScope.findEdgeType);
        isfindEdgeStart = 1;

        if($rootScope.findEdgeType=="找边") {
          $rootScope.findEdgeTypeValue = 1;
        } else if($rootScope.findEdgeType=="找中点") {
          $rootScope.findEdgeTypeValue = 2;
        } else if($rootScope.findEdgeType=="找圆心") {
          $rootScope.findEdgeTypeValue = 4;
        }

        var rollBack = settings.rollBack;
        var ignoreDistance = settings.ignoreDistance;
        if(!resCmdWebSocketOpen) return;
        outputValue= (CmdGPIOOutType.OUT12_SHORTEDGE_SW)|outputValue;
        setTimeout(function(){
          resCmdWebSocket.send(JSON.stringify({'cmd': 'setIOOutput','value': outputValue}));
        },10);
        setTimeout(function(){
          resCmdWebSocket.send(JSON.stringify({'cmd':'setInnerSpeed', level: settings.findEdgeSpeed[0]}));
        },10);

        if($rootScope.findEdgeDir=="X+")
        {
          setTimeout(function () {
            resCmdWebSocket.send(JSON.stringify({'cmd':'findEdge', type: $scope.findEdgeTypeValue, axis: "x", dir: 1,
              findEdgeFirstSpeed: settings.findEdgeSpeed[0], findEdgeSecondSpeed: settings.findEdgeSpeed[1],
              rollBack: settings.rollBack, ignoreDistance: settings.ignoreDistance}));
          },10);

        } else if($rootScope.findEdgeDir=="X-")
        {
          setTimeout(function () {
            resCmdWebSocket.send(JSON.stringify({'cmd':'findEdge', type: $scope.findEdgeTypeValue, axis: "x", dir: -1,
              findEdgeFirstSpeed: settings.findEdgeSpeed[0], findEdgeSecondSpeed: settings.findEdgeSpeed[1],
              rollBack: settings.rollBack, ignoreDistance: settings.ignoreDistance}));
          },10);

        } else if($rootScope.findEdgeDir=="Y+")
        {
          setTimeout(function () {
            resCmdWebSocket.send(JSON.stringify({'cmd':'findEdge', type: $scope.findEdgeTypeValue, axis: "y", dir: 1,
              findEdgeFirstSpeed: settings.findEdgeSpeed[0], findEdgeSecondSpeed: settings.findEdgeSpeed[1],
              rollBack: settings.rollBack, ignoreDistance: settings.ignoreDistance}));
          },10);

        } else if($rootScope.findEdgeDir=="Y-")
        {
          setTimeout(function () {
            resCmdWebSocket.send(JSON.stringify({'cmd':'findEdge', type: $scope.findEdgeTypeValue, axis: "y", dir: -1,
              findEdgeFirstSpeed: settings.findEdgeSpeed[0], findEdgeSecondSpeed: settings.findEdgeSpeed[1],
              rollBack: settings.rollBack, ignoreDistance: settings.ignoreDistance}));
          },10);

        }
      }
      //else
      //{
      //  isfindEdgeStart = 0;
      //  if(!resCmdWebSocketOpen) return;
      //  setTimeout(function(){
      //    outputValue = outputValue & 0xffffefff;
      //    resCmdWebSocket.send(JSON.stringify({'cmd': 'setIOOutput','value': outputValue}));
      //  },20);
      //  setTimeout(function () {
      //    resCmdWebSocket.send(JSON.stringify({'cmd':'stopPointMove'}));
      //  },10);
      //
      //  setTimeout(function(){
      //    var value = $rootScope.getSpeed;
      //    //var speed = settings.innerSpeed[value-1];
      //    resCmdWebSocket.send(JSON.stringify({'cmd':'setInnerSpeed', level: value}));
      //  },40);
      //}

    };

    $scope.findEdgeStop = function(){
      isfindEdgeStart=0;
      $scope.showToast('已停止向' + $rootScope.findEdgeDir + '方向' +$rootScope.findEdgeType);
      if(!resCmdWebSocketOpen) return;
      resCmdWebSocket.send(JSON.stringify({'cmd':'stopPointMove'}));
      setTimeout(function(){
        outputValue = outputValue & 0xffffefff;
        resCmdWebSocket.send(JSON.stringify({'cmd': 'setIOOutput','value': outputValue}));
      },20);
      setTimeout(function(){
        var value = $rootScope.getSpeed;
        //var speed = settings.innerSpeed[value-1];
        resCmdWebSocket.send(JSON.stringify({'cmd':'setInnerSpeed', level: value}));
      },40);
    };


  });
