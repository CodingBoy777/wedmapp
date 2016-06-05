/**
 * Created by HGW on 2015/8/18.
 * modified by LZL on 2016/5/16
 *
 */
/**
 * a function to interpreter gcode to json format
 *
 * 将G代码转化为json格式数据
 *	 {
 *	 	"originalCode": code,
 *	 	"handledCode": {"N":null,"words":[["G",1],["X",1],["Y",2],["Z",3],["F",120]],"unkonwn":[item1,item2,...]}
 *		"type": "line", //加工类型
 *		"line": i, //行序列
 *		"cmd":
 *		{
 *			'lgh': parseInt(lgh),
 *			'cmd': 'G1',
 *			'sp': {'X': sx, 'Y': sy}, //sp、ep分别代表起点终点;
 *			'ep': {'X': ex，'Y': ey},
 *			'offset': {'X':offsetx, 'Y':offsety}, //圆弧时候表示起点偏离圆心距离,直线时候为0;
 *			'center': {'X': rx，'Y': ry}, //center of circle
 *			'Angle': {'startA': startAngle, 'spanA': spanAngle},
 *			'direction': 1/-1, //1ccw,-1cw
 *			'f': f
 *		}
 *	 }
 *
 * How to use :
 * 		var myInterpreter = new gcodeInterpreter(gcode in string);
 * 		myInterpreter.interpreter();
 * Done!!!
 */

var xValueMax = 0, xValueMin = 0, yValueMax = 0, yValueMin = 0;

xValueMax = parseFloat(xValueMax);
xValueMin = parseFloat(xValueMin);
yValueMax = parseFloat(yValueMax);
yValueMin = parseFloat(yValueMin);


var gcodeInterpreter = function(gcode) {
	this.gcode = gcode;
}
gcodeInterpreter.prototype.interpreter = function() {
	return codeToJson(gcodeToArray(this.gcode));
}

