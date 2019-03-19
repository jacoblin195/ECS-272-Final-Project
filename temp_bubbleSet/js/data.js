// countryToContinent (NOC -> continent)
var cTc = new Map();
var NOCToCountry = new Map();
//keyMap: year -> (Map: NOC: Array())
//Array[0]:country, Array[1]:num; Array[2]:manNum; Array[3]:womanNum; Array[4]:medal;
var keyToMap = new Map();
// asc order of keyToMap
var ascKeyToMap = new Map();
// Top number of ascKeyToMap
var topAscKeyToMap = new Map();
//limit input data
var NOCToNumber = new Map();
var NOCToMostMedal = new Map();
var isAddPathList = [0,0,0,0,0];

//TODO: data process
var years = ["1896", "1900", "1904", "1906", "1908", "1912", "1920", "1924", "1928", "1932", "1936", "1948", "1952", "1956", "1960", "1964", "1968", "1972", "1976", "1980", "1984", "1988", "1992", "1996", "2000", "2004", "2008", "2012", "2016"];
// numOfYears*2 -> set to -1
var numOfYears = years.length;
var continents = ["Asia", "Europe", "Oceania", "Africa", "America"];
// continent -> Array([0]:num of people; [1]: num of medal, [3]:man, [4]:NOC);
var allNumToPosition = new Map();
//continent -> Map(Noc -> index)
var allCToIndex = new Map();
// maxX: largest number of participants
// maxY: largest number of medals
// marR: max ration of man/all
var maxX = 0;
var minX = 1000;
var maxY = 0;
var minY = 1000;
var maxR = 0;
var minR = 1000;
var currNumofYear = 0;
//continent -> length
var allLen = new Map();
//time interval
var timer;
//current year index
var currYearIndex = 0;
// current frame
var currFrame = 0;

var colors = {
  "Asia": "#f3c132",
  "Europe":"#1287c4",
  "Oceania":"#19a24d",
  "Africa": "#000000",
  "America":"#dd0e2b"};

