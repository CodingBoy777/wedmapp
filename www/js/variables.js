/**
 * Created by allon on 2016/04/05
 */

var socket;
var posInfo={
  x : 0,
  y : 0,
  u : 0,
  v : 0
};

var outputValue=0x00;//setIOOutput使用的变量

var resCmdWebSocket;
var resInfoWebSocket;
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
