var container, stats;
var camera, controls, scene, renderer;
var hand = {};
var handDef = {};
var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );
var rotationInterval = 0.01;
var angle1 = Math.PI/2;
var angle2 = Math.PI/2;
var angle3 = Math.PI/2;
var angle4 = Math.PI/2;

var count = 1;

init();
setInterval(render, 10);




function animate() {

  //count++;
  //load next animation frame
  requestAnimationFrame(animate);
  //hand animation

  angle1 += 0.01;

  //console.log(lastX9*500  + ',' + lastY9*500  + ',' + lastZ9*500 )
  moveHand(lastX9*500 , lastY9*500 , lastZ9*500 );

  setAngle();

  //update camera orientation
  controls.update();
}


function init() {

  // camera
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 500;

  // camera controls
  controls = new THREE.OrbitControls( camera );
  controls.damping = 0.2;
  controls.minDistance = 0;
  controls.maxDistance = 800;
  controls.addEventListener( 'change', render );

  // scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( 0xcccccc, 0.0002 );

  // world

  createHand();

  //grid
  createGrid()

  // lights

  light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 1, 1, 1 );
  scene.add( light );

  light = new THREE.DirectionalLight( 0x002288 );
  light.position.set( -1, -1, -1 );
  scene.add( light );

  light = new THREE.AmbientLight( 0x222222 );
  scene.add( light );


  // renderer

  renderer = new THREE.WebGLRenderer( { antialias: false } );
  renderer.setClearColor( scene.fog.color );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  //rendering in container
  container = document.getElementById( 'container' );
  container.appendChild( renderer.domElement );


  window.addEventListener( 'resize', onWindowResize, false );

  //initial render
  animate();

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  render();

}

function render() {

  renderer.render( scene, camera );

}


//hand creation
function createFinger(shift){
  var finger= {};

  var ligLength = 50;
  var ligRadius = 5;
  var jointRadius = 10;


  for(var i = 1; i <= 3; i++){
    if(i > 1){
      jointRadius -= 1;
    }

    var sphere = new THREE.SphereGeometry( jointRadius, 32, 32 );
    var cylinder = new THREE.CylinderGeometry( ligRadius, ligRadius, ligLength, 20 );
    cylinder.applyMatrix( new THREE.Matrix4().makeTranslation( 0, ligLength/2, 0 ) );



    var joint = new THREE.Mesh( sphere, material );
    var ligament = new THREE.Mesh( cylinder, material );

    //reset finger orgin
    ligament.rotation.x = Math.PI/2;
    joint.position.z = i*ligLength;
    ligament.position.z = i*ligLength;

    //offset finger starting position
    if( i == 2 ){
      ligament.rotation.x += Math.PI/8;
    }else if( i == 3 ){
      ligament.rotation.x += Math.PI/4;
    }

    ligament.position.x = (shift-1) * 22
    joint.position.x = (shift-1) * 22


    finger["lig" + i.toString()] = ligament;
    finger["joint" + i.toString()] = joint;

    scene.add(joint);
    scene.add(ligament);
  }
  return finger;
}

function createHand(){
  for(var i = 1; i <= 4; i++){
    hand["finger" + i.toString()] = createFinger(-i);
  }

  var handBase = {}
  for(var i = 1; i <= 2;i++){
    var cylinder = new THREE.CylinderGeometry( 5, 5, 100, 20 );
    var sidehand = new THREE.Mesh(cylinder,material);
    sidehand.rotation.x = Math.PI/2;
    sidehand.position.x = ((i-1) * -85) - 35;
    scene.add(sidehand);
    handBase["sidehand" + i.toString()] = sidehand;
  }
  hand["base"] = handBase;



  var thumb= {};

  var ligLength = 50;
  var ligRadius = 5;
  var jointRadius = 10;


  for(var i = 1; i <= 2; i++){


    var sphere = new THREE.SphereGeometry( jointRadius, 32, 32 );
    var cylinder = new THREE.CylinderGeometry( ligRadius, ligRadius, ligLength, 20 );
    cylinder.applyMatrix( new THREE.Matrix4().makeTranslation( 0, ligLength/2, 0 ) );



    var joint = new THREE.Mesh( sphere, material );
    var ligament = new THREE.Mesh( cylinder, material );

    //reset finger orgin
    ligament.rotation.x = Math.PI/2;
    joint.position.z = i*ligLength;
    ligament.position.z = i*ligLength;
    ligament.position.x = -20;
    joint.position.x = -20;




    thumb["lig" + i.toString()] = ligament;
    thumb["joint" + i.toString()] = joint;

    scene.add(joint);
    scene.add(ligament);
  }
  hand["thumb"] = thumb;

  storeHandPos();

}