/*step one*/
function gcodeToArray(code) {
	var str = '';
	if(!code.match(/\n\r/)) {
		//将代码去除空行按行拆分,textarea中换行符为\n而不是\r\n;
		str = '\n' + code.toUpperCase().replace(/\n/g,'\r\n').replace(/SIN|COS|TAN|COT/g,function($1){return $1.toLowerCase()}) + '\r';
	}
	else str = '\n' + code.toUpperCase() + '\r';
	var codeArray = str.replace(/\n\r/g,'').match(/\n.*\r/g);
	var len = codeArray.length;
	for(var i = 0; i < len; i++ ) {
		codeArray[i] = codeArray[i].replace(/\n/,"");
	}
	return codeArray;
}
/*step two*/
function codeToJson(array){
	var jsonArray = [];
	var f = 250, //默认进给速度 250μm/s
		spindle = 0, //主轴状态
		sx = setStartX(),  //直线起点
		sy = setStartY(),
		preG = null; //上一条中出现G01,G02,G03记录
	var lines = array;
	var len = array.length;



	for(var i = 0; i < len; i++ ){
		var str = lines[i];
		var xValue = 0,xLghValue = 0,
			yValue = 0,yLghValue = 0,
      thirdBValue = 0,
			iValue = 0,
			jValue = 0,
			cx = 0,  //圆心坐标
			cy = 0,
			r = 0, //半径,直线为0
			startAngle = 0, //in degree
			spanAngle = 0,
			direction = 0,
      quadrant = 0,//象限
			lgh = 0, //加工长度
      gFlag = 0,//gflg=0表示GX，gflag=1表示GY
			type = null; //加工路径类型，default line



    xValue = parseFloat(xValue);
    xLghValue = parseFloat(xLghValue);
    yValue = parseFloat(yValue);
    yLghValue = parseFloat(yLghValue);
    thirdBValue = parseFloat(thirdBValue);
    iValue = parseFloat(iValue);
    jValue = parseFloat(jValue);
    cx = parseFloat(cx);  //圆心坐标
    cy = parseFloat(cy);
    r = parseFloat(r); //半径,直线为0
    startAngle = parseFloat(startAngle); //in degree
    spanAngle = parseFloat(spanAngle);
    lgh = parseFloat(); //加工长度

    var queue = str.replace(/\(.*\)/g,'').match(/([A-Z]+\d*\.?\d*)|([A-Z]+\[.*\])/g);//修改过

    var codeObj = {
			'N': null,
			'words': [],
			'unknown': []
		};
		//到目前为止，控制板能完成的定位方式为以开始加工的坐标为绝对坐标原点。
		//词法分析循环
		for(var j = 0; j < queue.length; j++) {
			var cur = queue[j]
			//if(cur.match(/N/)) {
			//	codeObj.N = cur.replace(/N/,'');
			//}

      if(cur.match(/B/)) {
        if((cur.match(/B\d+\.?\d*|(B\[.*\])/))&&j == 0) {
          var tempE = cur.replace(/B/,'')//.replace(/\[?/g,'').replace(/\]?/g,'');
          codeObj.words.push(['X', tempE]);
          xLghValue = parseFloat(calculate(toRPolish(getTrigValue(tempE))));//是否可以去掉

        }
        else if((cur.match(/B\d+\.?\d*|(B\[.*\])/))&&j == 1) {
          var tempE = cur.replace(/B/,'')//.replace(/\[?/g,'').replace(/\]?/g,'');
          codeObj.words.push(['Y', tempE]);
          yLghValue = parseFloat(calculate(toRPolish(getTrigValue(tempE))));

        }
        else if((cur.match(/B\d+\.?\d*|(B\[.*\])/))&&j == 2) {
          var tempE = cur.replace(/B/,'')//.replace(/\[?/g,'').replace(/\]?/g,'');
          codeObj.words.push(['thirdB', tempE]);
          thirdBValue = parseFloat(calculate(toRPolish(getTrigValue(tempE))));

        }

      }

      else if(cur.match(/G/)) {
        switch(cur){
          case 'GX':
            gFlag = 0;
            break;
          case 'GY':
            gFlag = 1;
            break;
        }
      }

      else if(cur.match(/R|L/)) {
        codeObj.words.push(['TYPE', cur]);
        switch (cur) {
          case 'NR1':
            type = 'arc';
            quadrant = 1;
            direction = 1;
            break;
          case 'NR2':
            type = 'arc';
            quadrant = 2;
            direction = 1;
            break;
          case 'NR3':
            type = 'arc';
            quadrant = 3;
            direction = 1;
            break;
          case 'NR4':
            type = 'arc';
            quadrant = 4;
            direction = 1;
            break;

          case 'SR':
          case 'SR1':
            type = 'arc';
            quadrant = 1;
            direction = -1;
            break;
          case 'SR2':
            type = 'arc';
            quadrant = 2;
            direction = -1;
            break;
          case 'SR3':
            type = 'arc';
            quadrant = 3;
            direction = -1;
            break;
          case 'SR4':
            type = 'arc';
            quadrant = 4;
            direction = -1;
            break;

          case 'L1':
            type = 'line';
            quadrant = 1;
            break;
          case 'L2':
            type = 'line';
            quadrant = 2;
            break;
          case 'L3':
            type = 'line';
            quadrant = 3;
            break;
          case 'L4':
            type = 'line';
            quadrant = 4;
            break;

          default :
            break;
        }
      }

			else {
				codeObj.unknown.push(cur);
				alert("error: " + cur +" is unknown command !")
				throw "error: " + cur +" is unknown command";
			}
		}

    if(type == 'line') {
      lgh = Math.round(Math.sqrt(Math.pow(xLghValue, 2)+Math.pow(yLghValue, 2)));

      if(quadrant == 1){
        xValue = sx + xLghValue;
        yValue = sy + yLghValue;
      }
      else if(quadrant == 2){
        xValue = sx - xLghValue;
        yValue = sy + yLghValue;
      }
      else if(quadrant == 3){
        xValue = sx - xLghValue;
        yValue = sy - yLghValue;
      }
      else if(quadrant == 4){
        xValue = sx + xLghValue;
        yValue = sy - yLghValue;
      }
      else{
        console.log("象限有误");
      }

    }
    else if(type == 'arc') {

      r = parseFloat(Math.sqrt(xLghValue*xLghValue+yLghValue*yLghValue).toFixed(3));
      if(direction == -1){//顺圆

        if(quadrant == 1){//顺圆第一象限
          cx = parseFloat(sx - xLghValue); //圆心
          cy = parseFloat(sy - yLghValue);
          startAngle = Math.acos(xLghValue / r)* 180 / Math.PI;

          if(gFlag == 0){//GX
            if(thirdBValue < (r - xLghValue)){
              xValue = sx + thirdBValue;
            }
            else if(thirdBValue < (3*r - xLghValue)){
              xValue = cx + 2*r - thirdBValue - xLghValue;
            }
            else if(thirdBValue <= 4*r){
              xValue = cx + thirdBValue - 4*r + xLghValue;
            }
            else{
              console.log("GY圆弧重复");
            }

            var resyLgh = parseFloat(Math.sqrt(r*r - (xValue - cx)*(xValue - cx)).toFixed(3));
            if(thirdBValue<(r - xLghValue)){
              yValue = cy + resyLgh;
            }
            else if(thirdBValue < (3*r - xLghValue)){
              yValue = cy - resyLgh;
            }
            else if(thirdBValue <= 4*r){
              yValue = cy + resyLgh;
            }
            else{
              console.log('y值有错误');
            }
          }

          if(gFlag == 1){//GY
            if(thirdBValue < (r + yLghValue)){
              yValue = sy -  thirdBValue;
            }
            else if(thirdBValue < (3*r + yLghValue)){
              yValue = cy + thirdBValue - 2*r -yLghValue;
            }
            else if(thirdBValue <= 4*r){
              yValue = sy + ( 4*r - thirdBValue);
            }
            else{
              console.log("GX圆弧重复");
            }

            var resxLgh = parseFloat(Math.sqrt(r*r - (yValue - cy)*(yValue - cy)).toFixed(3));
            if(thirdBValue<(r + yLghValue)){
              xValue = cx + resxLgh;
            }
            else if(thirdBValue < (3*r + yLghValue)){
              xValue = cx - resxLgh;
            }
            else if(thirdBValue <= 4*r){
              xValue = cx + resxLgh;
            }
            else{
              console.log('y值有错误');
            }

          }

          spanAngle = getAngle(cx, cy, sx, sy, xValue, yValue, r, direction);
          lgh = Math.round(r * spanAngle / 180 * Math.PI);

        }

        if(quadrant == 4){//顺圆第4象限
          cx = parseFloat(sx - xLghValue); //圆心
          cy = parseFloat(sy + yLghValue);
          startAngle = -Math.acos(xLghValue / r)* 180 / Math.PI;

          if(gFlag == 0){//GX 靠近X
            if(thirdBValue < (r + xLghValue)){
              xValue = sx - thirdBValue;
            }
            else if(thirdBValue < (3*r + xLghValue)){
              xValue = cx + thirdBValue - 2*r - xLghValue;
            }
            else if(thirdBValue <= 4*r){
              xValue = sx + ( 4*r - thirdBValue);
            }
            else{
              console.log("GY圆弧重复");
            }//和第一象限的GY是一样的

            var resyLgh = parseFloat(Math.sqrt(r*r - (xValue - cx)*(xValue - cx)).toFixed(3));
            if(thirdBValue<(r + xLghValue)){
              yValue = cy - resyLgh;
            }
            else if(thirdBValue < (3*r + xLghValue)){
              yValue = cy + resyLgh;
            }
            else if(thirdBValue <= 4*r){
              yValue = cy - resyLgh;
            }
            else{
              console.log('y值有错误');
            }
          }

          if(gFlag == 1){//GY 第4象限
            if(thirdBValue < (r - yLghValue)){
              yValue = sy -  thirdBValue;
            }
            else if(thirdBValue < (3*r - yLghValue)){
              yValue = cy + thirdBValue - 2*r +yLghValue;
            }
            else if(thirdBValue <= 4*r){
              yValue = sy + ( 4*r - thirdBValue);
            }
            else{
              console.log("GY圆弧重复");
            }

            var resxLgh = parseFloat(Math.sqrt(r*r - (yValue - cy)*(yValue - cy)).toFixed(3));
            if(thirdBValue<(r - yLghValue)){
              xValue = cx + resxLgh;
            }
            else if(thirdBValue < (3*r - yLghValue)){
              xValue = cx - resxLgh;
            }
            else if(thirdBValue <= 4*r){
              xValue = cx + resxLgh;
            }
            else{
              console.log('y值有错误');
            }

          }

          spanAngle = getAngle(cx, cy, sx, sy, xValue, yValue, r, direction);
          lgh = Math.round(r * spanAngle / 180 * Math.PI);

        }



        if(quadrant == 3){//顺圆第三象限
          cx = parseFloat(sx + xLghValue); //圆心
          cy = parseFloat(sy + yLghValue);
          startAngle = Math.acos(xLghValue / r)* 180 / Math.PI - 180;

          if(gFlag == 0){//GX 靠近X
            if(thirdBValue < (r - xLghValue)){
              xValue = sx - thirdBValue;
            }
            else if(thirdBValue < (3*r - xLghValue)){
              xValue = cx + thirdBValue - 2*r + xLghValue;
            }
            else if(thirdBValue <= 4*r){
              xValue = sx + ( 4*r - thirdBValue);
            }
            else{
              console.log("GY圆弧重复");
            }//和第一象限的GY是一样的

            var resyLgh = parseFloat(Math.sqrt(r*r - (xValue - cx)*(xValue - cx)).toFixed(3));
            if(thirdBValue<(r - xLghValue)){
              yValue = cy - resyLgh;
            }
            else if(thirdBValue < (3*r - xLghValue)){
              yValue = cy + resyLgh;
            }
            else if(thirdBValue <= 4*r){
              yValue = cy - resyLgh;
            }
            else{
              console.log('y值有错误');
            }
          }

          if(gFlag == 1){//GY
            if(thirdBValue < (r + yLghValue)){
              yValue = sy + thirdBValue;
            }
            else if(thirdBValue < (3*r + yLghValue)){
              yValue = cy - thirdBValue + 2*r +yLghValue;
            }
            else if(thirdBValue <= 4*r){
              yValue = sy - ( 4*r - thirdBValue);
            }
            else{
              console.log("GY圆弧重复");
            }

            var resxLgh = parseFloat(Math.sqrt(r*r - (yValue - cy)*(yValue - cy)).toFixed(3));
            if(thirdBValue<(r + yLghValue)){
              xValue = cx - resxLgh;
            }
            else if(thirdBValue < (3*r + yLghValue)){
              xValue = cx + resxLgh;
            }
            else if(thirdBValue <= 4*r){
              xValue = cx - resxLgh;
            }
            else{
              console.log('y值有错误');
            }

          }

          spanAngle = getAngle(cx, cy, sx, sy, xValue, yValue, r, direction);
          lgh = Math.round(r * spanAngle / 180 * Math.PI);

        }

        if(quadrant == 2){//顺圆第2象限
          cx = parseFloat(sx + xLghValue); //圆心
          cy = parseFloat(sy - yLghValue);
          startAngle = -Math.acos(xLghValue / r)* 180 / Math.PI - 180;

          if(gFlag == 0){//GX 靠近X
            if(thirdBValue < (r + xLghValue)){
              xValue = sx + thirdBValue;
            }
            else if(thirdBValue < (3*r + xLghValue)){
              xValue = cx - thirdBValue + 2*r + xLghValue;
            }
            else if(thirdBValue <= 4*r){
              xValue = sx - ( 4*r - thirdBValue);
            }
            else{
              console.log("GY圆弧重复");
            }//和第一象限的GY是一样的

            var resyLgh = parseFloat(Math.sqrt(r*r - (xValue - cx)*(xValue - cx)).toFixed(3));
            if(thirdBValue<(r + xLghValue)){
              yValue = cy + resyLgh;
            }
            else if(thirdBValue < (3*r + xLghValue)){
              yValue = cy - resyLgh;
            }
            else if(thirdBValue <= 4*r){
              yValue = cy + resyLgh;
            }
            else{
              console.log('y值有错误');
            }
          }

          if(gFlag == 1){//GY
            if(thirdBValue < (r - yLghValue)){
              yValue = sy + thirdBValue;
            }
            else if(thirdBValue < (3*r - yLghValue)){
              yValue = cy - thirdBValue + 2*r - yLghValue;
            }
            else if(thirdBValue <= 4*r){
              yValue = sy - ( 4*r - thirdBValue);
            }
            else{
              console.log("GY圆弧重复");
            }

            var resxLgh = parseFloat(Math.sqrt(r*r - (yValue - cy)*(yValue - cy)).toFixed(3));
            if(thirdBValue<(r - yLghValue)){
              xValue = cx - resxLgh;
            }
            else if(thirdBValue < (3*r - yLghValue)){
              xValue = cx + resxLgh;
            }
            else if(thirdBValue <= 4*r){
              xValue = cx - resxLgh;
            }
            else{
              console.log('y值有错误');
            }

          }
          spanAngle = getAngle(cx, cy, sx, sy, xValue, yValue, r, direction);
          lgh = Math.round(r * spanAngle / 180 * Math.PI);

        }

      }


      if(direction == 1){//逆圆

        if(quadrant == 1){//逆圆第一象限
          cx = parseFloat(sx - xLghValue); //圆心
          cy = parseFloat(sy - yLghValue);
          startAngle = Math.acos(xLghValue / r)* 180 / Math.PI;

          if(gFlag == 0){//GX
            if(thirdBValue < (r + xLghValue)){
              xValue = sx - thirdBValue;
            }
            else if(thirdBValue < (3*r + xLghValue)){
              xValue = cx - 2*r + thirdBValue - xLghValue;
            }
            else if(thirdBValue <= 4*r){
              xValue = sx + (4*r - thirdBValue) ;
            }
            else{
              console.log("GY圆弧重复");
            }

            var resyLgh = parseFloat(Math.sqrt(r*r - (xValue - cx)*(xValue - cx)).toFixed(3));
            if(thirdBValue<(r + xLghValue)){
              yValue = cy + resyLgh;
            }
            else if(thirdBValue < (3*r + xLghValue)){
              yValue = cy - resyLgh;
            }
            else if(thirdBValue <= 4*r){
              yValue = cy + resyLgh;
            }
            else{
              console.log('y值有错误');
            }
          }

          if(gFlag == 1){//GY
            if(thirdBValue < (r - yLghValue)){
              yValue = sy +  thirdBValue;
            }
            else if(thirdBValue < (3*r - yLghValue)){
              yValue = cy - thirdBValue + 2*r -yLghValue;
            }
            else if(thirdBValue <= 4*r){
              yValue = sy - ( 4*r - thirdBValue);
            }
            else{
              console.log("GX圆弧重复");
            }

            var resxLgh = parseFloat(Math.sqrt(r*r - (yValue - cy)*(yValue - cy)).toFixed(3));
            if(thirdBValue<(r - yLghValue)){
              xValue = cx + resxLgh;
            }
            else if(thirdBValue < (3*r - yLghValue)){
              xValue = cx - resxLgh;
            }
            else if(thirdBValue <= 4*r){
              xValue = cx + resxLgh;
            }
            else{
              console.log('y值有错误');
            }

          }

          //spanAngle = getAngle(cx, cy, sx, sy, xValue, yValue, r, direction);
          //lgh = Math.round(r * spanAngle / 180 * Math.PI);

        }

        if(quadrant == 2){//逆圆第2象限
          cx = parseFloat(sx + xLghValue); //圆心
          cy = parseFloat(sy - yLghValue);
          startAngle = -Math.acos(xLghValue / r)* 180 / Math.PI + 180;

          if(gFlag == 0){//GX 靠近X
            if(thirdBValue < (r - xLghValue)){
              xValue = sx - thirdBValue;
            }
            else if(thirdBValue < (3*r - xLghValue)){
              xValue = cx + thirdBValue - 2*r + xLghValue;
            }
            else if(thirdBValue <= 4*r){
              xValue = sx + ( 4*r - thirdBValue);
            }
            else{
              console.log("GY圆弧重复");
            }

            var resyLgh = parseFloat(Math.sqrt(r*r - (xValue - cx)*(xValue - cx)).toFixed(3));
            if(thirdBValue<(r - xLghValue)){
              yValue = cy + resyLgh;
            }
            else if(thirdBValue < (3*r - xLghValue)){
              yValue = cy - resyLgh;
            }
            else if(thirdBValue <= 4*r){
              yValue = cy + resyLgh;
            }
            else{
              console.log('y值有错误');
            }
          }

          if(gFlag == 1){//GY
            if(thirdBValue < (r + yLghValue)){
              yValue = sy - thirdBValue;
            }
            else if(thirdBValue < (3*r + yLghValue)){
              yValue = cy + thirdBValue - 2*r - yLghValue;
            }
            else if(thirdBValue <= 4*r){
              yValue = sy + ( 4*r - thirdBValue);
            }
            else{
              console.log("GY圆弧重复");
            }

            var resxLgh = parseFloat(Math.sqrt(r*r - (yValue - cy)*(yValue - cy)).toFixed(3));
            if(thirdBValue<(r + yLghValue)){
              xValue = cx - resxLgh;
            }
            else if(thirdBValue < (3*r + yLghValue)){
              xValue = cx + resxLgh;
            }
            else if(thirdBValue <= 4*r){
              xValue = cx - resxLgh;
            }
            else{
              console.log('y值有错误');
            }

          }

          //spanAngle = getAngle(cx, cy, sx, sy, xValue, yValue, r, direction);
          //lgh = Math.round(r * spanAngle / 180 * Math.PI);

        }

        if(quadrant == 3){//逆圆第三象限
          cx = parseFloat(sx + xLghValue); //圆心
          cy = parseFloat(sy + yLghValue);
          startAngle = Math.acos(xLghValue / r)* 180 / Math.PI + 180;

          if(gFlag == 0){//GX 靠近X
            if(thirdBValue < (r + xLghValue)){
              xValue = sx + thirdBValue;
            }
            else if(thirdBValue < (3*r + xLghValue)){
              xValue = cx - thirdBValue + 2*r + xLghValue;
            }
            else if(thirdBValue <= 4*r){
              xValue = sx - ( 4*r - thirdBValue);
            }
            else{
              console.log("GY圆弧重复");
            }//和第一象限的GY是一样的

            var resyLgh = parseFloat(Math.sqrt(r*r - (xValue - cx)*(xValue - cx)).toFixed(3));
            if(thirdBValue<(r + xLghValue)){
              yValue = cy - resyLgh;
            }
            else if(thirdBValue < (3*r + xLghValue)){
              yValue = cy + resyLgh;
            }
            else if(thirdBValue <= 4*r){
              yValue = cy - resyLgh;
            }
            else{
              console.log('y值有错误');
            }
          }

          if(gFlag == 1){//GY 第3象限
            if(thirdBValue < (r - yLghValue)){
              yValue = sy - thirdBValue;
            }
            else if(thirdBValue < (3*r - yLghValue)){
              yValue = cy + thirdBValue - 2*r +yLghValue;
            }
            else if(thirdBValue <= 4*r){
              yValue = sy + ( 4*r - thirdBValue);
            }
            else{
              console.log("GY圆弧重复");
            }

            var resxLgh = parseFloat(Math.sqrt(r*r - (yValue - cy)*(yValue - cy)).toFixed(3));
            if(thirdBValue<(r - yLghValue)){
              xValue = cx - resxLgh;
            }
            else if(thirdBValue < (3*r - yLghValue)){
              xValue = cx + resxLgh;
            }
            else if(thirdBValue <= 4*r){
              xValue = cx - resxLgh;
            }
            else{
              console.log('y值有错误');
            }

          }

          //spanAngle = getAngle(cx, cy, sx, sy, xValue, yValue, r, direction);
          //lgh = Math.round(r * spanAngle / 180 * Math.PI);
          //console.log(xValue,yValue);

        }

        if(quadrant == 4){//第4象限
          cx = parseFloat(sx - xLghValue); //圆心
          cy = parseFloat(sy + yLghValue);
          startAngle = -Math.acos(xLghValue / r)* 180 / Math.PI;

          if(gFlag == 0){//GX 靠近X
            if(thirdBValue < (r - xLghValue)){
              xValue = sx + thirdBValue;
            }
            else if(thirdBValue < (3*r - xLghValue)){
              xValue = cx - thirdBValue + 2*r - xLghValue;
            }
            else if(thirdBValue <= 4*r){
              xValue = sx - ( 4*r - thirdBValue);
            }
            else{
              console.log("GY圆弧重复");
            }//和第一象限的GY是一样的

            var resyLgh = parseFloat(Math.sqrt(r*r - (xValue - cx)*(xValue - cx)).toFixed(3));
            if(thirdBValue<(r - xLghValue)){
              yValue = cy - resyLgh;
            }
            else if(thirdBValue < (3*r - xLghValue)){
              yValue = cy + resyLgh;
            }
            else if(thirdBValue <= 4*r){
              yValue = cy - resyLgh;
            }
            else{
              console.log('y值有错误');
            }
          }

          if(gFlag == 1){//GY 第4象限
            if(thirdBValue < (r + yLghValue)){
              yValue = sy +  thirdBValue;
            }
            else if(thirdBValue < (3*r + yLghValue)){
              yValue = cy - thirdBValue + 2*r +yLghValue;
            }
            else if(thirdBValue <= 4*r){
              yValue = sy - ( 4*r - thirdBValue);
            }
            else{
              console.log("GY圆弧重复");
            }

            var resxLgh = parseFloat(Math.sqrt(r*r - (yValue - cy)*(yValue - cy)).toFixed(3));
            if(thirdBValue<(r + yLghValue)){
              xValue = cx + resxLgh;
            }
            else if(thirdBValue < (3*r + yLghValue)){
              xValue = cx - resxLgh;
            }
            else if(thirdBValue <= 4*r){
              xValue = cx + resxLgh;
            }
            else{
              console.log('y值有错误');
            }

          }

          //spanAngle = getAngle(cx, cy, sx, sy, xValue, yValue, r, direction);
          //lgh = Math.round(r * spanAngle / 180 * Math.PI);

        }

      }
      spanAngle = getAngle(cx, cy, sx, sy, xValue, yValue, r, direction);
      lgh = Math.round(r * spanAngle / 180 * Math.PI);




    }
		else {
			throw "error: unknown shape !"
		}

    if(xValueMax < xValue){
      xValueMax = xValue ;
    }
    if(xValueMin > xValue){
      xValueMin = xValue ;
    }
    if(yValueMax < yValue){
      yValueMax = yValue ;
    }
    if(yValueMin > yValue){
      yValueMin = yValue ;
    }

		jsonArray.push(
			{
				"originalCode": str,
				"handledCode": codeObj,
				"type": type,
				"cmd": {
					'lgh': lgh,
					'sp': {'X': sx, 'Y': sy}, //sp、ep分别代表起点终点;
					'ep': {'X': xValue, 'Y': yValue},
					'offset': {'X': iValue, 'Y': jValue}, //圆弧时候表示起点偏离圆心距离,直线时候为0;
					'center': {'X': cx, 'Y': cy}, //center of circle
					'r': r,
					'angle': {'startA': startAngle.toFixed(3), 'spanA': spanAngle},
					'direction': direction, //1ccw,-1cw,0line
					'f': f
				}
			}
		);
		sx = xValue;
		sy = yValue;

	}
  console.log(jsonArray);


  if((xValueMax - xValueMin) > (yValueMax - yValueMin)){
    //paintScale = (xValueMax - xValueMin)/100000*0.003;
    paintScale = 110/(xValueMax - xValueMin);
  }
  else{
    paintScale = 110/(yValueMax - yValueMin);
  }
  alert("xValueMax:"+xValueMax+"xValueMin:"+xValueMin+"yValueMax:"+yValueMax+"yValueMin:"+yValueMin);
  return jsonArray;
}

