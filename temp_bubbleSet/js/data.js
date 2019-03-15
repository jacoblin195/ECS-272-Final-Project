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

d3.csv("./json/data.csv").then((function(data){

  data.forEach(function(d){
    var key = +d.year;
    if(keyToMap.has(key)){
      var inMap = keyToMap.get(key);
      var inKey = d.NOC;
      if(inMap.has(inKey)){
        console.log(inKey);
      }
      else{
        if(cTc.has(d.NOC) == false)
          cTc.set(d.NOC,d.continent);

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
      if(cTc.has(d.NOC) == false)
        cTc.set(d.NOC,d.continent);

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

  // TODO: get at most top 50 country
  for (var key of ascKeyToMap.keys()) {
    var inMap = ascKeyToMap.get(key);
    //TODO: change how many country
    if(inMap.size > 50){
      var topMap = new Map();
      var index = 0;
      for(var inKey of inMap.keys()){
        topMap.set(inKey,inMap.get(inKey));
        if(++index >= 50)
          break;
      }
      topAscKeyToMap.set(key,topMap);
    }
    else
      topAscKeyToMap.set(key,inMap);
  }

  console.log(keyToMap);
  console.log(ascKeyToMap);
  console.log(topAscKeyToMap);
  console.log(cTc);

  start();
}));


// var years = ["1896", "1900", "1904", "1906", "1908", "1912", "1920", "1924", "1928", "1932", "1936", "1948",
//   "1952", "1956", "1960", "1964", "1968", "1972", "1976", "1980", "1984", "1988", "1992", "1996", "2000",
//   "2004", "2008", "2012", "2016"];

// for(year of years){
//   readJson(year);
//
//
//   console.log(keyToMap);
//
//   console.log(ascKeyToMap);
//   console.log(topAscKeyToMap);
// }
//
//
// console.log(keyToMap);
//
// function readJson(year){
//   var inMap = new Map();
//   var inData = new Array();
//   d3.json("./json/" + year + ".json").then(function(data) {
//     data.forEach(function (d) {
//       if (cTc.has(d.country) == false)
//         cTc.set(d.country, d.continent);
//
//       inData[0] = d.participants;
//       inData[1] = d.male;
//       inData[2] = d.female;
//       inData[3] = d.medal;
//
//       // inMap.set(d.country, inData);
//       inMap[d.country] = inData;
//     });
//     keyToMap.set(year, inMap);
//   });
//
//   var inSort = Array.from(inMap.keys()).map(function(key) {
//     return [key, inMap.get(key)];
//   });
//   inSort.sort(function(first, second) {
//     return second[1][0] - first[1][0];
//   });
//   // get inner data sorted
//   // set ascKeyToMap
//   var ascInMap = new Map();
//   for(inItem of inSort)
//     ascInMap.set(inItem[0],inItem[1]);
//
//   ascKeyToMap.set(year,ascInMap);
//
//   // TODO: get at most top 50 country( only contain medal)
//   //TODO: change how many country
//   if(ascInMap.size > 50){
//     var topMap = new Map();
//     var index = 0;
//     for(var inKey of ascInMap.keys()){
//       // TODO: only medal
//       if(ascInMap.get(inKey)[3] == 0)
//         continue;
//       topMap.set(inKey,ascInMap.get(inKey));
//       if(++index >= 50)
//         break;
//     }
//     topAscKeyToMap.set(year,topMap);
//   }
//   else {
//     var topMap = new Map();
//     for(var inKey of ascInMap.keys()){
//       // TODO: only medal
//       if(ascInMap.get(inKey)[3] == 0)
//         continue;
//       topMap.set(inKey,ascInMap.get(inKey));
//     }
//     topAscKeyToMap.set(year,topMap);
//     // topAscKeyToMap.set(key, ascInMap);
//   }
// }