function storeHandPos(){

  for(var key in hand){
    if (hand.hasOwnProperty(key)) {
      var obj = hand[key];

      var objDef = {}
      for(var prop in obj){
        if (obj.hasOwnProperty(prop)) {
          objDef[prop] = {"x" :obj[prop].position.x, "y" :obj[prop].position.y, "z" :obj[prop].position.z}

        }
      }
      handDef[key] = objDef;
    }
  }
}

function createGrid(){
  var size = 1000, step = 50;

  var geometry = new THREE.Geometry();

  //params for vector3: ( ,up/down, )
  //add the bottom grid
  for ( var i = - size; i <= size; i += step ) {
    geometry.vertices.push( new THREE.Vector3( - size, - 100, i ) );
    geometry.vertices.push( new THREE.Vector3(   size, - 100, i ) );

    geometry.vertices.push( new THREE.Vector3( i, - 100, - size ) );
    geometry.vertices.push( new THREE.Vector3( i, - 100,   size ) );
  }


  var material = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 0.2 } );

  var line = new THREE.Line( geometry, material, THREE.LinePieces );
  scene.add( line );
}

function moveHand(x, y, z){

  for(var key in hand){
    if (hand.hasOwnProperty(key)) {
      var obj = hand[key];

      var objDef = handDef[key];
      for(var prop in obj){
        if (obj.hasOwnProperty(prop)) {


          var component = obj[prop];

          var setX = x + objDef[prop].x;
          var setY = y + objDef[prop].y;
          var setZ = z + objDef[prop].z;



          component.position.x = setX;
          component.position.y = setY;
          component.position.z = setZ;


        }
      }
    }
  }

}

