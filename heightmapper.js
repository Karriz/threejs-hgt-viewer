function HeightMapper() {

    this.buffer = null;

    this.buildHeightMap = function (geometry,lat,lon,zoom) {
        
        size = Math.sqrt(geometry.vertices.length);
        
        w_meters = Math.abs(40075160*Math.cos(lat*(Math.PI/180)))/(Math.pow(2,zoom-1));
        scale = 20/w_meters; //How many units one meter is.
        
        w_lon = 360/(Math.pow(2,zoom-1));
        h_lat = Math.abs(Math.cos(lat*(Math.PI/180))*360/(Math.pow(2,zoom-1)));
        
        startlat = lat - (h_lat / 2);
        endlat = lat + (h_lat / 2);
        
        console.log(startlat);
        
        startlon = lon - (w_lon / 2);
        endlon = lon + (w_lon / 2);
        
        console.log(w_lon);
        console.log(h_lat);
        
        w_indices = Math.abs(Math.floor(1201*w_lon));
        h_indices = Math.abs(Math.floor(1201*h_lat));
        
        console.log(w_indices,h_indices);
        
        w_step = size/w_indices;
        h_step = size/h_indices;
        
        console.log(h_step,w_step);
        
        top_row = 1201 - Math.abs(1201*(endlat - Math.floor(endlat)));
        left_column = Math.abs(1201*(startlon - Math.floor(startlon)));
        
        bottom_row = 1201 - Math.abs(1201*(startlat - Math.floor(startlat)));
        right_column = Math.abs(1201*(endlon - Math.floor(endlon)));
        
        console.log(top_row, left_column);
        
        for (curlat = Math.floor(endlat); curlat >= Math.floor(startlat); curlat--) {
            for (curlon = Math.floor(startlon); curlon <= Math.floor(endlon); curlon++) {
                if (curlat > 0) {
                    latstr = 'N'+(Math.abs(Math.floor(curlat)));
                }
                else {
                    latstr = 'S'+(Math.abs(Math.floor(curlat)));
                }
                if (curlon > 0) {
                    if (curlon < 100) {
                        lonstr = 'E0'+(Math.abs(Math.floor(curlon)));
                    }
                    else {
                        lonstr = 'E'+(Math.abs(Math.floor(curlon)));
                    }
                }
                else {
                    if (curlon >= -99) {
                        lonstr = 'W0'+(Math.abs(Math.floor(curlon)));
                    }
                    else {
                        lonstr = 'W'+Math.abs((Math.floor(curlon)));
                    }
                }
                //console.log('/Heightmaps/'+latstr+lonstr+'.hgt');
                
                var start_row = 0;
                var start_column = 0;
                
                var end_row = 1200;
                var end_column = 1200;
                
                if (curlat == Math.floor(startlat)) {
                    end_row = bottom_row;
                }
                if (curlat == Math.floor(endlat)) {
                    start_row = top_row;
                }

                if (curlon == Math.floor(startlon)) {
                    start_column = left_column;
                }
                if (curlon == Math.floor(endlon)) {
                    end_column = right_column;
                }
                
                var passed_lats = Math.floor(endlat) - curlat;
                var passed_lons = curlon - Math.floor(startlon);
                
                var passed_rows = 0;
                if (passed_lats > 0) {
                    passed_rows = 1201-top_row + (passed_lats-1)*1201;
                }
                
                var passed_columns = 0;
                if (passed_lons > 0) {
                    passed_columns = 1201-left_column + (passed_lons-1)*1201;
                }
                
                var oReq = new XMLHttpRequest();
                
                oReq.start_row = start_row;
                oReq.start_column = start_column;
                oReq.end_row = end_row;
                oReq.end_column = end_column;
                
                oReq.passed_rows = passed_rows;
                oReq.passed_columns = passed_columns;
                
                start_i = Math.floor(((passed_rows) / h_indices) * size);
                end_i = Math.floor(((passed_rows+end_row-start_row) / h_indices) * size);
                end_i = Math.min(end_i,500);
                
                start_j = Math.floor(((passed_columns) / w_indices) * size);
                end_j = Math.floor(((passed_columns+end_column-start_column) / w_indices) * size);
                end_j = Math.min(end_j,500);
                
                oReq.filename = '/Heightmaps/'+latstr+lonstr+'.hgt';
                oReq.start_i= start_i;
                oReq.end_i = end_i;
                oReq.start_j = start_j;
                oReq.end_j = end_j;
                
                oReq.open("GET", '/Heightmaps/'+latstr+lonstr+'.hgt', true);
                oReq.responseType = "arraybuffer";
                
                oReq.onload = function (oEvent) {
                  var arrayBuffer = this.response;
                  if (arrayBuffer.byteLength == 2884802) {
                    var array = new Int16Array(arrayBuffer);
                    //console.log(array.length);
                    //console.log(geometry.vertices.length);
                    var datav=new DataView(arrayBuffer);
                    
                    h_i = 0;
                    w_i = 0;
                    
                    console.log(this.filename);
                    console.log(this.start_row, this.start_column);
                    console.log(this.start_i, this.end_i);
                    console.log(this.start_j, this.end_j);
                    console.log(this.passed_rows,this.passed_columns)
                    
                    for (var i=this.start_i;i<=this.end_i;i++) {
                        h_i = i/h_step;
                        
                        for (var j=this.start_j;j<=this.end_j;j++) {
                            w_i = j/w_step;
                            
                            actual_r = (top_row + h_i) % 1201;
                            actual_c = (left_column + w_i) % 1201;
                            
                            c_left = actual_c - Math.floor(actual_c);
                            r_up = actual_r - Math.floor(actual_r);
                            
                            actual_r = Math.ceil(actual_r);
                            actual_c = Math.ceil(actual_c);
                            
                            //actual_r = Math.min(actual_r, 1200);
                            //actual_c = Math.min(actual_c, 1200);
                            
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
            }

        }
    };


}