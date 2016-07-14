/**
 * Created by allon on 2016/7/13.
 */

onmessage = function (event) {

  var data = event.data;
  console.log(data);
  postMessage("this message come from worker");
};
