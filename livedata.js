
//      Constant Time Standard Deviation
//----------------------------------------
/*
* @params values the newest readings from myo
*/
var numbOfEntries = 50;
var entriesSoFar = 0;
var canReceive = false

var index = 0;
var indexPlus = 1;


var sqSum = [0,0,0,0,0,0,0,0];
var totalMean = [0,0,0,0,0,0,0,0];
var allVal = new Array(8);

for(i = 0; i < 8; i ++){
    allVal[i] = new Array(numbOfEntries);
}

myo.on('emg', function(data){
    if(canReceive){
        console.log(findClosestVector(aggregateArray,addNewData(data)))
        //console.log(addNewData(data))
    }
});

myo.on('connected', function(){
    console.log('connected')
    myo.streamEMG(true);
});

function addNewData(values){
    var standardDeviation = [0,0,0,0,0,0,0,0];
    for(i = 0; i < 8; i ++){
        allVal[i][index] = values[i];
    }

    if(entriesSoFar  > numbOfEntries  ){
        for(i = 0; i < 8; i ++){
            sqSum[i] += allVal[i][index]*allVal[i][index] - allVal[i][indexPlus]*allVal[i][indexPlus];
            totalMean[i] += allVal[i][index]-allVal[i][indexPlus];

            standardDeviation[i] = Math.sqrt(sqSum[i]/numbOfEntries - (totalMean[i]/numbOfEntries)*(totalMean[i]/numbOfEntries));
        }
    }else{
        for(i = 0; i < 8; i ++){
            totalMean[i][indexPlus] += values[i];
            sqSum[i] += values[i]*values[i];
        }
    }
    
    //index to store all of the values
    index = indexPlus;
    indexPlus ++;
    indexPlus = indexPlus % numbOfEntries;

    entriesSoFar ++;
    return standardDeviation;
}


