angular.module('ionicApp.ipSettingCtrl', ['ionic'])
  .controller('ipSettingCtrl', function ($scope, $rootScope, edmData, $timeout, $ionicPopup,$state) {

    console.log("ipSettingCtrl");
    var paintFlag = 0;
    $scope.setIpAddress = function(){
      ipAddress = document.getElementById("ipInput").value;
      webIpAddress = "ws://" + ipAddress;
      document.getElementById("information").innerHTML += "IP已设置为" + ipAddress + "</br>"+ "请点击连接按钮" + "</br>";
      console.log("ws://" + ipAddress + ":8080");
    };

    //连接至写好的ip，监听信息
    $scope.ipConnect = function () {
      var flagInfoConnect = 0;var flagCmdConnect = 0;
      resInfoWebSocket = new WebSocket(webIpAddress + ":8081");
      document.getElementById("information").innerHTML += webIpAddress;
      resInfoWebSocket.onerror = function(event){
        console.log('ERROR: ' + event.message);
        document.getElementById("information").innerHTML +="InfoWebSocket:"+event.message;

      };
      resInfoWebSocket.onopen = function(){
        console.log('info succeed!');
        resCmdWebSocketOpen = true;
        document.getElementById("information").innerHTML += "状态端口连接成功"+ "<br />" + webIpAddress + ":8081" + "</br>";
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
        document.getElementById("information").innerHTML += "命令端口连接成功"+ "<br />" + webIpAddress + ":8080" + "</br>";
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
          $ionicPopup.alert({
            title: '连接失败',
            template: '请检查IP和端口是否正确',
            buttons: [{
              text: '好的',
              type: 'button-positive'
            }]
          });
        }
      }, 1000);

      resCmdWebSocket.onmessage = function(event){
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
              document.getElementById("waterPumpStatus").innerHTML = "已关闭";
            }
            else{
              $rootScope.toggleWaterPump = true;
              document.getElementById("waterPumpStatus").innerHTML = "已打开";
            }
            if(ioInfo.highfrequence == 0){
              $rootScope.toggleHighFrequence = false;
              document.getElementById("highFrequenceStatus").innerHTML = "已关闭";
            }
            else{
              $rootScope.toggleHighFrequence = true;
              document.getElementById("highFrequenceStatus").innerHTML = "已打开";
            }

            if(ioInfo.wireTransport == 0){
              $rootScope.toggleWireTransport = false;
              document.getElementById("wireTransportStatus").innerHTML = "已关闭";
            }
            else{
              $rootScope.toggleWireTransport = true;
              document.getElementById("wireTransportStatus").innerHTML = "已打开";
            }
            if($rootScope.toggleAxisUnlock == 0){
              document.getElementById("axisUnlockStatus").innerHTML = "已关闭";
            }
            else{

              document.getElementById("axisUnlockStatus").innerHTML = "已打开";
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
              console.log((dataview.getInt32(8,true)));
              $rootScope.getSpeed = parseInt(div);
              console.log(div);
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

              //if(paintFlag == 0){
              //  contextCoord.moveTo($rootScope.div_pos_x*3,$rootScope.div_pos_y*3);
              //  paintFlag =1;
              //}
              //if(paintFlag == 1){
              //  contextCoord.lineTo($rootScope.div_pos_x*3,$rootScope.div_pos_y*3);
              //  console.log($rootScope.div_pos_x*3,$rootScope.div_pos_y*3);
              //  contextCoord.stroke();
              //}


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



  });