d3.csv("./json/data.csv").then((function(data){

  data.forEach(function(d){
    NOCToCountry.set(d.NOC, d.country);

    if(NOCToNumber.has(d.NOC)){
      var number = NOCToNumber.get(d.NOC);
      NOCToNumber.set(d.NOC,number+1);
    }
    else
      NOCToNumber.set(d.NOC,1);

    if(NOCToMostMedal.has(d.NOC)){
      var number = NOCToMostMedal.get(d.NOC);
      if(number < d.medal)
        NOCToMostMedal.set(d.NOC,d.medal);
    }
    else
      NOCToMostMedal.set(d.NOC,d.medal);

    var key = +d.year;
    if(keyToMap.has(key)){
      var inMap = keyToMap.get(key);
      var inKey = d.NOC;
      if(inMap.has(inKey)){
        console.log(inKey);
      }
      else{
        if(cTc.has(d.NOC) == false) {
          if(d.continent == "North America" || d.continent == "South America")
            cTc.set(d.NOC, "America");
          else
            cTc.set(d.NOC,d.continent);
        }

        var inData = new Array();
        inData[0] = d.country;
        inData[1] = d.participants;
        inData[2] = d.male;
        inData[3] = d.female;
        inData[4] = d.medal;

        inMap.set(inKey, inData);
      }
    }
    else{
      if(cTc.has(d.NOC) == false){
        if(d.continent == "North America" || d.continent == "South America")
          cTc.set(d.NOC, "America");
        else
          cTc.set(d.NOC,d.continent);
      }

      var inData = new Array();
      inData[0] = d.country;
      inData[1] = d.participants;
      inData[2] = d.male;
      inData[3] = d.female;
      inData[4] = d.medal;

      var inMap = new Map();
      inMap.set(d.NOC, inData);

      keyToMap.set(key,inMap);
    }
  });

  // Create items array
  var outSort = Array.from(keyToMap.keys()).map(function(key) {
    return [key, keyToMap.get(key)];
  });
  // sort by number of people
  for(var item of outSort){
    var inMap = item[1];
    var inSort = Array.from(inMap.keys()).map(function(key) {
      return [key, inMap.get(key)];
    });
    inSort.sort(function(first, second) {
      return second[1][1] - first[1][1];
    });
    // get inner data sorted
    // set ascKeyToMap
    var ascInMap = new Map();
    for(inItem of inSort)
      ascInMap.set(inItem[0],inItem[1]);
    ascKeyToMap.set(item[0],ascInMap);
  }

  // get at most top 30 country
  // and limit input data
  for (var key of ascKeyToMap.keys()) {
    var inMap = ascKeyToMap.get(key);
    //TODO: change how many country
    var largeThanNum = 0;
    // if(inMap.size > 30)
    //   largeThanNum = 1;

    var topMap = new Map();
    var index = 0;
    for(var inKey of inMap.keys()){
      //limit data
      // at least 5 games
      // at least 8 medals
      if(NOCToNumber.get(inKey) >= 5 && NOCToMostMedal.get(inKey)>=6 && inMap.get(inKey)[4]>=7){
        topMap.set(inKey,inMap.get(inKey));
        if(++index >= 30)
          break;
      }
    }
    topAscKeyToMap.set(key,topMap);
  }

  for(key of continents){
    var numToposition = new Array();
    allNumToPosition.set(key,numToposition);
    var cToIndex = new Map();
    allCToIndex.set(key,cToIndex);
  }

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

      if(continent == undefined || (continent != "Europe" && continent != "Oceania" && continent != "Africa"
          && continent != "Asia" && continent != "America"))
        continue;

      if(cToIndex.has(NOC)){
        var index = currNumofYear*4;
        var inPos = numToposition[cToIndex.get(NOC)];

        inPos[index] = +inData[1];
        if(maxX < inPos[index])
          maxX = inPos[index];
        if(minX > inPos[index])
          minX = inPos[index];

        inPos[index+1] = +inData[4];
        if(maxY < inPos[index+1])
          maxY = inPos[index+1];
        if(minY > inPos[index+1])
          minY = inPos[index+1];

        inPos[index+2] = +inData[3];
        if(maxR < inPos[index+2]/inPos[index])
          maxR = inPos[index+2]/inPos[index];
        if(minR > inPos[index+2]/inPos[index])
          minR = inPos[index+2]/inPos[index];

        inPos[index+3] = NOC;
      }
      else{
        var inPos = new Array();
        for(var j=0;j<numOfYears*4;j++)
          inPos[j]=-1;

        var index = currNumofYear*4;
        inPos[index] = +inData[1];
        if(maxX < inPos[index])
          maxX = inPos[index];
        if(minX > inPos[index])
          minX = inPos[index];

        inPos[index+1] = +inData[4];
        if(maxY < inPos[index+1])
          maxY = inPos[index+1];
        if(minY > inPos[index+1])
          minY = inPos[index+1];

        inPos[index+2] = +inData[3];
        if(maxR < inPos[index+2]/inPos[index])
          maxR = inPos[index+2]/inPos[index];
        if(minR > inPos[index+2]/inPos[index])
          minR = inPos[index+2]/inPos[index];

        inPos[index+3] = NOC;

        cToIndex.set(NOC,numToposition.length);
        numToposition[numToposition.length] = inPos;
      }
    }
    ++currNumofYear;
  }

  for(key of continents){
    var len = allNumToPosition.get(key).length;
    allLen.set(key,len);
  }
  var inLen = years.length * 4;

  setupScatterplot();

  // draw the bubble first time
  drawWithIndex();
}));

