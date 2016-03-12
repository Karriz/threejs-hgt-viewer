function HeightMapper() {

    this.buffer = null;

    this.buildHeightMap = function (geometry,lat,lon,zoom) {
        var oReq = new XMLHttpRequest();
        if (lat > 0) {
            latstr = 'N'+(Math.abs(Math.floor(lat)));
        }
        else {
            latstr = 'S'+(Math.abs(Math.floor(lat)));
        }
        if (lon > 0) {
            if (lon < 180) {
                lonstr = 'E0'+(Math.abs(Math.floor(lon)));
            }
            else {
                lonstr = 'E'+(Math.abs(Math.floor(lon)));
            }
        }
        else {
            if (lon >= -179) {
                lonstr = 'W0'+(Math.abs(Math.floor(lon)));
            }
            else {
                lonstr = 'W'+Math.abs((Math.floor(lon)));
            }
        }
        console.log('/Heightmaps/'+latstr+lonstr+'.hgt');
        
        size = Math.sqrt(geometry.vertices.length);
        
        w_meters = Math.abs(40075160*Math.cos(lat*(Math.PI/180)))/(Math.pow(2,zoom-1));
        scale = 20/w_meters; //How many units one meter is.
        
        w_lon = 360/(Math.pow(2,zoom-1));
        h_lat = Math.abs(Math.cos(lat*(Math.PI/180))*360/(Math.pow(2,zoom-1)));
        
        console.log(w_lon);
        console.log(h_lat);
        
        w_indices = Math.abs(Math.floor(1201*w_lon));
        h_indices = Math.abs(Math.floor(1201*h_lat));
        
        console.log(w_indices,h_indices);
        
        w_step = size/w_indices;
        h_step = size/h_indices;
        
        console.log(h_step,w_step);
     
        center_r = 1201-Math.abs(1201*(lat - Math.floor(lat)));
        center_c = Math.abs(1201*(lon - Math.floor(lon)));
        
        console.log(center_r,center_c);
        
        start_r = center_r - (h_indices/2);
        start_c = center_c - (w_indices/2);
        
        console.log(start_r,start_c);
        
        oReq.open("GET", '/Heightmaps/'+latstr+lonstr+'.hgt', true);
        oReq.responseType = "arraybuffer";

        oReq.onload = function (oEvent) {
          var arrayBuffer = oReq.response;
          if (arrayBuffer) {
            var array = new Int16Array(arrayBuffer);
            console.log(array.length);
            console.log(geometry.vertices.length);
            var datav=new DataView(arrayBuffer);
            
            h_i = 0;
            w_i = 0;
            
            for (var i=0;i<size;i++) {
                h_i = i/h_step;
                
                for (var j=0;j<size;j++) {
                    w_i = j/w_step;
                    
                    actual_r = start_r + h_i;
                    actual_c = start_c + w_i;
                    
                    c_left = actual_c - Math.floor(actual_c);
                    r_up = actual_r - Math.floor(actual_r);
                    
                    actual_r = Math.floor(actual_r);
                    actual_c = Math.floor(actual_c);
                    
                    actual_index_ul = Math.floor(actual_r*1201+actual_c);
                    if (actual_c < 1200) {
                        actual_index_ur = Math.floor(actual_r*1201+actual_c+1);
                    }
                    else {
                        actual_index_ur = Math.floor(actual_r*1201+actual_c);
                    }
                    if (actual_r < 1200) {
                        actual_index_dl = Math.floor((actual_r+1)*1201+actual_c);
                    }
                    else {
                        actual_index_dl = Math.floor((actual_r)*1201+actual_c);
                    }
                    if (actual_r < 1200 && actual_c < 1200) {
                        actual_index_dr = Math.floor((actual_r+1)*1201+actual_c+1);
                    }
                    else {
                        actual_index_dr = Math.floor((actual_r)*1201+actual_c);
                    }
                    var h_ul = datav.getInt16(actual_index_ul*2,false);
                    var h_ur = datav.getInt16(actual_index_ur*2,false);
                    var h_dl = datav.getInt16(actual_index_dl*2,false);
                    var h_dr = datav.getInt16(actual_index_dr*2,false);
                    
                    h = (1-c_left) * (1-r_up) * h_ul + (1-c_left) * r_up * h_dl + c_left * (1-r_up) * h_ur + c_left * r_up * h_dr;
                    
                    //console.log(h);
                    
                    geometry.vertices[i*size+j].setZ(h*scale);
                }
            }
            geometry.verticesNeedUpdate = true;
            geometry.computeFaceNormals();
            geometry.computeVertexNormals();
          }
        };

        oReq.send(null);
         
    };


}