require(["dojo/ready", 
 "dojo/dom-attr",
"dijit/TooltipDialog",
"dijit/popup",
'dojo/on',
"dojo/_base/window",
"dojo/keys",
"dojo/_base/array"
], function (ready,  domAttr, TTD, PopUp, on, win, keys, array) {
    ready(function () {


var pGeo = dojo.byId(ParamGeo);

on(pGeo, 'Click', function(e){
alert(pGeo);
});

var popupCoordContent =  dojo.byId('popupCoordContent');
var PointCenter = [0, 0];
    
function CreateStyle(icon){
return new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          anchor: [11, 39],
          anchorXUnits: 'pixels',
          anchorYUnits: 'pixels',
      //    offset: [1000, 9],
          src: icon
        }))
      });
}



function CreateFeature(name, address, lat, long){
return new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([long, lat])),
        name: name
       // population: 4000,
       // rainfall: 500
      });
}
   
   
on(win.doc, "keyup", function(event) {
if(event.keyCode == keys.ESCAPE){
PopUp.close(TooltipMark);
PopUp.close(TooltipPoint);
}
});  

on(dojo.byId('popupCoordCloser'), 'click', function(){
PopUp.close(TooltipPoint);
});    
      
var Styles = {};
 
Styles['Eco'] = CreateStyle('images/eco.png');
Styles['Medi'] = CreateStyle('images/medi.png');
Styles['PAF'] = CreateStyle('images/paf.png');
Styles['DIFARMES'] = CreateStyle('images/difarmes.png');
Styles['PNatural'] = CreateStyle('images/pnatural.png');
Styles['Default'] = CreateStyle('images/default.png');                                                                
      



var arrayFeatures = [];
 /////////////////////////////////   
 array.forEach(points, function(item){
var iconFeature = CreateFeature(item.last_name+' '+item.first_name, item.address, item.geox, item.geoy);

      PointCenter = [item.geoy, item.geox];
      
if(item.last_name.indexOf("ECO") == 0){
	Styles['Eco'].src = 'images/default.png';
      iconFeature.setStyle(Styles['Eco']);
}else if(item.last_name.indexOf("MEDI") == 0){
      iconFeature.setStyle(Styles['Medi']);
}else if(item.last_name.indexOf("PAF") == 0){
      iconFeature.setStyle(Styles['PAF']);
}else if(item.last_name.indexOf("PUNTO") == 0){
      iconFeature.setStyle(Styles['PNatural']);
}else if(item.last_name.indexOf("DIFARMES") == 0){
      iconFeature.setStyle(Styles['DIFARMES']);
}else{
      iconFeature.setStyle(Styles['Default']);
}      
      
      arrayFeatures.push(iconFeature);      
      
 });
 
  
  /* 
      var iconFeature = CreateFeature('Prueba 1', '', -0.16647499799728, -78.483703613281);
      iconFeature.setStyle(Styles['Eco']);
  //    vectorSource.features.push(iconFeature);

      var iconFeature2 = CreateFeature('Prueba 2', '', -0.20647499799728, -77.483703613281);
      iconFeature2.setStyle(Styles['Medi']);      
//      vectorSource.features.push(iconFeature2);
*/

////////////////////////////////////
      var vectorSource = new ol.source.Vector({
        features: arrayFeatures
      });



      var vectorLayer = new ol.layer.Vector({
        source: vectorSource
      });


      var map = new ol.Map({
        layers: [new ol.layer.Tile({
            source: new ol.source.OSM()
          }), vectorLayer],
        target: document.getElementById('map'),
        view: new ol.View({
          center: ol.proj.fromLonLat(PointCenter),
          zoom: 19
        })
      });


//////////////////////////////////////////
var TooltipMark = new TTD({
        style: "width-min: 60px;",
    });
    
    
//////////////////////////////////////////
var TooltipPoint = new TTD({
        style: "width-min: 60px;",
        content: dojo.byId('popupCoord')//,
        /*onMouseLeave: function(){
            popup.close(TooltipMark);
        }*/
    });    

      var element = dojo.byId('popup');

      var popup = new ol.Overlay({
        element: element,
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, -40]
      });
      map.addOverlay(popup);




      // display popup on click
      map.on('click', function(evt) {
        var feature = map.forEachFeatureAtPixel(evt.pixel,
            function(feature) {
              return feature;
            });
        if (feature) {
  //      feature.style.externalGraphic = 'other/path/image.png';
          var coordinates = feature.getGeometry().getCoordinates();
          popup.setPosition(coordinates);
          TooltipMark.set('content', feature.get('name'));

                  PopUp.open({
            popup: TooltipMark,
              around: element,
              orient: ["above-centered"],
onCancel: function(){
PopUp.close(TooltipMark);
}
        });
          
        } else {
          PopUp.close(TooltipMark);
          
var template = 'Lat: {y}, Long: {x}';
var coordinate = evt.coordinate;
var out = ol.coordinate.format(ol.proj.transform(
            coordinate, 'EPSG:3857', 'EPSG:4326'), template, 6);

        popupCoordContent.innerHTML = '<p>Coordenadas</p><code>' + out +
            '</code>';
       // overlay.setPosition(coordinate);
        PopUp.open({
            popup: TooltipPoint,
                          orient: ["above-centered"],
	x: evt.pixel[0]-12,
y: evt.pixel[1],
onCancel: function(){
popup.close(TooltipPoint);
}
        });         
         
          
        }
      });








 });
}
);