function drawWithIndex(){
  for(continent of continents){
    var numToposition = allNumToPosition.get(continent);
    var len = allLen.get(continent);

    var xs = new Array();
    var ys = new Array();
    var rs = new Array();
    var nxs = new Array();
    var nys = new Array();
    var nrs = new Array();
    var dxs = new Array();
    var dys = new Array();
    var drs = new Array();
    var NOCs = new Array();

    if(currYearIndex == years.length-1){
      for(inPos of numToposition) {
        xs[xs.length] = inPos[currYearIndex * 4];
        ys[ys.length] = inPos[currYearIndex * 4 + 1];
        rs[rs.length] = inPos[currYearIndex * 4 + 2];
        NOCs[NOCs.length] = inPos[currYearIndex * 4 + 3];

        nxs[nxs.length] = 0;
        nys[nys.length] = 0;
        nrs[nrs.length] = 0;

        dxs[dxs.length] = 0;
        dys[dys.length] = 0;
        drs[drs.length] = 0;
      }
    }
    else{
      for(inPos of numToposition){
        xs[xs.length] = inPos[currYearIndex*4];
        ys[ys.length] = inPos[currYearIndex*4+1];
        rs[rs.length] = inPos[currYearIndex*4+2];
        NOCs[NOCs.length] = inPos[currYearIndex*4+3];

        nxs[nxs.length] = inPos[currYearIndex*4+4];
        nys[nys.length] = inPos[currYearIndex*4+5];
        nrs[nrs.length] = inPos[currYearIndex*4+6];

        dxs[dxs.length] = (inPos[currYearIndex*4+4]-inPos[currYearIndex*4])/60;
        dys[dys.length] = (inPos[currYearIndex*4+5]-inPos[currYearIndex*4+1])/60;
        drs[drs.length] = (inPos[currYearIndex*4+6]-inPos[currYearIndex*4+2])/60;
      }
    }


    d3.select("#main").selectAll("rect."+continent).remove();
    d3.select("#main").selectAll("path."+continent).attr("d",'');

    if(continent == "Asia"){
      rectanglesA = [];
      for(var j=0;j<len;j++){
        if(xs[j] != -1 && ys[j] != -1)
          if(isAddPathList[0] == 1)
            addRect(rectanglesA, colors["Asia"], (xs[j]+dxs[j]*currFrame), (ys[j]+dys[j]*currFrame),continent,0,(rs[j]+drs[j]*currFrame),NOCs[j]);
          else
            addRect(rectanglesA, colors["Asia"], (xs[j]+dxs[j]*currFrame), (ys[j]+dys[j]*currFrame),continent,-1,(rs[j]+drs[j]*currFrame),NOCs[j]);
      }
    }
    else if(continent == "Europe"){
      rectanglesB = [];
      for(var j=0;j<len;j++){
        if(xs[j] != -1 && ys[j] != -1)
          if(isAddPathList[1] == 1)
            addRect(rectanglesB, colors["Europe"], (xs[j]+dxs[j]*currFrame), (ys[j]+dys[j]*currFrame),continent,1,(rs[j]+drs[j]*currFrame),NOCs[j]);
          else
            addRect(rectanglesB, colors["Europe"], (xs[j]+dxs[j]*currFrame), (ys[j]+dys[j]*currFrame),continent,-1,(rs[j]+drs[j]*currFrame),NOCs[j]);
      }
    }
    else if(continent == "Oceania"){
      rectanglesC = [];
      for(var j=0;j<len;j++){
        if(xs[j] != -1 && ys[j] != -1)
          if(isAddPathList[2] == 1)
            addRect(rectanglesC, colors["Oceania"], (xs[j]+dxs[j]*currFrame), (ys[j]+dys[j]*currFrame),continent,2,(rs[j]+drs[j]*currFrame),NOCs[j]);
          else
            addRect(rectanglesC, colors["Oceania"], (xs[j]+dxs[j]*currFrame), (ys[j]+dys[j]*currFrame),continent,-1,(rs[j]+drs[j]*currFrame),NOCs[j]);
      }
    }
    else if(continent == "Africa"){
      rectanglesD = [];
      for(var j=0;j<len;j++){
        if(xs[j] != -1 && ys[j] != -1)
          if(isAddPathList[3] == 1)
            addRect(rectanglesD, colors["Africa"], (xs[j]+dxs[j]*currFrame), (ys[j]+dys[j]*currFrame),continent,3,(rs[j]+drs[j]*currFrame),NOCs[j]);
          else
            addRect(rectanglesD, colors["Africa"], (xs[j]+dxs[j]*currFrame), (ys[j]+dys[j]*currFrame),continent,-1,(rs[j]+drs[j]*currFrame),NOCs[j]);
      }
    }
    else if(continent == "America"){
      rectanglesE = [];
      for(var j=0;j<len;j++){
        if(xs[j] != -1 && ys[j] != -1)
          if(isAddPathList[4] == 1)
            addRect(rectanglesE, colors["America"], (xs[j]+dxs[j]*currFrame), (ys[j]+dys[j]*currFrame),continent,4,(rs[j]+drs[j]*currFrame),NOCs[j]);
          else
            addRect(rectanglesE, colors["America"], (xs[j]+dxs[j]*currFrame), (ys[j]+dys[j]*currFrame),continent,-1,(rs[j]+drs[j]*currFrame),NOCs[j]);
      }
    }
  }
}



