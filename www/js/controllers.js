angular.module('ionicApp.controllers', [])
  .controller('MainCtrl', function ($scope, $ionicSideMenuDelegate, $rootScope) {

    var coordPaint = null;
    var contextCoord = null;

    $rootScope.fileContentUser = null;

    $rootScope.machineSpeedLevel = 1;//加工速度
    $rootScope.getSpeed = 2;// 手动速度 设置速度初始值

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

  .controller('HomeTabCtrl', function ($scope,edmData,$rootScope) {
    console.log('HomeTabCtrl');

    coordPaint = document.getElementById("coordPaint");
    if(coordPaint && coordPaint.getContext){
      contextCoord = coordPaint.getContext("2d");

      contextCoord.translate(150,75);

      contextCoord.beginPath();

      //contextCoord.scale(10,10);

      contextCoord.lineWidth = 0.1;
      contextCoord.moveTo(0,0);
      contextCoord.lineTo(10,20);
      contextCoord.stroke();
    }






  })

  .controller('prepareCtrl', function ($scope, $rootScope, edmData, $timeout) {

    console.log('prepareCtrl');
    speedChange = function(){
      console.log(JSON.stringify({'cmd':'setInnerSpeed', level: speed.value}));
      resCmdWebSocket.send(JSON.stringify({'cmd':'setInnerSpeed', level: speed.value}));

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


  })

  .controller('ipSettingCtrl', function ($scope,$rootScope, edmData, $timeout) {

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
      }, 1500);

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

        if(data.type=='SelDiv') {
          var selector = dataview.getUint8(4);
          var div = dataview.getInt32(8,true);
          var index = SpeedLevel.INNER.indexOf(div)+1;
          if(selector == 0) {
            /*outerelements.value = index;
            outerelements.dispatchEvent(new Event('change'));
            $('#machinespeedlevel').text(index);*/

            $rootScope.machineSpeedLevel = index;
            console.log("外部速度");
          }else {
            /*innerelements.value = index;
            innerelements.dispatchEvent(new Event('change'));
            $('#speedlevel').text(index);*/

            $rootScope.getSpeed = index;
            console.log("内部速度");
          }
        }
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

              contextCoord.lineTo($rootScope.div_pos_x*1000,$rootScope.div_pos_y*1000);
              contextCoord.stroke();

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
      if(!resCmdWebSocketOpen) return;
      resCmdWebSocket.send(JSON.stringify({'cmd':'setOuterSpeed', level: $rootScope.machineSpeedLevel}));

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

    var coordPaint = document.getElementById("coordPaint");
    if(coordPaint && coordPaint.getContext){
      var context = coordPaint.getContext("2d");
      context.beginPath();
      context.lineWidth = 1;
      context.moveTo(0,0);
      var i=0,j=0;
      for(i=0;i<20;i++){
        context.lineTo(10*i,i*i);

      }
      context.stroke();
    }















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
  .controller('checkCtrl', function ($scope, edmData, $rootScope) {
    console.log('checkCtrl');

  });
