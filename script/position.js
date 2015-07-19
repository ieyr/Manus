/*
*Double integrates over the acceleration
*To find the change in position
*/

var lastX;
var lastY;
var lastZ;

var xVelocity;
var yVelocity;
var zVelocity;

var lastXVelocity;
var lastYVelocity;
var lastZVelocity;

var lastTime;
var currentTime;
var twoTimesAgo;

//position variables
var curX  = 0;
var curY = 0;
var curZ = 0;

var timesRun = 0;

function insertNewData(x, y, z){
	currentTime = new Date();
	
	var difBetweenlast  =  currentTime - lastTime;
	var difTwo = (currentTime - twoTimesAgo)/2;

	xVelocity += difBetweenlast * ( (x +lastX)/2  );
	yVelocity += difBetweenlast * ( (y + lastY)/2  );
	zVelocity += difBetweenlast * ( (z + lastZ)/2  );


	curX = difTwo * ((xVelocity + lastXVelocity)/2);
	curY = difTwo * ((yVelocity + lastYVelocity)/2);
	curZ = difTwo * ((zVelocity + lastZVelocity)/2);





	//update all of the variables
	twoTimesAgo = lastTime;
	lastTime = currentTime;

	lastXVelocity = xVelocity;
	lastYVelocity = yVelocity;
	lastZVelocity = zVelocity;

	lastX += x;
	lastY += y;
	lastZ += z;
	timesRun ++;

	if(timesRun > 3){
		return {
			x: curX,
			y: curY,
			z: curZ
		}
	}
	else{
		return {
			x: 0,
			y: 0,
			z: 0
		}
	}
}

function recenter(){
	curX = 0;
	curY = 0;
	curZ = 0;
}
