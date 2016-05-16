JSHL.extendLanguage('gcode',{
    //对应的类名称
    cls : ['g-com','g-str','nxx','gxx','xxx','yxx','zxx','ixx','jxx','kxx','pr','fxx','mxx','expression','num','trig','operator','g-var'],
    //相应的正则表达式
    reg : {
        'com' : /(\/\*[\s\S]*?\*\/|\/\/.*|&lt;\!--[\s\S]*?--&gt;)/,  //开始结束
        'str' : /(\(.*\))/g, //注释
		'nxx' : /(N\d{1,5})(?![$_@a-zA-Z0-9])/g, //关键字n(?![$_@a-zA-Z0-9])
        'gxx' : /(G\d{1,4})(?![$_@a-zA-Z0-9])/g, //关键字g
		'xxx' : /(X\-?\d+\.?\d*)(?![$_@a-zA-Z0-9])/g, //关键字X(?:[^$_@a-zA-Z0-9])?
		'yxx' : /(Y\-?\d+\.?\d*)(?![$_@a-zA-Z0-9])/g, //关键字y
		'zxx' : /(Z\-?\d+\.?\d*)(?![$_@a-zA-Z0-9])/g, //关键字z
		'ixx' : /(I\-?\d+\.?\d*)(?![$_@a-zA-Z0-9])/g, //关键字i
		'jxx' : /(J\-?\d+\.?\d*)(?![$_@a-zA-Z0-9])/g, //关键字j
		'kxx' : /(K\-?\d+\.?\d*)(?![$_@a-zA-Z0-9])/g, //关键字k
        'pr': /(X|Y|Z|I|J|K)(?=\[)/g, //计算式前缀
		'fxx' : /(F\d{1,5})(?![$_@a-zA-Z0-9])/g, //关键f
		'mxx' : /(M\d{1,4})(?![$_@a-zA-Z0-9])/g, //关键字m(?![$_@a-zA-Z0-9])
        'expression':/(\[|\])/g, //计算式
        'num' : /\b(\d+(?:\.\d+)?(?:[Ee][-+]?(?:\d)+)?)\b/,  //数字,
        //'bracket' : /(\(.*\))/g, //括号()
        'trig': /(sin|cos|tan|cot)/g, //三角函数
        'operator': /(\+|\-|\*|\/)/g, //操作符
		//'gerr' : /(G\S{5,})/g,
		//'xerr' : /([XUYVZWIJF]\S{6,})/g,
		//'merr' : /(M\S{4,})/g,
		/*'cexx' : /([^NGXUYVZWIJFM]\S*)/g,*/
        'var' : /(\$[\w][\w\d]*)/, //变量名
    },
    //父级语言
    wrapper: 'html',
    //内容 ,用于push到wrapper的include
    content : {
        lang : 'gcode',
        wrapper : /(\/\*{2}start\*{2}\/(?:[\s\S]*?)\/\*{2}end\*{2}\/)/g
	    //wrapper : /(<\?(?:[\s\S]*?)\?>)/g
    }
})