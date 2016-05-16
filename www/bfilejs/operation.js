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
 * 9.9 ������������㷨
 * ��֪bug: ��ĳ���Ų��ּ���ʽ��һ����������ʱ���ʹ�ü���ֵΪNaN
 * 9.11 �޸�bug
 * "(-" --> "(0-"
 *
 */
/*
�沨�����ʽ��
 1.������е���һ���Ǻ�
 2.����Ǻ�Ϊ���֣���ӵ����������
 3.�����һ����������Ƚ����������ջ��ջ���Ĳ�������������ȼ�С�ڻ����ջ���Ĳ���������ô��ջ���Ĳ���������������������У�ѭ����ֱ���������������㣩����󽫱��εĲ�����ѹ���ջ��
 4.�����һ�������ţ�ѹ���ջ
 5.�����һ�������ţ���ջ�в��ϵĵ�����������������������У�֪��ջ����Ԫ��Ϊ�����š����������ţ�������������С����û�з��������ţ�˵��ԭ���ı��ʽ�����Ų��Գƣ��д���
 6.����������Ϊ�գ���ջ�����в�����ʱ�����ջ���Ĳ�����Ϊ�����ţ���˵��ԭ���ʽ�в�ƥ������š���ջ�еĲ������������������������С�
 7.���
*/



/**
 * ��װ
 */
var MathematicalExpression = function(expression) {
	this.expression = getTrigValue(expression);
}

MathematicalExpression.prototype.getValue = function() {
	return calculate(toRPolish(this.expression));
}

/**
 * ���Ǻ���������㣬������λС��,��ʹ�����Ű���������
 */
function getTrigValue(expression) { 
	var e = expression;
	//console.log(e.match(/(sin|cos|tan|cot)(\[.*\]|\-?\d+\.?d*)/g)) //match sin(-30)/sin-30/sin30����
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
 * ����ͨ�������ʽת��Ϊ�沨�����ʽ
 */
function toRPolish(input){
	var outputStack = []; //����Ҫ�����Ķ���
	var outputQueue = []; //�������Ķ���
	var array = input.replace(/\ /g,'').replace(/\[\-/g,'[0-').replace(/\[\+/g,'[0+').match(/\+|\-|\*|\/|\[|\]|\d+\.?\d*/g); //ȥ���ո��ҽ�����Ϊ�����������˳�����е�����
	//console.log(array)
	if(array[0] == '-'|array[0] == '+') {
		array.unshift('0'); //�����ǵ�һλ��������ʱ��ǰ���0
	}
	for(var i = 0; i < array.length; i++) {
		var cur = array[i];
		if(isOperator(cur)) { //������
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
					//��ǰ���ȼ�С��ջ�������ȼ����Ͱ�ջ����������ջ��
					outputQueue.push(outputStack.pop())
				}
				outputStack.push(cur);
			}
		}
		else { //����
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
 * �����沨�����ʽ��ֵ
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
 * �ж��Ƿ�Ϊ������
 */
function isOperator(value){
	return value.match(/\+|\-|\*|\/|\[|\]/)
}

/**
 * ������ȼ�
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
 * �Ƚ����ȼ�
 */
function prioraty(o1, o2){
	return getPrioraty(o1) <= getPrioraty(o2);
}

//var e = new MathematicalExpression("[-2-3]/5*sin[-50+20]*cos60"); //
//console.log(e.getValue());
//console.log(getTrigValue("[-2-3]/5*sin[-50+20]*cos60"));