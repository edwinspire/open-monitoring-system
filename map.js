require(["dojo/ready", 
"dojox/geo/openlayers/Map",  
    "dojox/geo/openlayers/WidgetFeature",
 "dojox/geo/openlayers/Layer",
 "w_common_mappoint/w_common_mappoint",
 "dojo/dom-attr"
], function (ready, Map, WidgetFeature, Layer, MapPoint, domAttr) {
    ready(function () {

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
                    width: 2,
                    height: 2
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



                            dojo.forEach(geodata, function (item, i) {
//console.log(response);

var title =  item.last_name+' '+item.first_name;
var labeltitle =  '';
var content =  '<div><b>Dirección: </b>'+item.address+'</div>'+'<div><b>Latitud: </b>'+item.geox+'</div>'+'<div><b>Longitud: </b>'+item.geoy+'</div>';

if(item.last_name.indexOf("ECO") == 0){
			map.addPoint(parseFloat(item.geox), parseFloat(item.geoy), title, labeltitle, content, 'eco.png');
}else if(item.last_name.indexOf("MEDI") == 0){
			map.addPoint(parseFloat(item.geox), parseFloat(item.geoy), title, labeltitle, content, 'medi.png');
}else if(item.last_name.indexOf("PAF") == 0){
			map.addPoint(parseFloat(item.geox), parseFloat(item.geoy), title, labeltitle, content, 'paf.png');
}else if(item.last_name.indexOf("PUNTO") == 0){
			map.addPoint(parseFloat(item.geox), parseFloat(item.geoy), title, labeltitle, content, 'pnatural.png');
}else if(item.last_name.indexOf("DIFARMES") == 0){
			map.addPoint(parseFloat(item.geox), parseFloat(item.geoy), title, labeltitle, content, 'difarmes.png');
}else{
			map.addPoint(parseFloat(item.geox), parseFloat(item.geoy), title, labeltitle, content, 'MapMarker_1.png');
}



if(i == 0){

if(geodata.length == 1){
domAttr.set("link_openstreetmaps", "href", "http://www.openstreetmap.org/?mlat="+item.geox+"&mlon="+item.geoy+"#map=18/"+item.geox+"/"+item.geoy); 
}

                        map.fitTo({
                            position: [parseFloat(item.geoy), parseFloat(item.geox)],
                            extent: 0.01
                        });
}

                        SliderZoom.maximum = map.getOLMap().getNumZoomLevels() - 1;
                        SliderZoom.set('value', map.getOLMap().getZoom());
                        map.getOLMap().zoomTo(Math.round(SliderZoom.get('value')));



                            });






 });
}
);
