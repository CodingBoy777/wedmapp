/**
 * Created by huanggw on 2015/8/23.
 * modified by LZL on 2016/5/16
 */
//works with kinetic.js
var toIdealShape = function(jsonData, layer, scale) {
    //layer.removeChildren();
    layer.destroyChildren();
    for(var i = 0; i<jsonData.length; i++) {
        var current = jsonData[i];
        //console.log(current);
        if(current.type == "line") {
            var x0 = current.cmd.sp.X;
            var y0 = current.cmd.sp.Y;
            var x1 = current.cmd.ep.X;
            var y1 = current.cmd.ep.Y;
            var line = new drawLine(x0, y0, x1, y1, scale);
            layer.add(line);
        }
        else if(current.type == "arc") {
            var x0 = current.cmd.center.X;
            var y0 = current.cmd.center.Y;
            var r = current.cmd.r;
            var startA = current.cmd.angle.startA //canvas���ϵ����ѧ���ϵ�Ƕȷ����෴��canvas˳ʱ��Ϊ��
            var spanA = current.cmd.angle.spanA;
            //var direction = current.cmd.direction==1? false: true; //1逆时针
            if(current.cmd.direction==1) { //逆时针
                var arc = new drawArc(x0, y0, r, -startA, -spanA, true, scale);
                layer.add(arc);
            }
            else if(current.cmd.direction==-1) {
                var arc = new drawArc(x0, y0, r, -startA, spanA, false, scale);
                layer.add(arc);
            }
        }
    }
    layer.draw();
}

function drawArc(x, y, r, startA, spanA, clockwise, scale) { //理想轨迹的尺寸根据实际尺寸按照毫米*scale像素输出
    //console.log(x, y, r, startA, spanA, clockwise)
    var arc = new Kinetic.Arc({
        x:x* scale,
        y:-y* scale,
        innerRadius: r* scale,
        outerRadius: r* scale,
        stroke: 'red',
        strokeWidth: 1,
        rotationDeg: startA,
        angle: spanA,
        clockwise: clockwise
    })
    return arc;
}

function drawLine(x0, y0, x1, y1 ,scale) {
    var line = new Kinetic.Line({
        points: [x0*scale,-y0*scale,x1*scale,-y1*scale],
        stroke: 'red',
        strokeWidth: 1,
        listening: false
    })
    return line;
}