function getAngle(x0,y0,x1,y1,x2,y2,r,direction) { //圆心、第一点、第二点、半径、顺时针-1逆时针1;
	var spanAngle;
	var offset10 = x1 - x0; var offset11 = y1 - y0;
	var offset20 = x2 - x0; var offset21 = y2 - y0;
	var start1 = offset11<=0? -Math.acos(offset10 / r) * 180 / Math.PI: Math.acos(offset10 / r) * 180 / Math.PI;
	var start2 = offset21<=0? -Math.acos(offset20 / r) * 180 / Math.PI: Math.acos(offset20 / r) * 180 / Math.PI;
	if(direction == -1) {
		spanAngle = start1 -start2;
	}
	else if(direction == 1) {
		spanAngle = start2- start1;
	}
	if(spanAngle<=0) spanAngle = 360 + spanAngle;
	return spanAngle.toFixed(3);
}

//function getValue(expression) { //获取G代码中需要运算的表达式的值，使用eval(),但是eval()在chrome应用中不允许使用。
//	var e = expression;
//	if(e.match(/(sin|cos|tan|cot)\-?\d+\.?\d*/g)) { //  sin30->Math.sin(30/180*Math.PI)
//		e = e.replace(/(sin|cos|tan|cot)\-?\d+\.?\d*/g,function($1){
//			var num = ($1.replace(/sin|cos|tan|cot/,'')/180*Math.PI).toFixed(3);
//			var trig = "Math."+$1.replace(/-?\d+\.?\d*/,'');
//			console.log(trig,num)
//			return trig+'('+num+')'
//		})
//	}
//	return eval(e)
//}

function setStartX(x) {
	if(x == undefined) x = 0;
	return x;
}

function setStartY(y) {
	if(y == undefined) y = 0;
	return y;
}
