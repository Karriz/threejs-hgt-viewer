console.log("test0");

var render = function () {
    requestAnimationFrame( render );

    renderer.render( scene, camera );
};

var updateLoop = function () {

}

console.log("test1");
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(43, window.innerWidth/window.innerHeight, 0.3, 3000 );

camera.position.set( 0.92, 1.12, 0.98 );
camera.rotation.set( -0.85, 0.55, 0.54 );

var controls = new CamControl(camera);

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set( 1, 1, 1 );
directionalLight.intensity = 1;
directionalLight.rotation.set( 0, 0, 0 );
scene.add( directionalLight );

console.log("test2");

var geometry = new THREE.PlaneGeometry(10,10,600,600);
var material = new THREE.MeshLambertMaterial(  );

console.log("test3");
var oReq = new XMLHttpRequest();
oReq.open("GET", "/Heightmaps/N65E025.hgt", true);
oReq.responseType = "arraybuffer";

oReq.onload = function (oEvent) {
  var arrayBuffer = oReq.response; // Note: not oReq.responseText
  if (arrayBuffer) {
    var array = new Int16Array(arrayBuffer);
    console.log(array.length);
    console.log(geometry.vertices.length);
    var datav=new DataView(arrayBuffer);
    var j=0;
    var jsub = 0;
    for (i=0; i<array.length-1;i++) {
        //console.log(i);
        var h=datav.getInt16(i*2,false);
        j = Math.floor(i/(1201/601));
        j-=jsub;
        if (j < geometry.vertices.length) {
            //console.log(j);
            geometry.vertices[j].setZ(h*0.001);
        }
        else {
            break;
        }
        if (i%1201==0) {
            i+=1201;
            jsub+=601;
        }
    }
    console.log(j);
    geometry.verticesNeedUpdate = true;
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
  }
};

oReq.send(null);
    
plane = new THREE.Mesh( geometry, material );

plane.rotateX( Math.PI / -2 );
scene.add(plane);

render();

