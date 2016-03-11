console.log("test0");

var render = function () {
    requestAnimationFrame( render );

    renderer.render( scene, camera );
};

var updateLoop = function () {

}

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(43, window.innerWidth/window.innerHeight, 0.3, 3000 );

camera.position.set( 0.92, 1.12, 0.98 );
camera.rotation.set( -0.85, 0.55, 0.54 );

var controls = new CamControl(camera);

var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
scene.add( new THREE.AmbientLight(0x8C8C8C) );
directionalLight.position.set( 1, 1, 1 );
directionalLight.intensity = 1;
directionalLight.rotation.set( 0, 0, 0 );
scene.add( directionalLight );

mapLoader = new MapLoader();
mapLoader.loadTile(28.221807, -16.709055, 11);
//mapLoader.loadTile(66.164941, 29.143846, 11);

render();

