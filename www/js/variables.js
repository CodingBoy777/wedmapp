/**
 * Created by allon on 2016/04/05
 */
var findEdgeType = 0;
var findEdgeDir = 0;
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


var resCmdWebSocket;
var resCmdWebSocketOpen;
var resInfoWebSocket;
var resInfoWebSocketOpen;
var ipAddress = "192.168.5.101";
var webIpAddress = "ws://192.168.5.101";

var ioInfo={
  highfrequence: 0,
  waterPump : 0,
  wireTransport : 0,
  wireSpeed : 0,
  current : 0
};

var SpeedLevel = {
  INNER: [1800, 947, 642, 486, 391, 327, 246, 219, 197, 120],

  OUTER: [],

  wireSpeed: [0, 1, 3, 2],
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
