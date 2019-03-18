
function attr(elem, attr) {
    for(key in attr) {
        var value = attr[key];
        if(value === null) {
            elem.removeAttribute(key);
        } else {
            elem.setAttribute(key, value);
        }
    }
}

function style(elem, style) {
    for(key in style) {
        var value = style[key];
        if(value === null) {
            delete elem.style.removeProperty(key);
        } else {
            elem.style.setProperty(key, value);
        }
    }
}

function appendSVG(parent, name) {
    return parent.appendChild(document.createElementNS("http://www.w3.org/2000/svg", name));
}

function removeAllChilds(parent) {
    while(parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

var bubbles = new BubbleSet();
var rectanglesA = [];
var rectanglesB = [];
var rectanglesC = [];
var rectanglesD = [];
var rectanglesE = [];
var main = document.getElementById("main");
var items = appendSVG(main, "g");
var pathA = appendSVG(main, "path");
var pathB = appendSVG(main, "path");
var pathC = appendSVG(main, "path");
var pathD = appendSVG(main, "path");
var pathE = appendSVG(main, "path");
var debug = appendSVG(main, "g");
bubbles.debug(false);
var debugFor = pathA;

function update(addPath) {
    if(addPath == 0)
        updateOutline(rectanglesA, rectanglesB, rectanglesC, rectanglesD, rectanglesE,"blue", pathA,"Asia");
    else if(addPath == 1)
        updateOutline(rectanglesB, rectanglesA, rectanglesC, rectanglesD, rectanglesE,"red", pathB,"Europe");
    else if(addPath == 2)
        updateOutline(rectanglesC, rectanglesB, rectanglesA, rectanglesD, rectanglesE,"green", pathC,"Oceania");
    else if(addPath == 3)
        updateOutline(rectanglesD, rectanglesB, rectanglesC, rectanglesA, rectanglesE,"yellow", pathD,"Africa");
    else if(addPath == 4)
        updateOutline(rectanglesE, rectanglesB, rectanglesC, rectanglesD, rectanglesA,"black", pathE,"America");
}

function updateOutline(rectangles, otherRectanglesA, otherRectanglesB,otherRectanglesC,otherRectanglesD
    ,color, path, className) {
    var pad = 2;
    // console.log("B:" + otherRectanglesB);

    if(rectangles.length!=0){
        var otherRectangles = new Array();
        var index = 0;
        for(item of otherRectanglesA)
            otherRectangles[index++] = item;
        for(item of otherRectanglesB)
            otherRectangles[index++] = item;
        for(item of otherRectanglesC)
            otherRectangles[index++] = item;
        for(item of otherRectanglesD)
            otherRectangles[index++] = item;
        var list = bubbles.createOutline(
            BubbleSet.addPadding(rectangles, pad),
            BubbleSet.addPadding(otherRectangles, pad),
            null /* lines */
        );
        // rectangles need to have the form { x: 0, y: 0, width: 0, height: 0 }
        // lines need to have the form { x1: 0, x2: 0, y1: 0, y2: 0 }
        // lines can be null to infer lines between rectangles automatically
        var outline = new PointPath(list).transform([
            new ShapeSimplifier(0.0),
            new BSplineShapeGenerator(),
            new ShapeSimplifier(0.0),
        ]);
        // outline is a path that can be used for the attribute d of a path element
        attr(path, {
            "d": outline,
            "opacity": 0.5,
            "fill": color,
            "stroke": "black",
            class:className
        });
        if(bubbles.debug() && path === debugFor) {
            removeAllChilds(debug);
            bubbles.debugPotentialArea().forEach(function(r) {
                var rect = appendSVG(debug, "rect");
                attr(rect, {
                    x: r.x,
                    y: r.y,
                    width: r.width,
                    height: r.height
                });
                var color = r.value === r.threshold ? "0, 0, 0" : r.value > 0 ? "150, 20, 20" : "20, 20, 150";
                style(rect, {
                    "fill": "rgb(" + color + ")",
                    "opacity": r.value === r.threshold ? 0.5 : Math.min(255, Math.abs(r.value * 40)) / 255.0
                });
            });
        }
    }
};

function addRect(rectangles, color, cx, cy, className,addPath) {
    var width = 20;
    var height = 20;
    var x = cx - width * 0.5;
    var y = cy - height * 0.5;
    //generate rectangles
    var elem = appendSVG(items, "rect");
    attr(elem, {
        x: x,
        y: y,
        width: width,
        height: height,
        class: className
    });
    style(elem, {
        "stroke": "black",
        "stroke-width": 1,
        "fill": color,
    });
    rectangles.push({
        x: x,
        y: y,
        width: width,
        height: height,
        elem: elem,
    });
    
    if(addPath >= 0)
        update(addPath);
}

//TODO: change global var currYearIndex as indexOfYear
//indexOfYear: which year begin with，ranged from (0,1,2,3,....,numOfYears-1)
//note: all the second parameters of myBubbleSet() need to be the same
function myBubbleSet(flag){
    if(flag == undefined)
        return;

    // 重新开始
    if(currYearIndex == years.length-1) {
        //change to stop
        currYearIndex = 0;
        currFrame = 0;
        slider.noUiSlider.set(currYearIndex);
    }

    //Asia, Europe, Oceania, Africa, America
    var xsArray = new Array();
    var ysArray = new Array();
    var nxsArray = new Array();
    var nysArray = new Array();
    var dxsArray = new Array();
    var dysArray = new Array();
    var contientToIndex = new Map();
    contientToIndex.set("Asia",0);
    contientToIndex.set("Europe",1);
    contientToIndex.set("Oceania",2);
    contientToIndex.set("Africa",3);
    contientToIndex.set("America",4);

    for(continent of continents){
        //numToposition是数组，每一个元素也是一个数组，用inPos表示numToposition是数组的元素的话。
        //则inPos中，单数是x轴位置，双数是y轴位置。比如2000年坐标为(1,2),2004年为坐标为（3，4）。在numToposition就为[1,2,3,4]
        //注意：每一个inPos长度相同，如果没参加当年奥运，坐标数据就为(-1,-1)
        var numToposition = allNumToPosition.get(continent);
        //xs，ys为当前国家的x坐标和y坐标
        //比如当前为2000年，continent是亚洲。xs和ys就为亚洲所有国家在2000年的坐标
        var xs = new Array();
        var ys = new Array();
        // nxs和nys为下一年的坐标
        var nxs = new Array();
        var nys = new Array();
        //dxs和dys表示
        var dxs = new Array();
        var dys = new Array();

        for(inPos of numToposition){
            // //check bound
            // if (currYearIndex == years.length) {
            //     return;
            // }
            // else if(currYearIndex==years.length-1){
            //     xs[xs.length] = inPos[currYearIndex*2];
            //     ys[ys.length] = inPos[currYearIndex*2+1];
            //     nxs[nxs.length] = -1;
            //     nys[nys.length] = -1;
            //     dxs[dxs.length] = 0;
            //     dys[dys.length] = 0;
            // }
            // else{
                xs[xs.length] = inPos[currYearIndex*2];
                ys[ys.length] = inPos[currYearIndex*2+1];
                nxs[nxs.length] = inPos[currYearIndex*2+2];
                nys[nys.length] = inPos[currYearIndex*2+3];
                dxs[dxs.length] = (inPos[currYearIndex*2+2]-inPos[currYearIndex*2])/60;
                dys[dys.length] = (inPos[currYearIndex*2+3]-inPos[currYearIndex*2+1])/60;
            // }
        }

        var index = contientToIndex.get(continent);
        xsArray[index] = xs;
        ysArray[index] = ys;
        nxsArray[index] = nxs;
        nysArray[index] = nys;
        dxsArray[index] = dxs;
        dysArray[index] = dys;
    }

    // TODO: change count to global var currFrame
    //count为帧数，当前年的坐标移动到下一年的坐标需要60帧
    // var count  = 0;
    //stop=1表示跑完数据，return。
    var stop = 0;

    // 每秒60帧
    timer = setInterval(function() {

        //currFrame为帧数，当前年的坐标移动到下一年的坐标需要60帧
        ++currFrame;
        if(currFrame == 60){
            ++currYearIndex;
            currFrame = 0;
            slider.noUiSlider.set(currYearIndex);
        }

        for(continent of continents) {
            var numToposition = allNumToPosition.get(continent);
            var len = allLen.get(continent);
            var xs = xsArray[contientToIndex.get(continent)];
            var ys = ysArray[contientToIndex.get(continent)];
            var nxs = nxsArray[contientToIndex.get(continent)];
            var nys = nysArray[contientToIndex.get(continent)];
            var dxs = dxsArray[contientToIndex.get(continent)];
            var dys = dysArray[contientToIndex.get(continent)];

            // 到60帧时，进入下一年的坐标
            if (currFrame == 0) {
                //坐标数据跑完，退出。
                if (currYearIndex == years.length - 1) {
                    stop = 1;
                    break;
                }
                // //坐标数据跑到最后一年，所有点停止移动
                // else if (currYearIndex == years.length - 1) {
                //     for (var j = 0; j < len; j++) {
                //         console.log("1111");
                //         xs[j] = numToposition[j][currYearIndex * 2];
                //         ys[j] = numToposition[j][currYearIndex * 2 + 1];
                //         nxs[j] = -1;
                //         nys[j] = -1;
                //         dxs[j] = 0;
                //         dys[j] = 0;
                //     }
                // }
                //更新下一年对应的数据
                else {
                    for (var j = 0; j < len; j++) {
                        xs[j] = numToposition[j][currYearIndex * 2];
                        ys[j] = numToposition[j][currYearIndex * 2 + 1];
                        nxs[j] = numToposition[j][currYearIndex * 2 + 2];
                        nys[j] = numToposition[j][currYearIndex * 2 + 3];
                        dxs[j] = (numToposition[j][currYearIndex * 2 + 2] - numToposition[j][currYearIndex * 2]) / 60;
                        dys[j] = (numToposition[j][currYearIndex * 2 + 3] - numToposition[j][currYearIndex * 2 + 1]) / 60;
                    }
                }
            }
            else {
                //-1表示没有坐标数据，比如如果A国家没参加2000年奥运，坐标数据就为(-1,-1)
                for (var j = 0; j < len; j++) {
                    if (xs[j] != -1 && nxs[j] != -1)
                        xs[j] += dxs[j];
                    if (ys[j] != -1 && nys[j] != -1)
                        ys[j] += dys[j];
                }
            }
        }

        //坐标数据跑完，退出。
        if(stop == 1) {
            //change to stop
            if(playFlag == 1){
                var e = document.getElementById("button-img");
                e.src = "play.png";
                playFlag = 0;
            }
            clearInterval(timer);
            return;
        }
        else{
            //TODO: draw()
            //画图部分
            for(continent of continents){
                var xs = xsArray[contientToIndex.get(continent)];
                var ys = ysArray[contientToIndex.get(continent)];
                var len = allLen.get(continent);
                d3.select("#main").selectAll("rect."+continent).remove();
                d3.select("#main").selectAll("path."+continent).attr("d",'');

                if(continent == "Asia"){
                    rectanglesA = [];
                    for(var j=0;j<len;j++){
                        if(xs[j] != -1 && ys[j] != -1)
                            if(isAddPathList[0] == 1)
                                addRect(rectanglesA, "blue", xs[j], ys[j],continent,0);
                            else
                                addRect(rectanglesA, "blue", xs[j], ys[j],continent,-1);
                    }
                }
                else if(continent == "Europe"){
                    rectanglesB = [];
                    for(var j=0;j<len;j++){
                        if(xs[j] != -1 && ys[j] != -1)
                            if(isAddPathList[1] == 1)
                                addRect(rectanglesB, "yellow", xs[j], ys[j],continent,1);
                            else
                                addRect(rectanglesB, "yellow", xs[j], ys[j],continent,-1);

                    }
                }
                else if(continent == "Oceania"){
                    rectanglesC = [];
                    for(var j=0;j<len;j++){
                        if(xs[j] != -1 && ys[j] != -1)
                            if(isAddPathList[2] == 1)
                                addRect(rectanglesC, "green", xs[j], ys[j],continent,2);
                            else
                                addRect(rectanglesC, "green", xs[j], ys[j],continent,-1);
                    }
                }
                else if(continent == "Africa"){
                    rectanglesD = [];
                    for(var j=0;j<len;j++){
                        if(xs[j] != -1 && ys[j] != -1)
                            if(isAddPathList[3] == 1)
                                addRect(rectanglesD, "red", xs[j], ys[j],continent,3);
                            else
                                addRect(rectanglesD, "red", xs[j], ys[j],continent,-1);
                    }
                }
                else if(continent == "America"){
                    rectanglesE = [];
                    for(var j=0;j<len;j++){
                        if(xs[j] != -1 && ys[j] != -1)
                            if(isAddPathList[4] == 1)
                                addRect(rectanglesE, "black", xs[j], ys[j],continent,4);
                            else
                                addRect(rectanglesE, "black", xs[j], ys[j],continent,-1);
                    }
                }
            }
            if(currFrame == 0)
                console.log(years[currYearIndex]);
        }
    }, 1000/60);
    //每一帧花费1000/60微秒。即一秒60帧。
}