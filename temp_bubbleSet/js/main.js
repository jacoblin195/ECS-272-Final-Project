
// rects: Array of bubble set
var currIndex = 0;
var rects = new Array();
// Map: continent -> index
var conToIndex = new Map();

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
    var main = document.getElementById("main");
    var items = appendSVG(main, "g");
    var pathA = appendSVG(main, "path");
    var pathB = appendSVG(main, "path");
    var debug = appendSVG(main, "g");
    bubbles.debug(false);
    var debugFor = pathA;

    function update() {
        updateOutline(rectanglesA, rectanglesB, "crimson", pathA);
        updateOutline(rectanglesB, rectanglesA, "cornflowerblue", pathB);
    }

    function updateOutline(rectangles, otherRectangles, color, path) {
        var pad = 5;
        // TODO:
        // for other
        //      set otherRect
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
    };

    function addRect(rectangles, color, cx, cy) {
        var width = 40;
        var height = 30;
        var x = cx - width * 0.5;
        var y = cy - height * 0.5;
        var elem = appendSVG(items, "rect");
        attr(elem, {
            x: x,
            y: y,
            width: width,
            height: height,
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
        update();
    }


    //TODO: bubble set funciton
    myBubbleSet("Asia");

    //TODO: set bubble set, parameter: continent
    function myBubbleSet(continent){
        var years = ["1896", "1900", "1904", "1906", "1908", "1912", "1920", "1924", "1928", "1932", "1936", "1948", "1952", "1956", "1960", "1964", "1968", "1972", "1976", "1980", "1984", "1988", "1992", "1996", "2000", "2004", "2008", "2012", "2016"];
        // numOfYears*2 -> set to -1
        var numOfYears = years.length;
        // [0]:num of people; [1]: num of medal
        var numToposition = new Array();
        var maxX = 0;
        var maxY = 0;
        var cToIndex = new Map();

        var currNumofYear = 0;
        for(var key of topAscKeyToMap.keys()){
            var inMap = topAscKeyToMap.get(key);
            for(var inKey of inMap.keys()){
                if(cTc.get(inKey) == continent){
                    var inData = inMap.get(inKey);
                    //NOC
                    if(cToIndex.has(inKey)){
                        var index = currNumofYear*2;
                        var inPos = numToposition[cToIndex.get(inKey)];

                        inPos[index] = inData[1];
                        if(maxX < inPos[index])
                            maxX = inPos[index];

                        inPos[index+1] = inData[4];
                        if(maxY < inPos[index+1])
                            maxY = inPos[index+1];
                    }
                    else{
                        var inPos = new Array();
                        for(var j=0;j<numOfYears*2;j++)
                            inPos[j]=-1;

                        var index = currNumofYear*2;
                        inPos[index] = inData[1];
                        if(maxX < inPos[index])
                            maxX = inPos[index];

                        inPos[index+1] = inData[4];
                        if(maxY < inPos[index+1])
                            maxY = inPos[index+1];

                        cToIndex.set(inKey,numToposition.length);
                        numToposition[numToposition.length] = inPos;
                    }
                }
            }
            ++currNumofYear;
        }

        var len = numToposition.length;
        var inLen = -1;
        if(numToposition.length >0)
            inLen = numToposition[0].length;

        //TODO: change X and Y sacle
        for(inPos of numToposition){
            var index = inLen;
            for(var i=0;i<index/2;i++){
                if(inPos[i*2] != -1)
                    inPos[i*2] = inPos[i*2]*300/maxX + 70;
                if(inPos[i*2+1] != -1)
                    inPos[i*2+1] = inPos[i*2+1]*300/maxY + 70;
            }
        }

        var i = 0;
        var xs = new Array();
        var ys = new Array();
        var nxs = new Array();
        var nys = new Array();
        var dxs = new Array();
        var dys = new Array();
        for(inPos of numToposition){
            // inLen = inPos.length;
            // console.log("inLen: "+inLen);
            xs[xs.length] = inPos[0];
            ys[ys.length] = inPos[1];
            nxs[nxs.length] = inPos[2];
            nys[nys.length] = inPos[3];
            dxs[dxs.length] = (inPos[2]-inPos[0])/60;
            dys[dys.length] = (inPos[3]-inPos[1])/60;
        }

        var previous = +new Date;
        var count  = 0;
        var stop = 0;

        // 60 frames/ per second
        var timer = setInterval(function() {
            var current = +new Date;
            var dt = current - previous;
            previous = current;

            ++count;
            for(var j=0;j<len;j++){
                if(xs[j]!=-1 && nxs[j]!=-1)
                    xs[j] += dxs[j];
                if(ys[j]!=-1 && nxs[j]!=-1)
                    ys[j] += dys[j];
            }
            // x += dx;
            // y += dy;
            if (count == 60) {
                ++i;
                count = 0;

                if (i == years.length) {
                    stop = 1;
                }
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

            if(stop == 1) {
                clearInterval(timer);
                return;
            }
            else{
                //TODO: draw()
                d3.select("#main").selectAll("rect").remove();
                d3.select("#main").selectAll("path").attr("d",'');
                rectanglesA = [];
                for(var j=0;j<len;j++){
                    // console.log((i * 2 + 3) >= inLen-1);
                    if(xs[j] != -1 && ys[j] != -1) {
                        addRect(rectanglesA, "blue", xs[j], ys[j]);
                    }
                }
            }

        }, 1000/60);
    }

    // var years = ["1896", "1900", "1904", "1906", "1908", "1912", "1920", "1924", "1928", "1932", "1936", "1948", "1952", "1956", "1960", "1964", "1968", "1972", "1976", "1980", "1984", "1988", "1992", "1996", "2000", "2004", "2008", "2012", "2016"];
    // // numOfYears*2 -> set to -1
    // var numOfYears = years.length;
    // // [0]:num of people; [1]: num of medal
    // var numToposition = new Array();
    // var maxX = 0;
    // var maxY = 0;
    // var cToIndex = new Map();
    //
    // var currNumofYear = 0;
    // for(var key of topAscKeyToMap.keys()){
    //     var inMap = topAscKeyToMap.get(key);
    //     for(var inKey of inMap.keys()){
    //         if(cTc.get(inKey) == "Asia"){
    //             var inData = inMap.get(inKey);
    //             //NOC
    //             if(cToIndex.has(inKey)){
    //                 var index = currNumofYear*2;
    //                 var inPos = numToposition[cToIndex.get(inKey)];
    //
    //                 inPos[index] = inData[1];
    //                 if(maxX < inPos[index])
    //                     maxX = inPos[index];
    //
    //                 inPos[index+1] = inData[4];
    //                 if(maxY < inPos[index+1])
    //                     maxY = inPos[index+1];
    //             }
    //             else{
    //                 var inPos = new Array();
    //                 for(var j=0;j<numOfYears*2;j++)
    //                     inPos[j]=-1;
    //
    //                 var index = currNumofYear*2;
    //                 inPos[index] = inData[1];
    //                 if(maxX < inPos[index])
    //                     maxX = inPos[index];
    //
    //                 inPos[index+1] = inData[4];
    //                 if(maxY < inPos[index+1])
    //                     maxY = inPos[index+1];
    //
    //                 cToIndex.set(inKey,numToposition.length);
    //                 numToposition[numToposition.length] = inPos;
    //             }
    //         }
    //     }
    //     ++currNumofYear;
    // }
    //
    // var len = numToposition.length;
    // var inLen = -1;
    // if(numToposition.length >0)
    //     inLen = numToposition[0].length;
    //
    // for(inPos of numToposition){
    //     var index = inLen;
    //     for(var i=0;i<index/2;i++){
    //         if(inPos[i*2] != -1)
    //             inPos[i*2] = inPos[i*2]*300/maxX + 100;
    //         if(inPos[i*2+1] != -1)
    //             inPos[i*2+1] = inPos[i*2+1]*300/maxY + 100;
    //     }
    // }
    //
    // var i = 0;
    // var xs = new Array();
    // var ys = new Array();
    // var nxs = new Array();
    // var nys = new Array();
    // var dxs = new Array();
    // var dys = new Array();
    // for(inPos of numToposition){
    //     // inLen = inPos.length;
    //     // console.log("inLen: "+inLen);
    //     xs[xs.length] = inPos[0];
    //     ys[ys.length] = inPos[1];
    //     nxs[nxs.length] = inPos[2];
    //     nys[nys.length] = inPos[3];
    //     dxs[dxs.length] = (inPos[2]-inPos[0])/60;
    //     dys[dys.length] = (inPos[3]-inPos[1])/60;
    // }
    //
    // var previous = +new Date;
    // var count  = 0;
    // var stop = 0;
    //
    // // 60 frames/ per second
    // var timer = setInterval(function() {
    //     var current = +new Date;
    //     var dt = current - previous;
    //     previous = current;
    //
    //     ++count;
    //     for(var j=0;j<len;j++){
    //         if(xs[j]!=-1 && nxs[j]!=-1)
    //             xs[j] += dxs[j];
    //         if(ys[j]!=-1 && nxs[j]!=-1)
    //             ys[j] += dys[j];
    //     }
    //     // x += dx;
    //     // y += dy;
    //     if (count == 60) {
    //         ++i;
    //         count = 0;
    //
    //         if (i == years.length) {
    //             stop = 1;
    //         }
    //         else if(i==years.length-1){
    //             for(var j=0;j<len;j++){
    //                 xs[j] = numToposition[j][i * 2];
    //                 ys[j] = numToposition[j][i * 2 + 1];
    //                 nxs[j] = -1;
    //                 nys[j] = -1;
    //                 dxs[j] = 0;
    //                 dys[j] = 0;
    //             }
    //         }
    //         else{
    //             for(var j=0;j<len;j++){
    //                 // var inPos = numToposition[j];
    //                 xs[j] = numToposition[j][i * 2];
    //                 ys[j] = numToposition[j][i * 2 + 1];
    //                 nxs[j] = numToposition[j][i * 2 + 2];
    //                 nys[j] = numToposition[j][i * 2 + 3];
    //                 dxs[j] = (nxs[j] - xs[j])/60;
    //                 dys[j] = (nys[j] - ys[j])/60;
    //             }
    //         }
    //     }
    //
    //     if(stop == 1) {
    //         clearInterval(timer);
    //         return;
    //     }
    //     else{
    //         //TODO: draw()
    //         d3.select("#main").selectAll("rect").remove();
    //         d3.select("#main").selectAll("path").attr("d",'');
    //         rectanglesA = [];
    //         for(var j=0;j<len;j++){
    //             // console.log((i * 2 + 3) >= inLen-1);
    //             if(xs[j] != -1 && ys[j] != -1) {
    //                 addRect(rectanglesA, "blue", xs[j], ys[j]);
    //             }
    //         }
    //     }
    //
    // }, 1000/60);
}