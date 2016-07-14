/**
 * Created by allon on 2016/7/13.
 */



function toDataView(buffer) {
  var data;
  if(buffer.hasOwnProperty('data')) {
    data = buffer.data;
  } else {
    data = buffer;
  }
  var arraybuffer = new ArrayBuffer(data.length);
  var dataview = new DataView(arraybuffer, 0);
  for(var i=0; i < data.length; i++) {
    dataview.setUint8(i, data[i]);
  }
  return dataview;
}

var beginFlag = 0, stopFlag = 0;

var isfindEdgeStart = 0;

var settings = {
  findEdgeSpeed:[200,40],
  rollBack: 400,
  ignoreDistance: 40,
  innerSpeed: [1800, 947, 642, 486, 391, 327, 246, 219, 197, 120]
};

var paintScale = 0.002;

var socket;
var posInfo={
  x : 0,
  y : 0,
  u : 0,
  v : 0
};

var outputValue=0x00;//setIOOutput使用的变量

var flagInfoConnect = 0;
var flagCmdConnect = 0;
var resCmdWebSocket;
var resCmdWebSocketOpen;
var resInfoWebSocket;
var resInfoWebSocketOpen;

var ioInfo={
  highfrequence: 0,
  waterPump : 0,
  wireTransport : 0,
  wireSpeed : 0,
  current : 0
};

var SpeedLevel = {
  innerSpeed: [1800, 947, 642, 486, 391, 327, 246, 219, 197, 120],
  outerSpeed: [10, 5, 3.33, 2.5, 2, 1.67, 1.43, 1.33, 1.17, 1.11, 1],
  wireSpeed: [0, 1, 3, 2]
};

var LEVEL = {
  wireSpeed: [0, 1, 3, 2],
  pulseWidth: [],
  pulseInterval: [],
  current: [0,8,4,12],
  innerSpeed: [1800, 947, 642, 486, 391, 327, 246, 219, 197, 120],
  outerSpeed: [10, 5, 3.33, 2.5, 2, 1.67, 1.43, 1.33, 1.17, 1.11, 1]
};

var infoType = {
  FRAME_MOVE_DONE : 0x80,
  FRAME_UPDATE_STATE : 0x81,
  FRAME_EMG_WIRECUT_CASE : 0x82,
  FRAME_EMG_POWERCUT_CASE : 0x83,
  FRAME_EMG_HARDFAULT_CASE : 0x84
};

var  CmdGPIOOutType = {
  OUT0_WIREVEL_3_SW : 0x1<<0,
  OUT1_WIREVEL_2_SW : 0x1<<1,//pass
  OUT2_WIREVEL_1_SW : 0x1<<2,//pass
  OUT3_WIRESTRESS_SW : 0x1<<3,
  OUT4_PUMP_SW : 0x1<<4,//pass
  OUT5_WIRE_SW : 0x1<<5,//pass
  OUT6_MAINPOWER_SW : 0x1<<6,
  OUT7_LIGHT_SW : 0x1<<7,
  OUT8_PWMSEL1_SW : 0x1<<8,//pass
  OUT9_PWMSEL2_SW : 0x1<<9,//pass
  OUT10_PWMSEL3_SW : 0x1<<10,//pass
  OUT11_PWMSEL4_SW : 0x1<<11,//pass
  OUT12_SHORTEDGE_SW : 0x1<<12,//pass
  OUT13_VF_SW : 0x1<<13,//pass
  OUT14_SHUTDOWN : 0x1<<14
};



function getInfo(){
  if(!resInfoWebSocketOpen) return;
  resInfoWebSocket.send(JSON.stringify({'cmd':'getUpdateInfo'}));
  setTimeout(getInfo, 200);
  console.log('已经发送');
}

onmessage = function (event) {

  if(event.data.cmd=="start"){
    console.log("host"+event.data.host);
    resInfoWebSocket = new WebSocket(event.data.host + ":8081");

    resInfoWebSocket.onerror = function(event){
      console.log('ERROR: ' + event.message);

      //这里需要修改，
      //document.getElementById("information").innerHTML +="InfoWebSocket:"+event.message;

    };
    resInfoWebSocket.onopen = function(){
      console.log('info succeed!');
      resInfoWebSocketOpen = true;

      //这里需要修改，
      //document.getElementById("information").innerHTML += "状态端口连接成功"+ "<br />" + webIpAddress + ":8081" + "</br>";
      flagInfoConnect = 1;

    };

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

        if (type == infoType.FRAME_UPDATE_STATE) {
          var iostatus = dataview.getUint16(6, true); //低位开始读取
          posInfo.x = dataview.getInt32(8, true);
          posInfo.y = dataview.getInt32(12, true);
          posInfo.u = dataview.getInt32(16, true);
          posInfo.v = dataview.getInt32(20, true);
          postMessage({type:"coor",data:posInfo});

        } else if (type == infoType.FRAME_MOVE_DONE) {

        } else if (type == infoType.FRAME_EMG_HARDFAULT_CASE) {
          document.getElementById("information").innerHTML += "硬件故障";
        } else if (type == infoType.FRAME_EMG_POWERCUT_CASE) {
          document.getElementById("information").innerHTML += "掉电异常";
        } else if (type == infoType.FRAME_EMG_WIRECUT_CASE) {
          document.getElementById("information").innerHTML += "断丝异常";
        }
      }
      else if(data.type =="done"){
        console.log(data.data);
      }
    };

    resInfoWebSocket.onclose = function(){
      resInfoWebSocketOpen = false;
      console.log("resInfoWebSocket关闭" + "<br>");
    };


    setTimeout(getInfo,20);

  }

};
