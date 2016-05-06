function getServerHost() {
//var reg = new RegExp(/[\/pc|\/phone]/);
  host = window.location.hostname+':'+window.location.port;
  var sockettype = window.MozWebSocket || window.WebSocket;
  Socket = new sockettype('ws://'+host);
  Socket.addEventListener('open', function() {
    socketOpen = true;
  });
  Socket.onerror = function(event) {
    console.log('ERROR: ' + event.message);
  };
  Socket.onmessage = function(event) {
    var data = JSON.parse(event.data);
    var dataview = toDataView(data.data);
    if(data.type=='pos'){
      setTimeout(updataCoor(data.data),10)
    }
    else if(data.type=='updateinfo') {
//if(data.error==0) {
      //
      //}else if(data.done){
      //
      //}else{
      //    toArrayBuffer(data.data);
      //
      //}
      var type = dataview.getUint8(2);
      if(type == infoType.FRAME_UPDATE_STATE) {
        var iostatus = dataview.getUint32(4, true); //低位开始读取
        posInfo.x = dataview.getInt32(8, true);
        posInfo.y = dataview.getInt32(12, true);
        posInfo.u = dataview.getInt32(16, true);
        posInfo.v = dataview.getInt32(20, true);
        setTimeout(function(){
          updataCoor(posInfo);
          updataIO(iostatus);
        },10);
      }else if(type == infoType.FRAME_MOVE_DONE) {

      }else if(type == infoType.FRAME_EMG_HARDFAULT_CASE) {

      }else if(type == infoType.FRAME_EMG_POWERCUT_CASE) {

      }else if(type == infoType.FRAME_EMG_WIRECUT_CASE) {

      }
    }
  };
  Socket.onclose = function(event) {
    socketOpen = false;
  };
}
