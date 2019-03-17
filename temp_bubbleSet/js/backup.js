//
// // rects: Array of bubble set
// var currIndex = 0;
// var rects = new Array();
// // Map: continent -> index
// var conToIndex = new Map();

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

function start() {
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
            updateOutline(rectanglesE, rectanglesB, rectanglesC, rectanglesD, rectanglesA,"black", pathE,"NorthAmerica");
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
            //console.log(BubbleSet.addPadding(otherRectangles, pad));
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
        var width = 40;
        var height = 30;
        var x = cx - width * 0.5;
        var y = cy - height * 0.5;
        //生成长方形
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

    //TODO: data process
    var years = ["1896", "1900", "1904", "1906", "1908", "1912", "1920", "1924", "1928", "1932", "1936", "1948", "1952", "1956", "1960", "1964", "1968", "1972", "1976", "1980", "1984", "1988", "1992", "1996", "2000", "2004", "2008", "2012", "2016"];
    // numOfYears*2 -> set to -1
    var numOfYears = years.length;
    var continents = ["Europe","Oceania","Africa","Asia","North America","South America"];
    // continent -> Array([0]:num of people; [1]: num of medal);
    var allNumToPosition = new Map();
    //continent -> Map(Noc -> index)
    var allCToIndex = new Map();
    for(key of continents){
        var numToposition = new Array();
        allNumToPosition.set(key,numToposition);
        var cToIndex = new Map();
        allCToIndex.set(key,cToIndex);
    }
    var maxX = 0;
    var maxY = 0;
    var currNumofYear = 0;

    //key: year
    for(var key of topAscKeyToMap.keys()){
        // inMap: Map(NOC->data)
        var inMap = topAscKeyToMap.get(key);
        for(var inKey of inMap.keys()){
            var inData = inMap.get(inKey);

            var NOC = inKey;
            var continent = cTc.get(NOC);
            var numToposition = allNumToPosition.get(continent);
            var cToIndex = allCToIndex.get(continent);

            //TODO: 重新处理原始数据
            if(continent == undefined || (continent != "Europe" && continent != "Oceania" && continent != "Africa"
                && continent != "Asia" && continent != "North America" && continent != "South America"))
                continue;

            if(cToIndex.has(NOC)){
                var index = currNumofYear*2;
                var inPos = numToposition[cToIndex.get(NOC)];

                inPos[index] = +inData[1];
                if(maxX < inPos[index])
                    maxX = inPos[index];

                inPos[index+1] = +inData[4];
                if(maxY < inPos[index+1])
                    maxY = inPos[index+1];
            }
            else{
                var inPos = new Array();
                for(var j=0;j<numOfYears*2;j++)
                    inPos[j]=-1;

                var index = currNumofYear*2;
                inPos[index] = +inData[1];
                if(maxX < inPos[index])
                    maxX = inPos[index];

                inPos[index+1] = +inData[4];
                if(maxY < inPos[index+1])
                    maxY = inPos[index+1];

                cToIndex.set(NOC,numToposition.length);
                numToposition[numToposition.length] = inPos;
            }
        }
        ++currNumofYear;
    }

    //continent -> length
    var allLen = new Map();
    for(key of continents){
        var numToposition = allNumToPosition.get(key);
        var len = numToposition.length;
        allLen.set(key,len);
    }
    var inLen = years.length * 2;

    //TODO: change X and Y sacle
    for(key of continents){
        var numToposition = allNumToPosition.get(key);
        for(inPos of numToposition){
            var index = inLen;
            for(var i=0;i<index/2;i++){
                if(inPos[i*2] != -1)
                    inPos[i*2] = Math.round(inPos[i*2]*1000/maxX + 70);
                if(inPos[i*2+1] != -1)
                    inPos[i*2+1] = Math.round(inPos[i*2+1]*800/maxY + 70);
            }
        }
    }

    // draw the bubble first time
    for(continent of continents){
        var numToposition = allNumToPosition.get(continent);
        var len = allLen.get(continent);

        var xs = new Array();
        var ys = new Array();
        for(inPos of numToposition){
            xs[xs.length] = inPos[0];
            ys[ys.length] = inPos[1];
        }

        if(continent == "Asia"){
            rectanglesA = [];
            for(var j=0;j<len;j++){
                if(xs[j] != -1 && ys[j] != -1) {
                    addRect(rectanglesA, "blue", xs[j], ys[j],continent,0);
                }
            }
        }
        else if(continent == "Europe"){
            rectanglesB = [];
            for(var j=0;j<len;j++){
                if(xs[j] != -1 && ys[j] != -1) {
                    addRect(rectanglesB, "yellow", xs[j], ys[j],continent,0);
                }
            }
        }
        else if(continent == "Oceania"){
            rectanglesC = [];
            for(var j=0;j<len;j++){
                if(xs[j] != -1 && ys[j] != -1) {
                    addRect(rectanglesC, "green", xs[j], ys[j],continent,0);
                }
            }
        }
        else if(continent == "Africa"){
            rectanglesD = [];
            for(var j=0;j<len;j++){
                if(xs[j] != -1 && ys[j] != -1) {
                    addRect(rectanglesD, "red", xs[j], ys[j],continent,0);
                }
            }
        }
        else if(continent == "North America"){
            rectanglesE = [];
            for(var j=0;j<len;j++){
                if(xs[j] != -1 && ys[j] != -1) {
                    addRect(rectanglesE, "black", xs[j], ys[j],"NorthAmerica",0);
                }
            }
        }
    }

    //TODO: bubble set funciton
    myBubbleSet("Asia",0,1);
    myBubbleSet("Europe",0,1);
    myBubbleSet("Oceania",0,0);
    myBubbleSet("Africa",0,1);
    myBubbleSet("North America",0,0);

    //TODO: set bubble set, parameter: continent
    //indexOfYear: which year begin with，ranged from (0,1,2,3,....,numOfYears-1)
    //note: all the second parameters of myBubbleSet() need to be the same
    function myBubbleSet(continent, indexOfYear,isAddPath){

        //numToposition是数组，每一个元素也是一个数组，用inPos表示numToposition是数组的元素的话。
        //则inPos中，单数是x轴位置，双数是y轴位置。比如2000年坐标为(1,2),2004年为坐标为（3，4）。在numToposition就为[1,2,3,4]
        //注意：每一个inPos长度相同，如果没参加当年奥运，坐标数据就为(-1,-1)
        var numToposition = allNumToPosition.get(continent);
        var len = allLen.get(continent);

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
            //check bound
            if (indexOfYear == years.length) {
                return;
            }
            else if(indexOfYear==years.length-1){
                xs[xs.length] = inPos[indexOfYear*2];
                ys[ys.length] = inPos[indexOfYear*2+1];
                nxs[nxs.length] = -1;
                nys[nys.length] = -1;
                dxs[dxs.length] = 0;
                dys[dys.length] = 0;
            }
            else{
                xs[xs.length] = inPos[indexOfYear*2];
                ys[ys.length] = inPos[indexOfYear*2+1];
                nxs[nxs.length] = inPos[indexOfYear*2+2];
                nys[nys.length] = inPos[indexOfYear*2+3];
                dxs[dxs.length] = (inPos[2]-inPos[0])/60;
                dys[dys.length] = (inPos[3]-inPos[1])/60;
            }
        }

        //当前时间
        var previous = +new Date;
        //count为帧数，当前年的坐标移动到下一年的坐标需要60帧
        var count  = 0;
        //stop=1表示跑完数据，return。
        var stop = 0;
        var i = indexOfYear;

        // 每秒60帧
        var timer = setInterval(function() {
            //时间
            var current = +new Date;
            var dt = current - previous;
            previous = current;

            //count为帧数，当前年的坐标移动到下一年的坐标需要60帧
            ++count;

            // 到60帧时，进入下一年的坐标
            if (count == 60) {
                console.log(years[i]);
                ++i;
                count = 0;

                //坐标数据跑完，退出。
                if (i == years.length) {
                    stop = 1;
                }
                //坐标数据跑到最后一年，所有点停止移动
                else if(i==years.length-1){
                    for(var j=0;j<len;j++){
                        xs[j] = numToposition[j][i * 2];
                        ys[j] = numToposition[j][i * 2 + 1];
                        nxs[j] = -1;
                        nys[j] = -1;
                        dxs[j] = 0;
                        dys[j] = 0;
                    }
                }
                //更新下一年对应的数据
                else{
                    for(var j=0;j<len;j++){
                        // var inPos = numToposition[j];
                        xs[j] = numToposition[j][i * 2];
                        ys[j] = numToposition[j][i * 2 + 1];
                        nxs[j] = numToposition[j][i * 2 + 2];
                        nys[j] = numToposition[j][i * 2 + 3];
                        dxs[j] = (nxs[j] - xs[j])/60;
                        dys[j] = (nys[j] - ys[j])/60;
                    }
                }
            }
            else{
                //-1表示没有坐标数据，比如如果A国家没参加2000年奥运，坐标数据就为(-1,-1)
                for(var j=0;j<len;j++){
                    if(xs[j]!=-1 && nxs[j]!=-1)
                        xs[j] += dxs[j];
                    if(ys[j]!=-1 && nys[j]!=-1)
                        ys[j] += dys[j];
                }
            }

            //坐标数据跑完，退出。
            if(stop == 1) {
                clearInterval(timer);
                return;
            }
            else{
                //TODO: draw()
                //画图部分
                if(continent == "North America")
                    d3.select("#main").selectAll("rect.NorthAmerica").remove();
                else
                    d3.select("#main").selectAll("rect."+continent).remove();
                d3.select("#main").selectAll("path."+continent).attr("d",'');

                if(continent == "Asia"){
                    rectanglesA = [];
                    for(var j=0;j<len;j++){
                        if(xs[j] != -1 && ys[j] != -1) {
                            if(isAddPath == 1)
                                addRect(rectanglesA, "blue", xs[j], ys[j],continent,0);
                            else
                                addRect(rectanglesA, "blue", xs[j], ys[j],continent,-1);
                        }
                    }
                }
                else if(continent == "Europe"){
                    rectanglesB = [];
                    for(var j=0;j<len;j++){
                        if(xs[j] != -1 && ys[j] != -1) {
                            if(isAddPath == 1)
                                addRect(rectanglesB, "yellow", xs[j], ys[j],continent,1);
                            else
                                addRect(rectanglesB, "yellow", xs[j], ys[j],continent,-1);
                        }
                    }
                }
                else if(continent == "Oceania"){
                    rectanglesC = [];
                    for(var j=0;j<len;j++){
                        if(xs[j] != -1 && ys[j] != -1) {
                            if(isAddPath == 1)
                                addRect(rectanglesC, "green", xs[j], ys[j],continent,2);
                            else
                                addRect(rectanglesC, "green", xs[j], ys[j],continent,-1);


                        }
                    }
                }
                else if(continent == "Africa"){
                    rectanglesD = [];
                    for(var j=0;j<len;j++){
                        if(xs[j] != -1 && ys[j] != -1) {
                            if(isAddPath == 1)
                                addRect(rectanglesD, "red", xs[j], ys[j],continent,3);
                            else
                                addRect(rectanglesD, "red", xs[j], ys[j],continent,-1);
                        }
                    }
                }
                else if(continent == "North America"){
                    rectanglesE = [];
                    for(var j=0;j<len;j++){
                        if(xs[j] != -1 && ys[j] != -1) {
                            if(isAddPath == 1)
                                addRect(rectanglesE, "black", xs[j], ys[j],"NorthAmerica",4);
                            else
                                addRect(rectanglesE, "black", xs[j], ys[j],"NorthAmerica",-1);
                        }
                    }
                }
            }
        }, 1000/60);
        //每一帧花费1000/60微秒。即一秒60帧。
    }
}