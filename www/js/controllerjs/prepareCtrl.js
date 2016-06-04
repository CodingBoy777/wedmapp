angular.module('ionicApp.prepareCtrl', ['ionic'])
  .controller('prepareCtrl', function ($scope, $rootScope, edmData, $timeout) {

    console.log('prepareCtrl');
    speedChange = function(){
      var resSpeedValue;
      if(speed.value == 1){
        resSpeedValue=40;
      }
      else if(speed.value == 2){
        resSpeedValue=76;
      }
      else if(speed.value == 3){
        resSpeedValue=112;
      }
      else if(speed.value == 4){
        resSpeedValue=148;
      }
      else if(speed.value == 5){
        resSpeedValue=184;
      }
      else if(speed.value == 6){
        resSpeedValue=220;
      }
      else if(speed.value == 7){
        resSpeedValue=292;
      }
      else if(speed.value == 8){
        resSpeedValue=328;
      }
      else if(speed.value == 9){
        resSpeedValue=364;
      }
      else if(speed.value == 10){
        resSpeedValue=400;
      }
      console.log(JSON.stringify({'cmd':'setInnerSpeed', level: resSpeedValue}));
      resCmdWebSocket.send(JSON.stringify({'cmd':'setInnerSpeed', level: resSpeedValue}));

    };


    //x轴正向移动
    $scope.xPosPointMove=function(){
      //var socket = io.connect($rootScope.ipLocation);
      resCmdWebSocket.send(JSON.stringify({'cmd':'pointMove','axis':'x','dir': 1}));
    };
    //x轴负向移动
    $scope.xNegPointMove=function(){
      //socket.send("x-Move is done contraller!!");
      resCmdWebSocket.send(JSON.stringify({'cmd':'pointMove','axis':'x','dir': -1}));
    };

    //y轴正向移动
    $scope.yPosPointMove=function(){
      //socket.send("y+Move is done contraller!!");
      resCmdWebSocket.send(JSON.stringify({'cmd':'pointMove','axis':'y','dir': 1}));
    };
    //y轴负向移动
    $scope.yNegPointMove=function(){
      //socket.send("y-Move is done contraller!!");
      resCmdWebSocket.send(JSON.stringify({'cmd':'pointMove','axis':'y','dir': -1}));
    };

    //u轴正向移动
    $scope.uPosPointMove=function(){
      //socket.send("u+Move is done contraller!!");
      resCmdWebSocket.send(JSON.stringify({'cmd':'pointMove','axis':'u','dir': 1}));
    };
    //u轴负向移动
    $scope.uNegPointMove=function(){
      //socket.send("u-Move is done contraller!!");
      resCmdWebSocket.send(JSON.stringify({'cmd':'pointMove','axis':'u','dir': -1}));
    };

    //v轴正向移动
    $scope.vPosPointMove=function(){
      //socket.send("v+Move is done contraller!!");
      resCmdWebSocket.send(JSON.stringify({'cmd':'pointMove','axis':'v','dir': 1}));
    };
    //v轴负向移动
    $scope.vNegPointMove=function(){
      //socket.send("v-Move is done contraller!!");
      resCmdWebSocket.send(JSON.stringify({'cmd':'pointMove','axis':'v','dir': -1}));
    };

    //点动停止函数
    $scope.stopPointMove = function(){
      resCmdWebSocket.send(JSON.stringify({'cmd':'stopPointMove'}));
    };

    waterPumpChange = function(){
      if($rootScope.toggleWaterPump) {
        outputValue = CmdGPIOOutType.OUT4_PUMP_SW | outputValue;
      }else{
        outputValue= outputValue&0xffffffef;
      }
      console.log("outputValue",outputValue);
      if(!resCmdWebSocketOpen) return;
      resCmdWebSocket.send(JSON.stringify({'cmd': 'setIOOutput','value': outputValue}));
    };
    highFrequenceChange = function(){
      if($rootScope.toggleHighFrequence) {
        outputValue= (CmdGPIOOutType.OUT13_VF_SW)|outputValue;
      }else{
        outputValue= outputValue&0xffffdfff;
      }
      console.log("outputValue",outputValue);
      if(!resCmdWebSocketOpen) return;
      resCmdWebSocket.send(JSON.stringify({'cmd': 'setIOOutput','value': outputValue}));
    };
    wireTransportChange = function(){
      if($rootScope.toggleWireTransport) {
        outputValue = CmdGPIOOutType.OUT5_WIRE_SW | outputValue;
      }else{
        outputValue= outputValue&0xffffffdf;
      }
      console.log("outputValue",outputValue);
      if(!resCmdWebSocketOpen) return;
      resCmdWebSocket.send(JSON.stringify({'cmd': 'setIOOutput','value': outputValue}));
    };
    axisUnlockChange = function(){
      if(!resCmdWebSocketOpen) return;
      if($rootScope.toggleAxisUnlock) {
        resCmdWebSocket.send(JSON.stringify({'cmd': 'UnlockCmd','value': 0}));
      }else{
        resCmdWebSocket.send(JSON.stringify({'cmd': 'UnlockCmd','value': 1}));
      }
    };
    startWireChange = function(){
      if(!resCmdWebSocketOpen) return;
      if($rootScope.toggleStartWire) {
        resCmdWebSocket.send(JSON.stringify({'cmd': 'SetWireReplace','value': 0}));
      }else{
        resCmdWebSocket.send(JSON.stringify({'cmd': 'SetWireReplace','value': 1}));
      }
    };

    $scope.xSubf = function () {
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
    };


    $scope.findEdgeStart = function(){

      if(isfindEdgeStart==0)
      {
        isfindEdgeStart = 1;

        var rollBack = settings.rollBack;
        var ignoreDistance = settings.ignoreDistance;
        if(!resCmdWebSocketOpen) return;
        outputValue= (CmdGPIOOutType.OUT12_SHORTEDGE_SW)|outputValue;
        resCmdWebSocket.send(JSON.stringify({'cmd': 'setIOOutput','value': outputValue}));
        setTimeout(function(){
          resCmdWebSocket.send(JSON.stringify({'cmd':'setInnerSpeed', level: settings.findEdgeSpeed[0]}));
        },20);
        if(findEdgeDir==0)
        {
          resCmdWebSocket.send(JSON.stringify({'cmd':'findEdge', type: findEdgeType, axis: "x", dir: 1,
            findEdgeFirstSpeed: settings.findEdgeSpeed[0], findEdgeSecondSpeed: settings.findEdgeSpeed[1],
            rollBack: settings.rollBack, ignoreDistance: settings.ignoreDistance}));
        } else if(findEdgeDir==1)
        {
          resCmdWebSocket.send(JSON.stringify({'cmd':'findEdge', type: findEdgeType, axis: "x", dir: -1,
            findEdgeFirstSpeed: settings.findEdgeSpeed[0], findEdgeSecondSpeed: settings.findEdgeSpeed[1],
            rollBack: settings.rollBack, ignoreDistance: settings.ignoreDistance}));
        } else if(findEdgeDir==2)
        {
          resCmdWebSocket.send(JSON.stringify({'cmd':'findEdge', type: findEdgeType, axis: "y", dir: 1,
            findEdgeFirstSpeed: settings.findEdgeSpeed[0], findEdgeSecondSpeed: settings.findEdgeSpeed[1],
            rollBack: settings.rollBack, ignoreDistance: settings.ignoreDistance}));
        } else if(findEdgeDir==3)
        {
          resCmdWebSocket.send(JSON.stringify({'cmd':'findEdge', type: findEdgeType, axis: "y", dir: -1,
            findEdgeFirstSpeed: settings.findEdgeSpeed[0], findEdgeSecondSpeed: settings.findEdgeSpeed[1],
            rollBack: settings.rollBack, ignoreDistance: settings.ignoreDistance}));
        }
      }
      else
      {
        isfindEdgeStart = 0;
        if(!resCmdWebSocketOpen) return;
        resCmdWebSocket.send(JSON.stringify({'cmd':'stopPointMove'}));
        setTimeout(function(){
          outputValue = outputValue & 0xffffefff;
          resCmdWebSocket.send(JSON.stringify({'cmd': 'setIOOutput','value': outputValue}));
        },20)
        setTimeout(function(){
          var value = $rootScope.getSpeed;
          var speed = settings.innerSpeed[value-1];
          resCmdWebSocket.send(JSON.stringify({'cmd':'setInnerSpeed', level: speed}));
        },40)
      }

    };

    $scope.findEdgeStop = function(){

      if(!resCmdWebSocketOpen) return;
      resCmdWebSocket.send(JSON.stringify({'cmd':'stopPointMove'}));
      setTimeout(function(){
        outputValue = outputValue & 0xffffefff;
        resCmdWebSocket.send(JSON.stringify({'cmd': 'setIOOutput','value': outputValue}));
      },20)
      setTimeout(function(){
        var value = $rootScope.getSpeed;
        var speed = settings.innerSpeed[value-1];
        resCmdWebSocket.send(JSON.stringify({'cmd':'setInnerSpeed', level: speed}));
      },40)
    }


  });
