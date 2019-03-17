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

    function update() {
        updateOutline(rectanglesA, rectanglesB, rectanglesC, rectanglesD, rectanglesE,"blue", pathA,"Asia");
        updateOutline(rectanglesB, rectanglesA, rectanglesC, rectanglesD, rectanglesE,"red", pathB,"Europe");
        updateOutline(rectanglesC, rectanglesB, rectanglesA, rectanglesD, rectanglesE,"green", pathC,"Oceania");
        updateOutline(rectanglesD, rectanglesB, rectanglesC, rectanglesA, rectanglesE,"yellow", pathD,"Africa");
        updateOutline(rectanglesE, rectanglesB, rectanglesC, rectanglesD, rectanglesA,"black", pathE,"NorthAmerica");
        // updateOutline(rectanglesA, rectanglesB, "cornflowerblue", pathA);
        // updateOutline(rectanglesB, rectanglesA, "green", pathB);
    }

    // function updateOutline(rectangles, otherRectangles,color, path) {
    //     var pad = 5;
    //     // console.log("B:" + otherRectanglesB);
    //
    //     // var otherRectangles = new Array();
    //     // var index = 0;
    //     // for(item of otherRectanglesA)
    //     //     otherRectangles[index++] = item;
    //     // for(item of otherRectanglesB)
    //     //     otherRectangles[index++] = item;
    //     // for(item of otherRectanglesC)
    //     //     otherRectangles[index++] = item;
    //     // for(item of otherRectanglesD)
    //     //     otherRectangles[index++] = item;
    //     //console.log(BubbleSet.addPadding(otherRectangles, pad));
    //     var list = bubbles.createOutline(
    //         BubbleSet.addPadding(rectangles, pad),
    //         BubbleSet.addPadding(otherRectangles, pad),
    //         null /* lines */
    //     );
    //     // rectangles need to have the form { x: 0, y: 0, width: 0, height: 0 }
    //     // lines need to have the form { x1: 0, x2: 0, y1: 0, y2: 0 }
    //     // lines can be null to infer lines between rectangles automatically
    //     var outline = new PointPath(list).transform([
    //         new ShapeSimplifier(0.0),
    //         new BSplineShapeGenerator(),
    //         new ShapeSimplifier(0.0),
    //     ]);
    //     // outline is a path that can be used for the attribute d of a path element
    //     attr(path, {
    //         "d": outline,
    //         "opacity": 0.5,
    //         "fill": color,
    //         "stroke": "black",
    //     });
    //     if(bubbles.debug() && path === debugFor) {
    //         removeAllChilds(debug);
    //         bubbles.debugPotentialArea().forEach(function(r) {
    //             var rect = appendSVG(debug, "rect");
    //             attr(rect, {
    //                 x: r.x,
    //                 y: r.y,
    //                 width: r.width,
    //                 height: r.height
    //             });
    //             var color = r.value === r.threshold ? "0, 0, 0" : r.value > 0 ? "150, 20, 20" : "20, 20, 150";
    //             style(rect, {
    //                 "fill": "rgb(" + color + ")",
    //                 "opacity": r.value === r.threshold ? 0.5 : Math.min(255, Math.abs(r.value * 40)) / 255.0
    //             });
    //         });
    //     }
    // };

    function updateOutline(rectangles, otherRectanglesA, otherRectanglesB,otherRectanglesC,otherRectanglesD
                           ,color, path, className) {
        var pad = 5;
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

    function addRect(rectangles, color, cx, cy, className) {
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
        update();
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
                    inPos[i*2] = Math.round(inPos[i*2]*800/maxX + 70);
                if(inPos[i*2+1] != -1)
                    inPos[i*2+1] = Math.round(inPos[i*2+1]*500/maxY + 70);
            }
        }
    }

    console.log(allNumToPosition)

    // TODO: bubble set funciton
    // myBubbleSet("Asia");
    // myBubbleSet("Europe");
    // myBubbleSet("Oceania");
    // // myBubbleSet("Africa");
    // // myBubbleSet("North America");

    myBubbleSet(["Asia","Europe"]);

    //TODO: set bubble set, parameter: continent
    function myBubbleSet(continentList){

        var selectXs = new Map();
        var selectYs = new Map();
        var selectNxs = new Map();
        var selectNys = new Map();
        var selectDxs = new Map();
        var selectDys = new Map();

        for(continent of continentList){
            var numToposition = allNumToPosition.get(continent);
            var xs = new Array();
            var ys = new Array();
            var nxs = new Array();
            var nys = new Array();
            var dxs = new Array();
            var dys = new Array();

            for(inPos of numToposition){
                xs[xs.length] = inPos[0];
                ys[ys.length] = inPos[1];
                nxs[nxs.length] = inPos[2];
                nys[nys.length] = inPos[3];
                dxs[dxs.length] = (inPos[2]-inPos[0])/60;
                dys[dys.length] = (inPos[3]-inPos[1])/60;
            }

            selectXs.set(continent,xs);
            selectYs.set(continent,ys);
            selectNxs.set(continent,nxs);
            selectNys.set(continent,nys);
            selectDxs.set(continent,dxs);
            selectDys.set(continent,dys);
        }

        var count  = 0;
        var stop = 0;
        var i = 0;

        var timer = setInterval(function() {

            ++count;
            if(count == 60)
                ++i;

            for(continent of continentList){
                var numToposition = allNumToPosition.get(continent);
                var xs = selectXs.get(continent);
                var ys = selectYs.get(continent);
                var nxs = selectNxs.get(continent);
                var nys = selectNys.get(continent);
                var dxs = selectDxs.get(continent);
                var dys = selectDys.get(continent);
                var len = allLen.get(continent);

                for(var j=0;j<len;j++){
                    if(xs[j]!=-1 && nxs[j]!=-1)
                        xs[j] += dxs[j];
                    if(ys[j]!=-1 && nys[j]!=-1)
                        ys[j] += dys[j];
                }
                if (count == 60) {
                    count = 0;
                    if (i == years.length)
                        stop = 1;
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
                    var len = allLen.get(continent);
                    //TODO: draw()
                    if(continent == "North America")
                        d3.select("#main").selectAll("rect.NorthAmerica").remove();
                    else
                        d3.select("#main").selectAll("rect."+continent).remove();
                    d3.select("#main").selectAll("path."+continent).attr("d",'');

                    if(continent == "Asia"){
                        rectanglesA = [];
                        console.log(rectanglesA);
                        for(var j=0;j<len;j++){
                            if(xs[j] != -1 && ys[j] != -1)
                                addRect(rectanglesA, "yellow", xs[j], ys[j],continent);
                        }
                        console.log(rectanglesA);
                    }
                    else if(continent == "Europe"){
                        rectanglesB = [];
                        console.log(rectanglesB);
                        for(var j=0;j<len;j++){
                            if(xs[j] != -1 && ys[j] != -1)
                                addRect(rectanglesB, "yellow", xs[j], ys[j],continent);
                        }
                        console.log(rectanglesB);
                    }
                    else if(continent == "Oceania"){
                        rectanglesC = [];
                        console.log(rectanglesC);
                        for(var j=0;j<len;j++){
                            if(xs[j] != -1 && ys[j] != -1)
                                addRect(rectanglesC, "yellow", xs[j], ys[j],continent);
                        }
                        console.log(rectanglesC);
                    }
                    else if(continent == "Africa"){
                        rectanglesD = [];
                        for(var j=0;j<len;j++){
                            if(xs[j] != -1 && ys[j] != -1)
                                addRect(rectanglesD, "yellow", xs[j], ys[j],continent);
                        }
                    }
                    else if(continent == "North America"){
                        rectanglesE = [];
                        console.log(rectanglesE);
                        for(var j=0;j<len;j++){
                            if(xs[j] != -1 && ys[j] != -1)
                                addRect(rectanglesE, "yellow", xs[j], ys[j],"NorthAmerica");
                        }
                        console.log(rectanglesE);
                    }
                }
            }

            // if(stop == 1) {
            //     clearInterval(timer);
            //     return;
            // }
            // else{
            //     for(continent of continentList){
            //         var xs = selectXs.get(continent);
            //         var ys = selectYs.get(continent);
            //
            //         //TODO: draw()
            //         d3.select("#main").selectAll("rect."+continent).remove();
            //         d3.select("#main").selectAll("path."+continent).attr("d",'');
            //
            //         if(continent == "Asia"){
            //             rectanglesA = [];
            //             for(var j=0;j<len;j++){
            //                 if(xs[j] != -1 && ys[j] != -1)
            //                     addRect(rectanglesA, "yellow", xs[j], ys[j],continent);
            //             }
            //         }
            //         else if(continent == "Europe"){
            //             rectanglesB = [];
            //             for(var j=0;j<len;j++){
            //                 if(xs[j] != -1 && ys[j] != -1)
            //                     addRect(rectanglesB, "yellow", xs[j], ys[j],continent);
            //             }
            //         }
            //         else if(continent == "Oceania"){
            //             rectanglesC = [];
            //             for(var j=0;j<len;j++){
            //                 if(xs[j] != -1 && ys[j] != -1)
            //                     addRect(rectanglesC, "yellow", xs[j], ys[j],continent);
            //             }
            //         }
            //         else if(continent == "Africa"){
            //             rectanglesD = [];
            //             for(var j=0;j<len;j++){
            //                 if(xs[j] != -1 && ys[j] != -1)
            //                     addRect(rectanglesD, "yellow", xs[j], ys[j],continent);
            //             }
            //         }
            //         else if(continent == "North America"){
            //             rectanglesE = [];
            //             for(var j=0;j<len;j++){
            //                 if(xs[j] != -1 && ys[j] != -1)
            //                     addRect(rectanglesE, "yellow", xs[j], ys[j],continent);
            //             }
            //         }
            //     }
            // }
        }, 1000/60);
    }
}
