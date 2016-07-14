/**
 * Created by huanggw on 16-5-16.
 */
var socketInfoOpen;
var SocketInfo ;
var posInfo = {
    x: 0,
    y: 0,
    u: 0,
    v: 0
};
var infoType = {
    FRAME_MOVE_DONE : 0x80,
    FRAME_UPDATE_STATE : 0x81,
    FRAME_EMG_WIRECUT_CASE : 0x82,
    FRAME_EMG_POWERCUT_CASE : 0x83,
    FRAME_EMG_HARDFAULT_CASE : 0x84
};

var ioInfo = {
    waterPump: 0,
    wireTransport: 0,
    highfrequence: 0,
    wireSpeed: 0,
    current: 0
};

function toDataView(buffer) {
    var data;
    if(buffer.hasOwnProperty('data')) {
        data = buffer.data;
    } else {
        data = buffer;
    }
    var arraybuffer = new ArrayBuffer(data.length);
    var dataview = new DataView(arraybuffer, 0);
    for(var i=0; i < data.length; i++) {
        dataview.setUint8(i, data[i]);
    }
    return dataview;
}


function getInfo(){
    if(!socketInfoOpen) return;
    SocketInfo.send(JSON.stringify({'cmd':'getUpdateInfo'}));
    setTimeout(getInfo, 200);
}

onmessage =function(event) {
    if(event.data.cmd=="start")
    {
        SocketInfo = new WebSocket('ws://'+event.data.host+':'+8081);
        SocketInfo.addEventListener('open', function() {
            console.log("connected to 8081!")
            socketInfoOpen = true;
        });
        SocketInfo.onerror = function(event) {
            console.log('ERROR: ' + event.message);
        };
        SocketInfo.onmessage = function(event) {
            var data = JSON.parse(event.data);
            console.log(data.type);
            var dataview = toDataView(data.data);
            if(data.type=='updateinfo') {
                var type = dataview.getUint8(2);
                if(type == infoType.FRAME_UPDATE_STATE) {
                    var iostatus = dataview.getUint16(6, true); //低位开始读取
                    var x = dataview.getInt32(8, true);
                    var y = dataview.getInt32(12, true);
                    var u = dataview.getInt32(16, true);
                    var v = dataview.getInt32(20, true);
                    if(x!=posInfo.x || y!=posInfo.y || u!=posInfo.u || v!=posInfo.v)
                    {
                        posInfo.x = x;
                        posInfo.y = y;
                        posInfo.u = u;
                        posInfo.v = v;
                        postMessage({type:"coor",data:posInfo});
                    }
                }
                //else if(type == infoType.FRAME_MOVE_DONE) {
                //    var cause = dataview.getInt32(8, true);
                //    var tmpCause=(cause>>28)&0xf;
                //    console.log(tmpCause)
                //}
                //else if(type == infoType.FRAME_EMG_HARDFAULT_CASE) {
                //}
                //else if(type == infoType.FRAME_EMG_POWERCUT_CASE) {
                //}
                //else if(type == infoType.FRAME_EMG_WIRECUT_CASE) {
                //}
            }
            else if(data.type=="done") {
                console.log(data.data)
                postMessage(data);
            }
        }
        SocketInfo.onclose = function(event) {
            socketInfoOpen = false;
        };
        console.log("worker start!!!")
        setTimeout(getInfo,20);
    }
};
