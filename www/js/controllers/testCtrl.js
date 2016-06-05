angular.module('ionicApp.testCtrl', ['ionic'])

  .controller('testCtrl', function ($scope, edmData, $rootScope) {
    console.log('testCtrl');





    //var testPaint = document.getElementById("testPaint");
    //if(testPaint && testPaint.getContext){
    //  var context = testPaint.getContext("2d");
    //
    //  context.beginPath();
    //  context.strokeStyle = "red"
    //  context.lineWidth =2;
    //
    //  //context.translate(125,125);
    //  context.moveTo(0,0);
    //  context.lineTo(100,0);
    //
    //  context.fillRect(10,10,50,50);
    //  var imgData = context.getImageData(0, 0, 125, 125);
    //  context.clearRect(0,0,125,125);
    //  context.scale(2,2);
    //  context.putImageData(imgData, 0, 80);
    //  context.lineTo(100,20);
    //
    //  //context.lineWidth = 1;
    //  //context.moveTo(0,0);
    //  //context.fillRect(10,10,30,30);
    //  context.stroke();
    //  context.closePath();
    //
    //
    //  context.beginPath();
    //  context.clearRect(0,0,125,125);
    //  context.scale(0.5,0.5);
    //  context.putImageData(imgData, 0, 0);
    //
    //
    //  context.closePath();
    //
    //
    //  //var imageData = context.getImageData(0,0,100,100);
    //
    //  //context.clearRect(-125,-125,250,250);
    //
    //  //context.scale(2,2);
    //  //context.putImageData(imageData,0,0);
    //  //context.fill();
    //
    //
    //
    //}
    //
    //var testStage = new Kinetic.Stage({
    //  container: "kineticTest",
    //  width : 250,
    //  height : 250
    //});
    //var layer = new Kinetic.Layer();
    //var shape = new Kinetic.Shape();
    //var rect = {
    //  x : 20, //矩形左上角x坐标
    //  y : 15, //矩形左上角y坐标
    //  width : 100, //矩形的宽度
    //  height : 100, //矩形的高度
    //  fill : "red", //矩形的填充色
    //  stroke : "black", //矩形边缘线的颜色
    //  strokeWidth : 4 //矩形边缘线的宽度
    //};
    //
    //layer.add(shape);
    //
    ////layer.transitionTo({
    ////  scale : 2,
    ////  duration:2
    ////});
    //testStage.add(layer);
    //
    //
    //testStage.draw();







    var load_prg = document.getElementById('load_prg');
    var new_prg = document.getElementById("new_prg");
    var btns = document.getElementsByClassName("btns")[0];
    var text = document.getElementsByClassName("text")[0];
    var preContainer = document.getElementById("preContainer");

    load_prg.onchange = function() {
      if(this.files.length) {

        window.onresize = function(){
          stage.setWidth(300);
          stage.setHeight(150);
        };

        var stage = new Kinetic.Stage({
          container: "kineticTest", //<div>��id
          //container: "testImage", <div>��id
          colour: "red",
          //offsetX: -(window.screen.width-30)/2,//Math.floor(-stage.getWidth() / 2) - 0.5,
          //offsetY: -150,
          width: window.screen.width-30, //��������̨���
          height: 300 //��������̨�߶�
        });

//console.log(stage.getWidth(),stage.getHeight())
        var shape = new Kinetic.Layer({
          //offsetX: -(window.screen.width-30)/2,//Math.floor(-stage.getWidth() / 2) - 0.5,
          //offsetY: -150,//Math.floor(-stage.getHeight() / 2) - 0.5,

          id: "shape"
        });
        stage.add(shape);

        var file = this.files[0];
        var reader = new FileReader();
        reader.onload = function()
        {
          xValueMin = 0;xValueMax =0;
          yValueMin = 0;yValueMax = 0;
          paintScale = 1;
          var str = this.result;
          //code.innerText = str;
          //highlight(str);
          var myInterpreter = new gcodeInterpreter(str);
          var result = myInterpreter.interpreter();

          shape.setOffsetX((xValueMin+xValueMax)*paintScale/2-160);
          shape.setOffsetY(-75-(yValueMin+yValueMax)*paintScale/2);

          toIdealShape(result, shape, paintScale);

          console.log(((xValueMin+xValueMax)*paintScale/2-160)+"<br>"+((yValueMin+yValueMax)*paintScale/2));
        };
        reader.readAsText(file);
      }
    }







  });
