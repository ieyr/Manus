/*
*Double integrates over the acceleration
*To find the change in position
*/

/*
*Double integrates over the acceleration
*To find the change in position
*/

//WHY U ASK. CUZ 7 ATE 9


var lastX9 = 0
var lastY9 = 0
var lastZ9 = 0

var xVelocity9 = 0
var yVelocity9 = 0
var zVelocity9 = 0

var lastXVelocity9 = 0
var lastYVelocity9 = 0
var lastZVelocity9 = 0

var lastTime9 = 0
var currentTime9 = 0
var twoTimesAgo9 = 0

//position variables
var curX9  = 0;
var curY9 = 0;
var curZ9 = 0;

var timesRun9 = 0;
var first = true;
myo.on('*', function(event, data9){
	if(event=='accelerometer'){
		insertNewData19(data9.x,data9.y,data9.z)
	}
})

function insertNewData19( x9,  y9,  z9){
    currentTime9 = new Date().getTime();
    
    var difBetweenlast9  =  currentTime9 - lastTime9;
    var difTwo9 = (currentTime9 - twoTimesAgo9)/2;
    if(first){
    	xVelocity9 = 0 
    	yVelocity9 = 0
    	zVelocity9 = 0
    	first = false
    }
	xVelocity9 += difBetweenlast9 * ( (x9  ));
	yVelocity9 += difBetweenlast9 * ( (y9  ));
	zVelocity9 += difBetweenlast9 * ( (z9  ));
	

    curX9 += difTwo9 * ((xVelocity9 + lastXVelocity9)/2);
    curY9 += difTwo9 * ((yVelocity9 + lastYVelocity9)/2);
    curZ9 += difTwo9 * ((zVelocity9 + lastZVelocity9)/2);





    //update all of the variables
    twoTimesAgo9 = lastTime9;
    lastTime9 = currentTime9;

    lastXVelocity9 = xVelocity9;
    lastYVelocity9 = yVelocity9;
    lastZVelocity9 = zVelocity9;

    lastX9 = x9;
    lastY9 = y9;
    lastZ9 = z9;
    timesRun9 ++;
    //console.log("x: " + curX9 + " y: " + curY9 + " z: " + curZ9);
    if(timesRun9 > 3){
        return [curX9,curY9,curZ9];
    }
    else{
        return [0,0,0]
    }
}

function recenter(){
    curX9 = 0;
    curY9 = 0;
    curZ9 = 0;
    xVelocity9 = 0;
    yVelocity9 = 0;
    zVelocity9 = 0;
}
