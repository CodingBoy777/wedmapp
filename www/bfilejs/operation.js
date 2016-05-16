/**
 * Created by huanggw on 2015/9/9.
 */
/**
 * a function to get accurate value of Mathematical expression.
 * How to use :
 * 		var e = new MathematicalExpression("(2+3)/5");
 * 		e.getValue();
 * Done!!!
 */
/**
 * ***update***
 * 9.9 完成四则运算算法
 * 已知bug: 当某括号部分计算式第一个数带符号时候会使得计算值为NaN
 * 9.11 修复bug
 * "(-" --> "(0-"
 *
 */
/*
逆波兰表达式：
 1.输入队列弹出一个记号
 2.如果记号为数字，添加到输出队列中
 3.如果是一个操作符则比较它与输出堆栈中栈顶的操作符，如果优先级小于或等于栈顶的操作符，那么将栈顶的操作符弹出并加入输出队列（循环，直到上述条件不满足），最后将本次的操作符压入堆栈。
 4.如果是一个左括号，压入堆栈
 5.如果是一个右括号，从栈中不断的弹出操作符，并加入输出队列，知道栈顶的元素为左括号。弹出左括号，不加入输出队列。如果没有发现左括号，说明原来的表达式中括号不对称，有错误。
 6.如果输入队列为空，而栈中尚有操作符时，如果栈顶的操作符为左括号，则说明原表达式有不匹配的括号。将栈中的操作符逐个弹出，加入输出队列。
 7.完成
*/



/**
 * 封装
 */
var MathematicalExpression = function(expression) {
	this.expression = getTrigValue(expression);
}

MathematicalExpression.prototype.getValue = function() {
	return calculate(toRPolish(this.expression));
}

/**
 * 三角函数结果计算，保留三位小数,并使用括号包括起来！
 */
function getTrigValue(expression) { 
	var e = expression;
	//console.log(e.match(/(sin|cos|tan|cot)(\[.*\]|\-?\d+\.?d*)/g)) //match sin(-30)/sin-30/sin30类型
	//var reg = new RegExp("\[[^\[\]]*(((?'open'\[)[^\[\]]*)+((?'-open'\])[^\[\]]*)+)*(?(open)(?!))\]",'gi')
	//console.log(e.match(/(sin|cos|tan|cot)(\[\-\d+\.?\d*\]|\-?\d+\.?\d*)/gi))
	if(e.match(/(sin|cos|tan|cot)(\[\-\d+\.?\d*\]|\d+\.?\d*)/gi)) {  ///(sin|cos|tan|cot)(\[.*\d\s*?\]|\d+\.?\d*)/gi
		//  sin30->Math.sin(30/180*Math.PI)
		e = e.replace(/(sin|cos|tan|cot)(\[.*\d\s*?\]|\d+\.?\d*)/gi,function($1){
			var str = $1;
	        var temp = str.replace(/sin|cos|tan|cot/i,'');
			var i = calculate(toRPolish(temp));
			var num = parseFloat((i/180*Math.PI).toFixed(3));
			console.log(temp,i,num)
			//console.log(temp,i,num)
			if($1.match(/sin/i)){
				return "["+1*Math.sin(num).toFixed(3)+"]";
			}
		    else if($1.match(/cos/i)){
				return "["+1*Math.cos(num).toFixed(3)+"]";
			}
			else if($1.match(/tan/i)){
				return "["+1*Math.tan(num).toFixed(3)+"]";
			}
			else if($1.match(/cot/i)){
				return "["+1*Math.cot(num).toFixed(3)+"]";
			} 
		})
	}
	else {

	}
	//console.log(e)
	return e;
}

/**
 * 把普通算术表达式转换为逆波兰表达式
 */
function toRPolish(input){
	var outputStack = []; //还需要操作的队列
	var outputQueue = []; //最后输出的队列
	var array = input.replace(/\ /g,'').replace(/\[\-/g,'[0-').replace(/\[\+/g,'[0+').match(/\+|\-|\*|\/|\[|\]|\d+\.?\d*/g); //去掉空格并且将其拆分为数字与操作符顺序排列的数组
	//console.log(array)
	if(array[0] == '-'|array[0] == '+') {
		array.unshift('0'); //当算是第一位有正负号时候前面加0
	}
	for(var i = 0; i < array.length; i++) {
		var cur = array[i];
		if(isOperator(cur)) { //操作符
			if(cur == '[') {
				outputStack.push(cur);
			}
			else if(cur == ']') {
				var temp = outputStack.pop();
				while(temp != '[' && outputStack.length > 0) {
					outputQueue.push(temp);
					temp = outputStack.pop();
				}
				if(temp != '[') {
					throw "error: unmatched []";
				}
			}
			else {
				while(prioraty(cur, outputStack[outputStack.length - 1])&& outputStack.length > 0){
					//当前优先级小于栈顶的优先级，就把栈顶输出到输出栈中
					outputQueue.push(outputStack.pop())
				}
				outputStack.push(cur);
			}
		}
		else { //数字
			outputQueue.push(cur)
		}
	}

	if(outputStack.length > 0){
		if(outputStack[outputStack.length - 1] == ']' || outputStack[outputStack.length - 1] == '['){
			throw "error: unmatched []";
		}
		while(outputStack.length > 0){
			outputQueue.push(outputStack.pop());
		}
	}
	return outputQueue;
}

/**
 * 计算逆波兰表达式的值
 */
function calculate(RPolishArray){
	var result = 0;
	var tempArray = new Array(100);
	var tempNum = -1;
	for(i = 0;i < RPolishArray.length;i++){
		if(RPolishArray[i].match(/\d/)){
			tempNum++;
			tempArray[tempNum] = RPolishArray[i];
		}else{
			switch(RPolishArray[i]){
				case '+':
					result = Number(tempArray[tempNum-1]) + Number(tempArray[tempNum]);
					tempNum--;
					tempArray[tempNum] = result;
					break;
				case '-':
					result = Number(tempArray[tempNum-1]) - Number(tempArray[tempNum]);
					tempNum--;
					tempArray[tempNum] = result;
					break;
				case '*':
					result = Number(tempArray[tempNum-1]) * Number(tempArray[tempNum]);
					tempNum--;
					tempArray[tempNum] = result;
					break;
				case '/':
					result = Number(tempArray[tempNum-1]) / Number(tempArray[tempNum]);
					tempNum--;
					tempArray[tempNum] = result;
					break;
			}
		}
	}
	result = tempArray[tempNum];
	return result;
}

/**
 * 判断是否为操作符
 */
function isOperator(value){
	return value.match(/\+|\-|\*|\/|\[|\]/)
}

/**
 * 获得优先级
 */
function getPrioraty(value){
	switch(value){
		case '+':
		case '-':
			return 1;
		case '*':
		case '/':
			return 2;
		default:
			return 0;
	}
}

/**
 * 比较优先级
 */
function prioraty(o1, o2){
	return getPrioraty(o1) <= getPrioraty(o2);
}

//var e = new MathematicalExpression("[-2-3]/5*sin[-50+20]*cos60"); //
//console.log(e.getValue());
//console.log(getTrigValue("[-2-3]/5*sin[-50+20]*cos60"));