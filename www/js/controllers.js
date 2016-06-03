angular.module('ionicApp.controllers', [])
  .controller('MainCtrl', function ($scope, $ionicSideMenuDelegate, $rootScope) {

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
  })

  .controller('HomeTabCtrl', function ($scope,edmData,$rootScope, $timeout, $cordovaSplashscreen) {
    console.log('HomeTabCtrl');

    $timeout(function () {
        $cordovaSplashscreen.show();
    }, 50);

    coordPaint = document.getElementById("coordPaint");
    if(coordPaint && coordPaint.getContext){
      contextCoord = coordPaint.getContext("2d");

      contextCoord.translate(5,5);

      contextCoord.beginPath();
      contextCoord.moveTo(0,0);

      contextCoord.lineWidth = 1;

      contextCoord.stroke();

    }






  })

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


  })

  .controller('ipSettingCtrl', function ($scope,$rootScope, edmData, $timeout) {

    console.log("ipSettingCtrl");
    var paintFlag = 0;
    $scope.setIpAddress = function(){
      ipAddress = document.getElementById("ipInput").value;
      webIpAddress = "ws://" + ipAddress;
      document.getElementById("information").innerHTML += "IP设置为" + ipAddress + "</br>"+ "请点击连接按钮" + "</br>";
      console.log("ws://" + ipAddress + ":8080");
    };

    //连接至写好的ip，监听信息
    $scope.ipConnect = function () {
      var flagInfoConnect = 0;var flagCmdConnect = 0;
      resInfoWebSocket = new WebSocket(webIpAddress + ":8081");
      resInfoWebSocket.onerror = function(event){
        console.log('ERROR: ' + event.message);

      };
      resInfoWebSocket.onopen = function(){
        console.log('info succeed!');
        resCmdWebSocketOpen = true;
        document.getElementById("information").innerHTML += "info connect success"+ "<br />" + webIpAddress + ":8081" + "</br>";
        flagInfoConnect = 1;
        //alert("connection success");
      };

      resCmdWebSocket = new WebSocket(webIpAddress + ":8080");
      resCmdWebSocket.onerror = function(event){
        console.log('ERROR: ' + event.message);

      };
      resCmdWebSocket.onopen = function(){
        console.log('cmd succeed!');
        resInfoWebSocketOpen = true;
        document.getElementById("information").innerHTML += "cmd connect success"+ "<br />" + webIpAddress + ":8080" + "</br>";
        flagCmdConnect = 1;
        resCmdWebSocket.send(JSON.stringify({'cmd': 'getIOState'}));
        resCmdWebSocket.send(JSON.stringify({'cmd': 'getSelDiv'}));

        //alert("connection success");
      };

      //检查是否连接成功
      setTimeout(function () {
        if (flagInfoConnect == 1 && flagCmdConnect == 1) {
          console.log("connection success");
          document.getElementById("information").innerHTML += "全部连接成功"+ "<br />";
          document.getElementById("machineStatus").innerHTML = "已连接";
        }
        else {
          alert("connection failed");
        }
      }, 1000);

      resCmdWebSocket.onmessage = function(){
        var data = JSON.parse(event.data);
        var dataview = toDataView(data.data);
        if(data.type=='IOstate') {
          var iostatus = dataview.getUint16(6, true); //低位开始读取
          outputValue = iostatus;
          ioInfo.highfrequence = iostatus>>13&0x01;
          ioInfo.waterPump = iostatus>>4&0x01;
          ioInfo.wireTransport = iostatus>>5&0x01;
          ioInfo.wireSpeed = SpeedLevel.wireSpeed.indexOf(iostatus>>1&0x03);
          var current = iostatus>>8&0xf;
          current = current.toString(2);
          while(current.length<4) {
            current = "0" + current;
          }
          var reverseCurrent = "";
          for (var i=3;i>=0;i--) {
            reverseCurrent += current.charAt(i);
          }
          ioInfo.current = parseInt(reverseCurrent,2);
          //setTimeout(updateIO(ioInfo),2);
          console.log(ioInfo);

          setTimeout(function(){
            if(ioInfo.waterPump == 0){
              $rootScope.toggleWaterPump = "false";
              document.getElementById("waterPumpStatus").innerHTML = "关";
            }
            else{
              $rootScope.toggleWaterPump = true;
              document.getElementById("waterPumpStatus").innerHTML = "开";
            }
            if(ioInfo.highfrequence == 0){
              $rootScope.toggleHighFrequence = false;
              document.getElementById("highFrequenceStatus").innerHTML = "关";
            }
            else{
              $rootScope.toggleHighFrequence = true;
              document.getElementById("highFrequenceStatus").innerHTML = "开";
            }

            if(ioInfo.wireTransport == 0){
              $rootScope.toggleWireTransport = false;
              document.getElementById("wireTransportStatus").innerHTML = "关";
            }
            else{
              $rootScope.toggleWireTransport = true;
              document.getElementById("wireTransportStatus").innerHTML = "开";
            }
            if($rootScope.toggleAxisUnlock == 0){
              document.getElementById("axisUnlockStatus").innerHTML = "关";
            }
            else{

              document.getElementById("axisUnlockStatus").innerHTML = "开";
            }


            $rootScope.wireSpeedValue = ioInfo.wireSpeed;
            document.getElementById("wireSpeedStatus").innerHTML = ioInfo.wireSpeed;
            $rootScope.currentValue = ioInfo.current;
            document.getElementById("currentStatus").innerHTML = ioInfo.current;
            $rootScope.$apply();
          },10);

        }



        if(data.type=='SelDiv')
        {
          var selector = dataview.getUint8(4);
          setTimeout(function(){
            if(selector==0) {
              //外分速度。暂时没写
            }else {
              //内分速度
              var div = 72000/dataview.getInt32(8,true);
              var index ;
              for(var i=0; i<10; i++)
              {
                if(Math.abs((parseInt(div)-parseInt(SpeedLevel.innerSpeed[i])))<1)
                {
                  //因为当发下去的速度不能被72000或者400整除的时候，获取到的分频值就会和本地设置不完全一致，但是应该不会超过1
                  index = i+1;
                  break;
                }
              }
              $rootScope.getSpeed = index;
            }
          }, 20)

        }//存在疑问  留待检查！！！

      };

      resCmdWebSocket.onclose = function(){
        resCmdWebSocketOpen = false;
        console.log("resCmdWebSocket关闭" + "<br>");
      };


      //以下是info口的状态

      //每隔n秒获取坐标
      var resGetCoor = setInterval(function () {
        if(!resInfoWebSocketOpen) return;
        resInfoWebSocket.send(JSON.stringify({'cmd':'getUpdateInfo'}));
      }, 300);

      //每隔n秒获取一下IO状态
      setInterval(function () {
        if(!resCmdWebSocketOpen) return;
        resCmdWebSocket.send(JSON.stringify({'cmd': 'getIOState'}));
        resCmdWebSocket.send(JSON.stringify({'cmd': 'getSelDiv'}));
      }, 5000);

      //监听
      resInfoWebSocket.onmessage = function (event) {
        var data = JSON.parse(event.data);
        var dataview = toDataView(data.data);

        if (data.type == 'pos') {
          //setTimeout(updataCoor(data.data),10)
        }
        else if (data.type == 'updateinfo') {
//if(data.error==0) {
          //
          //}else if(data.done){
          //
          //}else{
          //    toArrayBuffer(data.data);
          //
          //}
          var type = dataview.getUint8(2);

          if (type == INFO.FRAME_UPDATE_STATE) {
            var iostatus = dataview.getUint32(4, true); //低位开始读取
            posInfo.x = dataview.getInt32(8, true);
            posInfo.y = dataview.getInt32(12, true);
            posInfo.u = dataview.getInt32(16, true);
            posInfo.v = dataview.getInt32(20, true);


            setTimeout(function () {
              $rootScope.div_pos_x = numFormat(posInfo.x);
              $rootScope.div_pos_y = numFormat(posInfo.y);
              $rootScope.div_pos_u = numFormat(posInfo.u);
              $rootScope.div_pos_v = numFormat(posInfo.v);

              if(paintFlag == 0){
                contextCoord.moveTo($rootScope.div_pos_x*3,$rootScope.div_pos_y*3);
                paintFlag =1;
              }
              if(paintFlag == 1){
                contextCoord.lineTo($rootScope.div_pos_x*3,$rootScope.div_pos_y*3);
                console.log($rootScope.div_pos_x*3,$rootScope.div_pos_y*3);
                contextCoord.stroke();
              }


              $scope.$apply();
              //updataCoor(posInfo);
              //updataIO(iostatus);
            }, 10);
          } else if (type == INFO.FRAME_MOVE_DONE) {

          } else if (type == INFO.FRAME_EMG_HARDFAULT_CASE) {
            document.getElementById("information").innerHTML += "硬件故障";
          } else if (type == INFO.FRAME_EMG_POWERCUT_CASE) {
            document.getElementById("information").innerHTML += "掉电异常";
          } else if (type == INFO.FRAME_EMG_WIRECUT_CASE) {
            document.getElementById("information").innerHTML += "断丝异常";
          }
        }
      };
      resInfoWebSocket.onclose = function(){
        resInfoWebSocketOpen = false;
        console.log("resInfoWebSocket关闭" + "<br>");
      };
    };

  })

  .controller('processCtrl', function ($scope, edmData, $rootScope, $ionicPopup) {
    console.log('processCtrl');

    $scope.setPWM = function () {
      var myPopup = $ionicPopup.show({
        template: ' 脉宽：<input type="text" id="pulseWidthValue" >' +
        '占空比：<input type="text" id="ratioValue" >',
        title: '<b>设置脉宽与占空比</b>',
        //subTitle: 'Please use normal things',
        scope: $rootScope,
        buttons: [
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!(ratioValue.value&&pulseWidthValue.value)){
                // 不允许用户关闭，除非输入两个值
                e.preventDefault();
              } else {
                $rootScope.pulseWidthValue = pulseWidthValue.value;
                $rootScope.ratioValue = ratioValue.value;
                myPopup.close();
              }
            }
          },
          { text: 'Cancel' }
        ]
      });
      console.log($rootScope.pulseWidthValue + "</br>" + $rootScope.ratioValue);
      if(!resCmdWebSocketOpen) return;
      resCmdWebSocket.send(JSON.stringify({'cmd': 'setPWM', ratio: ratioValue.value, pulseWidth: pulseWidthValue.value}));
    };



    machineSpeedLevelChange = function () {
      console.log($rootScope.machineSpeedLevel);

      var resMachineSpeedValue;
      if($rootScope.machineSpeedLevel == 1){
        resMachineSpeedValue=40;
      }
      else if($rootScope.machineSpeedLevel == 2){
        resMachineSpeedValue=76;
      }
      else if($rootScope.machineSpeedLevel == 3){
        resMachineSpeedValue=112;
      }
      else if($rootScope.machineSpeedLevel == 4){
        resMachineSpeedValue=148;
      }
      else if($rootScope.machineSpeedLevel == 5){
        resMachineSpeedValue=184;
      }
      else if($rootScope.machineSpeedLevel == 6){
        resMachineSpeedValue=220;
      }
      else if($rootScope.machineSpeedLevel == 7){
        resMachineSpeedValue=292;
      }
      else if($rootScope.machineSpeedLevel == 8){
        resMachineSpeedValue=328;
      }
      else if($rootScope.machineSpeedLevel == 9){
        resMachineSpeedValue=364;
      }
      else if($rootScope.machineSpeedLevel == 10){
        resMachineSpeedValue=400;
      }

      if(!resCmdWebSocketOpen) return;
      resCmdWebSocket.send(JSON.stringify({'cmd':'setOuterSpeed', level: resMachineSpeedValue}));

    };

    wireSpeedChange = function () {
      outputValue=outputValue&0xfffffff8;
      var resWireSpeedLevel = Number($rootScope.wireSpeedValue);
      switch (resWireSpeedLevel){
        case 2:
          outputValue= (CmdGPIOOutType.OUT1_WIREVEL_2_SW | CmdGPIOOutType.OUT2_WIREVEL_1_SW )|outputValue;
          break;
        case 3:
          outputValue= (CmdGPIOOutType.OUT2_WIREVEL_1_SW)|outputValue;
          break;
        case 0:

          break;
        case 1:
          outputValue= (CmdGPIOOutType.OUT1_WIREVEL_2_SW)|outputValue;
          break;
      }

      if(!resCmdWebSocketOpen) return;
      resCmdWebSocket.send(JSON.stringify({'cmd': 'setIOOutput','value': outputValue}));
      console.log("set wireSpeed %d", resWireSpeedLevel);
    };

    currentChange = function () {
      outputValue=outputValue&0xfffff0ff;
      var resCurrentLevel = Number($rootScope.currentValue);
      console.log(resCurrentLevel);
      switch(resCurrentLevel)
      {
        case 0:
          break;
        case 1:
          outputValue= (CmdGPIOOutType.OUT11_PWMSEL4_SW)|outputValue;
          break;
        case 2:
          outputValue= (CmdGPIOOutType.OUT10_PWMSEL3_SW)|outputValue;
          break;
        case 3:
          outputValue= (CmdGPIOOutType.OUT11_PWMSEL4_SW|CmdGPIOOutType.OUT10_PWMSEL3_SW)|outputValue;
          break;
        case 4:
          outputValue= (CmdGPIOOutType.OUT9_PWMSEL2_SW)|outputValue;
          break;
        case 5:
          outputValue= (CmdGPIOOutType.OUT11_PWMSEL4_SW|CmdGPIOOutType.OUT9_PWMSEL2_SW)|outputValue;
          break;
        case 6:
          outputValue= (CmdGPIOOutType.OUT10_PWMSEL3_SW|CmdGPIOOutType.OUT9_PWMSEL2_SW)|outputValue;
          break;
        case 7:
          outputValue= (CmdGPIOOutType.OUT11_PWMSEL4_SW|CmdGPIOOutType.OUT10_PWMSEL3_SW|CmdGPIOOutType.OUT9_PWMSEL2_SW)|outputValue;
          break;
        case 8:
          outputValue= (CmdGPIOOutType.OUT8_PWMSEL1_SW)|outputValue;
          break;
        case 9:
          outputValue= (CmdGPIOOutType.OUT11_PWMSEL4_SW|CmdGPIOOutType.OUT8_PWMSEL1_SW)|outputValue;
          break;
        case 10:
          outputValue= (CmdGPIOOutType.OUT10_PWMSEL3_SW|CmdGPIOOutType.OUT8_PWMSEL1_SW)|outputValue;
          break;
        case 11:
          outputValue= (CmdGPIOOutType.OUT11_PWMSEL4_SW|CmdGPIOOutType.OUT10_PWMSEL3_SW|CmdGPIOOutType.OUT8_PWMSEL1_SW)|outputValue;
          break;
        case 12:
          outputValue= (CmdGPIOOutType.OUT9_PWMSEL2_SW|CmdGPIOOutType.OUT8_PWMSEL1_SW)|outputValue;
          break;
        case 13:
          outputValue= (CmdGPIOOutType.OUT11_PWMSEL4_SW|CmdGPIOOutType.OUT9_PWMSEL2_SW|CmdGPIOOutType.OUT8_PWMSEL1_SW)|outputValue;
          break;
        case 14:
          outputValue= (CmdGPIOOutType.OUT10_PWMSEL3_SW|CmdGPIOOutType.OUT9_PWMSEL2_SW|CmdGPIOOutType.OUT8_PWMSEL1_SW)|outputValue;
          break;
        case 15:
          outputValue= (CmdGPIOOutType.OUT8_PWMSEL1_SW|CmdGPIOOutType.OUT9_PWMSEL2_SW|CmdGPIOOutType.OUT10_PWMSEL3_SW|CmdGPIOOutType.OUT11_PWMSEL4_SW)|outputValue;
          break;
      }

      if(!resCmdWebSocketOpen) return;
      resCmdWebSocket.send(JSON.stringify({'cmd': 'setIOOutput','value': outputValue}));
      console.log("set current %d", resCurrentLevel);
    };

  })

  .controller('testCtrl', function ($scope, edmData, $rootScope) {
    console.log('testCtrl');

    //var testPaint = document.getElementById("testPaint");
    //if(testPaint && testPaint.getContext){
    //  var context = testPaint.getContext("2d");
    //
    //  context.beginPath();
    //  context.strokeStyle = "red"
    //  context.lineWidth =2;
    //
    //  //context.translate(125,125);
    //  context.moveTo(0,0);
    //  context.lineTo(100,0);
    //
    //  context.fillRect(10,10,50,50);
    //  var imgData = context.getImageData(0, 0, 125, 125);
    //  context.clearRect(0,0,125,125);
    //  context.scale(2,2);
    //  context.putImageData(imgData, 0, 80);
    //  context.lineTo(100,20);
    //
    //  //context.lineWidth = 1;
    //  //context.moveTo(0,0);
    //  //context.fillRect(10,10,30,30);
    //  context.stroke();
    //  context.closePath();
    //
    //
    //  context.beginPath();
    //  context.clearRect(0,0,125,125);
    //  context.scale(0.5,0.5);
    //  context.putImageData(imgData, 0, 0);
    //
    //
    //  context.closePath();
    //
    //
    //  //var imageData = context.getImageData(0,0,100,100);
    //
    //  //context.clearRect(-125,-125,250,250);
    //
    //  //context.scale(2,2);
    //  //context.putImageData(imageData,0,0);
    //  //context.fill();
    //
    //
    //
    //}
    //
    //var testStage = new Kinetic.Stage({
    //  container: "kineticTest",
    //  width : 250,
    //  height : 250
    //});
    //var layer = new Kinetic.Layer();
    //var shape = new Kinetic.Shape();
    //var rect = {
    //  x : 20, //矩形左上角x坐标
    //  y : 15, //矩形左上角y坐标
    //  width : 100, //矩形的宽度
    //  height : 100, //矩形的高度
    //  fill : "red", //矩形的填充色
    //  stroke : "black", //矩形边缘线的颜色
    //  strokeWidth : 4 //矩形边缘线的宽度
    //};
    //
    //layer.add(shape);
    //
    ////layer.transitionTo({
    ////  scale : 2,
    ////  duration:2
    ////});
    //testStage.add(layer);
    //
    //
    //testStage.draw();







//    var load_prg = document.getElementById('load_prg');
//    var new_prg = document.getElementById("new_prg");
//    var btns = document.getElementsByClassName("btns")[0];
//    var text = document.getElementsByClassName("text")[0];
//    var preContainer = document.getElementById("preContainer");
//
//    load_prg.onchange = function() {
//      if(this.files.length) {
//        var file = this.files[0];
//        var reader = new FileReader();
//        reader.onload = function()
//        {
//          var str = this.result;
//          //code.innerText = str;
//          highlight(str);
//          var myInterpreter = new gcodeInterpreter(str);
//          var result = myInterpreter.interpreter();
//          toIdealShape(result, shape, paintScale);
//        };
//        reader.readAsText(file);
//      }
//    }
//
//    function highlight(str) {
//      preContainer.innerHTML = '<pre data-language="gcode">/**start**/&#10'+ str + '&#10/**end**/'; //&lt;gcode&gt;&#10
//      //JSHL();
//      preContainer.scrollTop = preContainer.scrollHeight + 'px';
//    }
//
//    function getWidth () {
//      return document.getElementById("graphicsStage").offsetWidth
//    }
//    function getHeight () {
//      return document.getElementById("graphicsStage").offsetHeight
//    }
//
////console.log(getWidth(),getHeight())
//    window.onresize = function(){
//      stage.setWidth(getWidth());
//      stage.setHeight(getHeight());
//    }
//
//    var stage = new Kinetic.Stage({
//      container: "graphicsStage", //<div>��id
//      //container: "testImage", //<div>��id
//      colour: "red",
//      width: getWidth(), //��������̨���
//      height: getHeight() //��������̨�߶�
//    });
//
////console.log(stage.getWidth(),stage.getHeight())
//    var shape = new Kinetic.Layer({
//      offsetX: -100.5,//Math.floor(-stage.getWidth() / 2) - 0.5,
//      offsetY: -100.5,//Math.floor(-stage.getHeight() / 2) - 0.5,
//      id: "shape"
//    })
//    stage.add(shape);


  })

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




  })

  .controller('checkCtrl', function ($scope, edmData, $rootScope) {
    console.log('checkCtrl');

  });
