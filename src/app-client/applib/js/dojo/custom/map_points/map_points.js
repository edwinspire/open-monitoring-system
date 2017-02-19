define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!Widget/map_points/map_points.html',
    "dojo/dom-attr",
    "dijit/TooltipDialog",
    "dijit/popup",
    'dojo/on',
    "dojo/_base/window",
    "dojo/dom-style",
    "dojo/window",
    "dojo/keys",
    "dojo/_base/array",
    "../../applib/vendors/OpenLayers_v3-17-1/ol.js",
    "dojo/store/Memory" 
    ], function (declare, _Widget, _Templated, templateString,   domAttr, TTD, PopUp, on, win, domStyle, dwin, keys, array, ol, Memory) {
    /**
     * Account Data
     *
     * @module account_data/account_data
     */
     return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        _store: new Memory(),
        _vectorSourceMap: new ol.source.Vector({}),
        _BaseMap: {},
        _Styles: {},
        postCreate: function () {

            var t = this;

            t._BaseMap = new ol.Map({layers: [new ol.layer.Tile({source: new ol.source.OSM()}), new ol.layer.Vector({source: t._vectorSourceMap})], target: t.map, view: new ol.View({center: [0, 0], zoom: 10}) });

            t._Styles['Eco'] = t._CreateStyle('applib/images/eco.png');
            t._Styles['Medi'] = t._CreateStyle('applib/images/medi.png');
            t._Styles['PAF'] = t._CreateStyle('applib/images/paf.png');
            t._Styles['DIFARMES'] = t._CreateStyle('applib/images/difarmes.png');
            t._Styles['PNatural'] = t._CreateStyle('applib/images/pnatural.png');
            t._Styles['Default'] = t._CreateStyle('applib/images/default.png');    



            on(t, 'requestrender', function(){
              console.debug('Solicita render');
              t._BaseMap.updateSize();
          });


            on(win.doc, "keyup", function(event) {
                if(event.keyCode == keys.ESCAPE){
                  PopUp.close(TooltipMark);
                  PopUp.close(TooltipPoint);
              }
          });  


            on(t.popupCoordCloser, 'click', function(){
                PopUp.close(TooltipPoint);
            });    



//////////////////////////////////////////
var TooltipMark = new TTD({
  style: "width-min: 60px;",
});


//////////////////////////////////////////
var TooltipPoint = new TTD({
  style: "width-min: 60px;",
        content: t.popupCoord //,
        /*onMouseLeave: function(){
            popup.close(TooltipMark);
        }*/
    });    

//var element = t.popup;

var popup = new ol.Overlay({
  element: t.popup,
  positioning: 'bottom-center',
  stopEvent: false,
  offset: [0, -40]
});
t._BaseMap.addOverlay(popup);




      // display popup on click
      t._BaseMap.on('click', function(evt) {
        var feature = t._BaseMap.forEachFeatureAtPixel(evt.pixel,
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
    around: t.popup,
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

  t.popupCoordContent.innerHTML = '<p>Coordenadas</p><code>' + out +
  '</code>';
       // overlay.setPosition(coordinate);
       PopUp.open({
        popup: TooltipPoint,
        orient: ["above-centered"],
        x: evt.pixel[0]+60+10,
        y: evt.pixel[1]+130,
        onCancel: function(){
          popup.close(TooltipPoint);
      }
  });         


   }
});

















  },
  _CreateStyle: function (icon){
    return new ol.style.Style({
      image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [11, 39],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
      //    offset: [1000, 9],
      src: icon
  }))
  });
},
_CenterMap: function (geox, geoy) {
    var t = this;
    t._BaseMap.getView().setCenter(ol.proj.fromLonLat([geoy, geox]));
    t._BaseMap.getView().setZoom(18);
    t._BaseMap.updateSize();
},
render: function(){
    this._BaseMap.updateSize();
},
setPoints: function(ps){
    var t = this;
    console.debug('El punto ha cambiado', ps);
      //console.log('Dispara e evento', WComponent.idProperty, ps.detail.points);
      //domStyle.set(WComponent, 'height', dwin.getBox().h-125+'px');
      domStyle.set(t.map, 'height', dwin.getBox().h-125+'px');
      t._vectorSourceMap.clear();
      

      t._store.setData(ps);

      t._store.query().forEach(function(item, i){

          var featurething = new ol.Feature({
            name: item.fullname,
            geometry: new ol.geom.Point(ol.proj.fromLonLat([item.geoy, item.geox]))
        });


          if(item.fullname.indexOf("ECO") == 0){
            t._Styles['Eco'].src = 'applib/images/default.png';
            featurething.setStyle(t._Styles['Eco']);
        }else if(item.fullname.indexOf("MEDI") == 0){
            featurething.setStyle(t._Styles['Medi']);
        }else if(item.fullname.indexOf("PAF") == 0){
            featurething.setStyle(t._Styles['PAF']);
        }else if(item.fullname.indexOf("PUNTO") == 0){
            featurething.setStyle(t._Styles['PNatural']);
        }else if(item.fullname.indexOf("DIFARMES") == 0){
            featurething.setStyle(t._Styles['DIFARMES']);
        }else{
            featurething.setStyle(t._Styles['Default']);
        } 


        t._vectorSourceMap.addFeature( featurething );

        if(item.center){
            t._CenterMap(item.geox, item.geoy);
        }


    });



  }











});
});
