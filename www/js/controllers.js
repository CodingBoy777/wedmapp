angular.module('ionicApp.controllers', [])
  .controller('MainCtrl', function ($scope, $ionicSideMenuDelegate, $rootScope) {

    $rootScope.toggleWaterPump = false;
    $rootScope.toggleHighFrequence = true;
    $rootScope.toggleWireTransport = false;
    $rootScope.wireSpeedValue = 0;
    $rootScope.currentValue = 0;

    $rootScope.div_pos_x = numFormat(0);
    $rootScope.div_pos_y = numFormat(0);
    $rootScope.div_pos_u = numFormat(0);
    $rootScope.div_pos_v = numFormat(0);

    $scope.toggleLeft = function () {
      $ionicSideMenuDelegate.toggleLeft();
    };
  })

  .controller('HomeTabCtrl', function ($scope,edmData,$rootScope) {
    console.log('HomeTabCtrl');

  })

  .controller('prepareCtrl', function ($scope, $rootScope, edmData, $timeout) {

    $scope.getSpeed = 2;//设置速度初始值

    //刷新IP地址
    /*$scope.refreshIp= function () {
      //socket = io.connect($rootScope.ipLocation);
      resCmdWebSocket.close();
      resCmdWebSocket = new WebSocket("ws://"+ipAddress+":8080");
      resCmdWebSocket.onopen = function(){
        console.log('chengogong!');
        alert("刷新成功！");
      };
    };*/
    speedChange = function(){

      console.log(JSON.stringify({'cmd':'setInnerSpeed', level: speed.value}));
      resCmdWebSocket.send(JSON.stringify({'cmd':'setInnerSpeed', level: speed.value}));

    };

    ////关于buffer的函数留待以后用 不删除
    //$scope.testB3= function () {
    //  var buff1 = edmData.getBuffer();
    //  socket.send(buff1);
    //  socket.on("serverMessage", function (data) {
    //    console.log(data);
    //  });
    //  socket.on("messageBuffer", function (data) {
    //    console.log(data);
    //    var resBuffer =  new DataView(data);
    //    var a1 = resBuffer.getUint8(0);
    //    console.log(a1);
    //    if(resBuffer[2]==17){
    //      //infoGet.pos_x = resBuffer.readInt32LE(4);
    //      //infoGet.pos_y = resBuffer.readInt32LE(8);
    //      //infoGet.pos_u = resBuffer.readInt32LE(12);
    //      //infoGet.pos_v = resBuffer.readInt32LE(16);
    //      console.log("出来了");
    //    }
    //  });
    //
    //  console.log("测试按钮启动");
    //
    //};


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



    //获取坐标关于buffer不删除
    //$scope.getCoord=function (){
    //  var buffPos = new Buffer(256);
    //  buffPos.fill(0);
    //  buffPos = bufferHandle.getBufferHead(0,CMD.FRAME_GET_POS);
    //  buffPos = bufferHandle.getBufferTail(buffPos);
    //  socket.send(buffPos);
    //  socket.on("message",function(data){
    //    if(data[2]==CMD.FRAME_GET_POS){
    //      //infoGet.pos_x = buffer.readInt32LE(4);
    //      //infoGet.pos_y = buffer.readInt32LE(8);
    //      //infoGet.pos_u = buffer.readInt32LE(12);
    //      //infoGet.pos_v = buffer.readInt32LE(16);
    //      infoGet.pos_x = 10.0;
    //      infoGet.pos_y = 20.0;
    //      infoGet.pos_u = 30.0;
    //      infoGet.pos_v = 40.0;
    //      $scope.div_pos_x = infoGet.pos_x;
    //      $scope.div_pos_y = infoGet.pos_y;
    //      $scope.div_pos_u = infoGet.pos_u;
    //      $scope.div_pos_v = infoGet.pos_v;
    //
    //    }
    //    else {
    //      alert("获取坐标失败");
    //    }
    //  });
    //};

  })

  .controller('settingsCtrl', function ($scope,$rootScope, edmData) {
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
      resInfoWebSocket.onopen = function(){
        console.log('info succeed!');
        document.getElementById("information").innerHTML += "info connect success"+ "<br />" + webIpAddress + ":8081" + "</br>";
        flagInfoConnect = 1;
        //alert("connection success");
      };

      resCmdWebSocket = new WebSocket(webIpAddress + ":8080");
      resCmdWebSocket.onopen = function(){
        console.log('cmd succeed!');
        document.getElementById("information").innerHTML += "cmd connect success"+ "<br />" + webIpAddress + ":8080" + "</br>";
        flagCmdConnect = 1;
        //alert("connection success");
      };

      //检查是否连接成功
      setTimeout(function () {
        if (flagInfoConnect == 1 && flagCmdConnect == 1) {
          alert("connection success");
        }
        else {
          alert("connection failed");
        }
      }, 10);

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

          $rootScope.$apply(function(){
            if(ioInfo.highfrequence == 0){
              $rootScope.toggleHighFrequence = false;
            }
            else{
              $rootScope.toggleHighFrequence = true;
            }
            if(ioInfo.waterPump == 0){
              $rootScope.toggleWaterPump = false;
            }
            else{
              $rootScope.toggleWaterPump = true;
            }
            if(ioInfo.wireTransport == 0){
              $rootScope.toggleWireTransport = false;
            }
            else{
              $rootScope.toggleWireTransport = true;
            }

            $rootScope.wireSpeedValue = ioInfo.wireSpeed;
            $rootScope.currentValue = ioInfo.current;

          });
        }

        if(data.type=='SelDiv') {
          var selector = dataview.getUint8(4);
          var div = dataview.getInt32(8,true);
          var index = SpeedLevel.INNER.indexOf(div)+1;
          console.log(selector,SpeedLevel.INNER.indexOf(div));
          if(selector == 0) {
            /*outerelements.value = index;
            outerelements.dispatchEvent(new Event('change'));
            $('#machinespeedlevel').text(index);*/

            console.log("外部速度待完善");
          }else {
            /*innerelements.value = index;
            innerelements.dispatchEvent(new Event('change'));
            $('#speedlevel').text(index);*/

            console.log("内部速度待完善" + index);
          }
        }

      };

      //以下是info口的状态

      //每隔n秒获取坐标
      var resGetCoor = setInterval(function () {
        resInfoWebSocket.send(JSON.stringify({'cmd':'getUpdateInfo'}));
      }, 300);

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
              $scope.$apply();
              //updataCoor(posInfo);
              //updataIO(iostatus);
            }, 10);
          } else if (type == INFO.FRAME_MOVE_DONE) {

          } else if (type == INFO.FRAME_EMG_HARDFAULT_CASE) {

          } else if (type == INFO.FRAME_EMG_POWERCUT_CASE) {

          } else if (type == INFO.FRAME_EMG_WIRECUT_CASE) {

          }
        }
      };
    };

  })
  .controller('filesCtrl', function ($scope, edmData, $rootScope) {
    console.log('filesCtrl');

  })

  .controller('testCtrl', function ($scope, edmData, $rootScope) {
    console.log('testCtrl');
    //下面是测试 可以删除可以留着
   /* console.log(CMD.FRAME_GET_POS);
    //var CMD = edmData.all();
    var buffPos = new ArrayBuffer(256);
    buffPos = bufferHandle.getBufferHead(0, CMD.FRAME_GET_POS);
    buffPos = bufferHandle.getBufferTail(buffPos);
    var testBuffer = new Uint8Array(buffPos);
    console.log(buffPos);
    console.log(testBuffer);
    console.log(CMD.FRAME_GET_POS);
    edmData.inputBuffer(testBuffer);
    */
    setTimeout(function(){
      $scope.$apply(function(){
        $scope.toggleWaterPump=true;
      });
    },5);


    //获取IO状态
    $scope.getIOState = function(){
      resCmdWebSocket.send(JSON.stringify({'cmd': 'getIOState'}));

    }

    $scope.getSelDiv = function(){
      resCmdWebSocket.send(JSON.stringify({'cmd': 'getSelDiv'}));

    }




  })
  .controller('checkCtrl', function ($scope, edmData, $rootScope) {
    console.log('checkCtrl');

  });
