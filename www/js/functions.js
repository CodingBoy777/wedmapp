/**
 * Created by allon on 2016/3/29.
 */
//function test() {
//  console.log("test");
//  var socket = io.connect($rootScope.ipLocation);
//  socket.send("v-Move is done contraller!!");
//}
//
//
//(function(){
//  var lzlshuju = 100;
//}).call(this);

//这个是师兄电脑版本
//function toDataView(buffer) {
//  console.log(buffer.data.length);
//  var arraybuffer = new ArrayBuffer(buffer.data.length);
//  var dataview = new DataView(arraybuffer, 0);
//  for(var i=0; i < buffer.data.length; i++) {
//    dataview.setUint8(i, buffer.data[i]);
//  }
//  return dataview;
//}

//这个是服务器版本
/*function toDataView(buffer) {
  //console.log(buffer.length);
  var arraybuffer = new ArrayBuffer(buffer.length);
  var dataview = new DataView(arraybuffer, 0);
  for(var i=0; i < buffer.length; i++) {
    dataview.setUint8(i, buffer[i]);
  }
  return dataview;
}*/


//适应各个服务器的版本
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


//数据格式化
function numFormat(num) {
  var result = (num/1000).toFixed(3).toString();
  var index = result.indexOf(".");
  if(result<0)
  {
    if(index<6){
      result = -result;
      var zeros = "-";
      for(var i = 0; i <6-index; i++)
      {
        zeros = zeros + "0";
      }
      result = zeros + result;
    }
  }
  else{
    if(index<5){
      var zeros = "";
      for(var i = 0; i <5-index; i++)
      {
        zeros = zeros + "0";
      }
      result = zeros + result;
    }
  }
  //console.log(result)
  return result;
}

