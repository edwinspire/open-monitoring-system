require(["dojo/ready", "dojox/geo/openlayers/Map", 'dojo/request', 
    "dojox/geo/openlayers/WidgetFeature", "dojox/geo/openlayers/Layer", "w_common_mappoint/w_common_mappoint"
], function (ready, Map, R, WidgetFeature, Layer, MapPoint) {
    ready(function () {


        var IdAccount = dojo.byId('map').getAttribute('data-oams-idaccount');
        var map = new Map("map");

// Crea una funcion que agrega un punto en el mapa
        map.addPoint = function (_latitude, _longitude, title, labeltitle, content, _image) {
            if (Math.abs(_latitude) > 0 && Math.abs(_longitude) > 0) {
                var mapPointMaster = new MapPoint();
                mapPointMaster.set('image', _image);
                mapPointMaster.setTooltip(title, labeltitle, content);
                var descr = {
                    longitude: _longitude,
                    latitude: _latitude,
                    widget: mapPointMaster,
                    width: 25,
                    height: 80
                }
                ;
                feature = new WidgetFeature(descr);
                layer = new Layer();
                layer.addFeature(feature);
                this.addLayer(layer);
		//return layer;
            }
        }


        var SliderZoom = dijit.byId('id_zoom');
        SliderZoom.on('Change', function (v) {
            map.getOLMap().zoomTo(Math.round(v));
        }
        );


console.log('Solicita carga mapa para abonado '+IdAccount);

                R.post("oams_php_query/account_map.php", {
                    data: {idaccount: IdAccount},
                    // Parse data from xml
                    handleAs: "json"
                }
                ).then(
                        function (response) {

                            var myData = {
                                identifier: "unique_id", items: []
                            };

                            dojo.forEach(response, function (item, i) {
//console.log(response);
var title =  item.last_name+' '+item.first_name;
var labeltitle =  '';
var content =  '<div><b>Dirección: </b>'+item.address+'</div>'+'<div><b>Latitud: </b>'+item.geox+'</div>'+'<div><b>Longitud: </b>'+item.geoy+'</div>';

if(item.last_name.indexOf("ECO") == 0){
			map.addPoint(parseFloat(item.geox), parseFloat(item.geoy), title, labeltitle, content, 'MapMarker_2.png');
}else if(item.last_name.indexOf("MEDI") == 0){
			map.addPoint(parseFloat(item.geox), parseFloat(item.geoy), title, labeltitle, content, 'MapMarker_3.png');
}else if(item.last_name.indexOf("PAF") == 0){
			map.addPoint(parseFloat(item.geox), parseFloat(item.geoy), title, labeltitle, content, 'MapMarker.png');
}else{
			map.addPoint(parseFloat(item.geox), parseFloat(item.geoy), title, labeltitle, content, 'MapMarker_1.png');
}



if(i == 0){
                        map.fitTo({
                            position: [parseFloat(item.geoy), parseFloat(item.geox)],
                            extent: 0.01
                        });
}

                        SliderZoom.maximum = map.getOLMap().getNumZoomLevels() - 1;
                        SliderZoom.set('value', map.getOLMap().getZoom());
                        map.getOLMap().zoomTo(Math.round(SliderZoom.get('value')));



                            });

                        },
                        function (error) {
                            console.log(error);
                            // Display the error returned
                           // t._enable_load = true;
                           // t.Grid.emit('onnotify', {msg: error});
                        }
                );




 });
}
);
