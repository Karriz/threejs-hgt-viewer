function CamControl(object) {
    //A birds-eye view camera script
    this.object = object;
  
    //Reset camera
    this.object.position.set( 0, 0, 3 );
  
    this.object.lookAt(new THREE.Vector3( 0, 0, 0 ));
    
    //Needs axis objects for rotation
    this.yAxis = new THREE.Object3D();
    this.xAxis = new THREE.Object3D();
    
    scene.add(this.yAxis);
    this.yAxis.add(this.xAxis);
    
    this.xAxis.add(object);
    
    this.xAxis.rotation.x += -0.7;
    
    
    this.getCameraRoot = function () {
        //this is for getting the camera's root (yAxis) object. If you want to for example make the camera follow the bus, don't move the camera itself, move the root.
        return this.yAxis;
    };
    
    var _this = this;
    
    var rightDown = false;
    var leftDown = false;
    var shiftDown = false;
    
    var previousMousePosition = {
        x: 0,
        y: 0
    };
    $(renderer.domElement).on('mousedown', function(e) {
        //Mouse clicked, check which button it was
        e.preventDefault();
        if (e.which == 3) {
            rightDown = true;
        }
        else if (e.which == 1) {
            leftDown = true;
        }
    })
    .on('mousemove', function(e) {
        //Mouse moved, calculate movemement delta
        e.preventDefault();

        // Workaround for offsetX and offsetY
        // They sometimes don't work on Firefox
        var posX, posY;
        if(e.offsetX==undefined || e.offsetY==undefined)
        {
            posX = e.originalEvent.layerX;
            posY = e.originalEvent.layerY;
        }
        else
        {
            posX = e.offsetX;
            posY = e.offsetY;
        }

        var deltaMove = {
            x: posX-previousMousePosition.x,
            y: posY-previousMousePosition.y
        };

        if(rightDown) {
            //Rotate the axis objects
            _this.yAxis.rotation.y += -deltaMove.x * 0.01;
            _this.xAxis.rotation.x += -deltaMove.y * 0.01;
            if(-0.11 < _this.xAxis.rotation.x) {
                _this.xAxis.rotation.x = -0.11;
            } else if(-1.41 > _this.xAxis.rotation.x) {
                _this.xAxis.rotation.x = -1.41;
            }
        }
        else if (leftDown) {
            //Translate the camera
            _this.yAxis.translateX(-deltaMove.x * 0.001 * _this.object.position.z);
            _this.yAxis.translateZ(-deltaMove.y * 0.001 * _this.object.position.z);
        }
        
        previousMousePosition = {
            x: posX,
            y: posY
        };
    });

    $(document).on('mouseup', function(e) {
        //Mouse button up
        e.preventDefault();
        if (e.which == 3) {
            rightDown = false;
        }
        else if (e.which == 1) {
            leftDown = false;
        }
    });

    $(document).keydown(function(e) {
        if(16 == e.which) {
            _this.shiftDown = true;
        }
    }).keyup(function(e) {
        if(16 == e.which) {
            _this.shiftDown = false;
        }
    });

    var zoomHandler = function(e_)
    {
        var multiplier = _this.object.position.z * 0.0005;
        if(_this.shiftDown) {
            multiplier *= 5.0;
        }
        var delta = multiplier;
        e_.preventDefault();
        if(e_.originalEvent.wheelDelta) {
            delta *= -e_.originalEvent.wheelDelta;
        } else {
            // Firefox uses detail instead of wheelDelta
            delta *= e_.originalEvent.detail;
        }

        _this.object.translateZ(delta);

        // Minimum and maximum zoom levels
        if (object.position.z <= 0.5) {
            _this.object.position.set(0,0,0.6);
        } else if (object.position.z >= 201.0) {
            _this.object.position.set(0,0,200);
        }
    }

    $(renderer.domElement).bind(
        'mousewheel DOMMouseScroll MozMousePixelScroll',
        zoomHandler
        );
    
    $(document).ready(function(){
    $(this).bind("contextmenu", function(e) {
        //Prevent context menu from opening
        e.preventDefault();
        });
    });
}