function setAngle(){
  //ligament 1
  hand.finger1.lig1.rotation.x = angle1;
  //ligament 2
  var f1lig1RotX = hand.finger1.lig1.rotation.x ; //angle
  var f1lig1PosY = hand.finger1.lig1.position.y; //y position
  var f1lig1PosZ = hand.finger1.lig1.position.z;
  hand.finger1.lig2.position.y = f1lig1PosY + (50 * Math.cos(f1lig1RotX)); //x
  hand.finger1.lig2.position.z = f1lig1PosZ + (50 * Math.sin(f1lig1RotX)); //y
  hand.finger1.lig2.rotation.x = f1lig1RotX + ((Math.PI/2) * ((angle1-Math.PI/2)/(Math.PI/2)));

  hand.finger1.joint2.position.y = f1lig1PosY + (50 * Math.cos(f1lig1RotX));
  hand.finger1.joint2.position.z = f1lig1PosZ + (50 * Math.sin(f1lig1RotX));
  //ligament 3
  var f1lig2RotX = hand.finger1.lig2.rotation.x; //angle
  var f1lig2PosY = hand.finger1.lig2.position.y; //y position
  var f1lig2PosZ = hand.finger1.lig2.position.z; //y position
  hand.finger1.lig3.position.y = f1lig2PosY + (50* Math.cos(f1lig2RotX)); //x
  hand.finger1.lig3.position.z = f1lig2PosZ + (50 * Math.sin(f1lig2RotX)); //y
  hand.finger1.lig3.rotation.x = f1lig2RotX + ((Math.PI/2) * ((angle1-Math.PI/2)/(Math.PI/2)));

  hand.finger1.joint3.position.y = f1lig2PosY + (50* Math.cos(f1lig2RotX));
  hand.finger1.joint3.position.z = f1lig2PosZ + (50 * Math.sin(f1lig2RotX));

  /********************************************************************/

  //ligament 1
  hand.finger2.lig1.rotation.x = angle2;
  //ligament 2
  var f2lig1RotX = hand.finger2.lig1.rotation.x ; //angle
  var f2lig1PosY = hand.finger2.lig1.position.y; //y position
  var f2lig1PosZ = hand.finger2.lig1.position.z;
  hand.finger2.lig2.position.y = f2lig1PosY + (50 * Math.cos(f2lig1RotX)); //x
  hand.finger2.lig2.position.z = f2lig1PosZ + (50 * Math.sin(f2lig1RotX)); //y
  hand.finger2.lig2.rotation.x = f2lig1RotX + ((Math.PI/2) * ((angle2-Math.PI/2)/(Math.PI/2)));

  hand.finger2.joint2.position.y = f2lig1PosY + (50 * Math.cos(f2lig1RotX));
  hand.finger2.joint2.position.z = f2lig1PosZ + (50 * Math.sin(f2lig1RotX));
  //ligament 3
  var f2lig2RotX = hand.finger2.lig2.rotation.x; //angle
  var f2lig2PosY = hand.finger2.lig2.position.y; //y position
  var f2lig2PosZ = hand.finger2.lig2.position.z; //y position
  hand.finger2.lig3.position.y = f2lig2PosY + (50* Math.cos(f2lig2RotX)); //x
  hand.finger2.lig3.position.z = f2lig2PosZ + (50 * Math.sin(f2lig2RotX)); //y
  hand.finger2.lig3.rotation.x = f2lig2RotX + ((Math.PI/2) * ((angle2-Math.PI/2)/(Math.PI/2)));

  hand.finger2.joint3.position.y = f2lig2PosY + (50* Math.cos(f2lig2RotX));
  hand.finger2.joint3.position.z = f2lig2PosZ + (50 * Math.sin(f2lig2RotX));

  /********************************************************************/

  //ligament 1
  hand.finger3.lig1.rotation.x = angle3;
  //ligament 2
  var f3lig1RotX = hand.finger3.lig1.rotation.x ; //angle
  var f3lig1PosY = hand.finger3.lig1.position.y; //y position
  var f3lig1PosZ = hand.finger3.lig1.position.z;
  hand.finger3.lig2.position.y = f3lig1PosY + (50 * Math.cos(f3lig1RotX)); //x
  hand.finger3.lig2.position.z = f3lig1PosZ + (50 * Math.sin(f3lig1RotX)); //y
  hand.finger3.lig2.rotation.x = f3lig1RotX + ((Math.PI/2) * ((angle3-Math.PI/2)/(Math.PI/2)));

  hand.finger3.joint2.position.y = f3lig1PosY + (50 * Math.cos(f3lig1RotX));
  hand.finger3.joint2.position.z = f3lig1PosZ + (50 * Math.sin(f3lig1RotX));
  //ligament 3
  var f3lig2RotX = hand.finger3.lig2.rotation.x; //angle
  var f3lig2PosY = hand.finger3.lig2.position.y; //y position
  var f3lig2PosZ = hand.finger3.lig2.position.z; //y position
  hand.finger3.lig3.position.y = f3lig2PosY + (50* Math.cos(f3lig2RotX)); //x
  hand.finger3.lig3.position.z = f3lig2PosZ + (50 * Math.sin(f3lig2RotX)); //y
  hand.finger3.lig3.rotation.x = f3lig2RotX + ((Math.PI/2) * ((angle3-Math.PI/2)/(Math.PI/2)));

  hand.finger3.joint3.position.y = f3lig2PosY + (50* Math.cos(f3lig2RotX));
  hand.finger3.joint3.position.z = f3lig2PosZ + (50 * Math.sin(f3lig2RotX));

  /********************************************************************/

  //ligament 1
  hand.finger4.lig1.rotation.x = angle4;
  //ligament 2
  var lig1RotX = hand.finger4.lig1.rotation.x ; //angle
  var lig1PosY = hand.finger4.lig1.position.y; //y position
  var lig1PosZ = hand.finger4.lig1.position.z;
  hand.finger4.lig2.position.y = lig1PosY + (50 * Math.cos(lig1RotX)); //x
  hand.finger4.lig2.position.z = lig1PosZ + (50 * Math.sin(lig1RotX)); //y
  hand.finger4.lig2.rotation.x = lig1RotX + ((Math.PI/2) * ((angle4-Math.PI/2)/(Math.PI/2)));

  hand.finger4.joint2.position.y = lig1PosY + (50 * Math.cos(lig1RotX));
  hand.finger4.joint2.position.z = lig1PosZ + (50 * Math.sin(lig1RotX));
  //ligament 3
  var lig2RotX = hand.finger4.lig2.rotation.x; //angle
  var lig2PosY = hand.finger4.lig2.position.y; //y position
  var lig2PosZ = hand.finger4.lig2.position.z; //y position
  hand.finger4.lig3.position.y = lig2PosY + (50* Math.cos(lig2RotX)); //x
  hand.finger4.lig3.position.z = lig2PosZ + (50 * Math.sin(lig2RotX)); //y
  hand.finger4.lig3.rotation.x = lig2RotX + ((Math.PI/2) * ((angle4-Math.PI/2)/(Math.PI/2)));

  hand.finger4.joint3.position.y = lig2PosY + (50* Math.cos(lig2RotX));
  hand.finger4.joint3.position.z = lig2PosZ + (50 * Math.sin(lig2RotX));

}
