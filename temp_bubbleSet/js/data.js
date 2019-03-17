//handle csv data

// countryToContinent (NOC -> continent)
var cTc = new Map();
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

d3.csv("./json/data.csv").then((function(data){

  data.forEach(function(d){
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
  })

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

  start();
}));