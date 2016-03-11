function MapLoader() {

    this.loadTile = function (lat,lon,zoom) {
        var loader = new THREE.TextureLoader();
        loader.crossOrigin = true;
        var googlemaps_apikey = '';
        loader.load(
            'https://maps.googleapis.com/maps/api/staticmap?center='+lat+','+lon+'&zoom='+zoom+'&size=512x512&scale=2&maptype=satellite&key='+googlemaps_apikey,
            //'http://staticmap.openstreetmap.de/staticmap.php?center='+lat+','+lon+'&zoom='+(zoom)+'&size=512x512&maptype=mapnik',
            function ( texture ) {
                var geometry = new THREE.PlaneGeometry( 20,20,500,500 );
                var material = new THREE.MeshPhongMaterial( { map: texture, shading: THREE.SmoothShading} );
                
                heightMapper = new HeightMapper();
                heightMapper.buildHeightMap(geometry,lat,lon,zoom);
                
                var mesh = new THREE.Mesh( geometry, material );
                mesh.rotateX( Math.PI / -2 );
                scene.add( mesh );
            }
        )
    }
}