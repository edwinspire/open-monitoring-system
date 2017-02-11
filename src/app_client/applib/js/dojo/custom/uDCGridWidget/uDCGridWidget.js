define(['dojo/_base/declare',
	'dijit/_Widget',
	'dijit/_Templated',
	'dojo/text!Widget/uDCGridWidget/uDCGridWidget.html',
  "dojo/Evented",
  "Widget/uDCGrid/uDCGrid",
  "dijit/layout/ContentPane",
  "dojo/dom-construct",
  "dojo/on",
  "dojo/dom-style",
  "dojo/window",
  "dojo/topic",
  'dstore/Memory',
  'dstore/Trackable',
  "dijit/form/TextBox",
  "dijit/ToolbarSeparator",
  "dijit/form/NumberSpinner",
  "dijit/ConfirmTooltipDialog",
  "dijit/RadioMenuItem",
  "dijit/MenuItem",
  "dijit/PopupMenuItem",
  "dijit/Menu"
  ],function(declare,_Widget,_Templated,templateString, Evented, uDCGrid, ContentPane, domConstruct, on, domStyle,  w){

    return declare([ _Widget, _Templated, Evented], {
     widgetsInTemplate:true,
     templateString:templateString,
     Config: {},
     Grid: null,
     _enable_load: false,
     refreshMode: 0,
     DialogAddContent: false,
     _GStructure: {},
     _IntervalRefresh: null,
     _RemainDisabledRefresh: 0,
     _last_select: null,
     initialQuery: false,
     _setTitlegridAttr: { node: "TitleGrid", type: "innerHTML" },
     postCreate: function () {
      var t = this;

      t.startup();

      t.Search.on('Change', function (e) {
        t.Grid.Filter(e);
      });


      t._IntervalRefresh = setInterval(function () {
       if (t.Grid.refreshMode == 3 && t._RemainDisabledRefresh > 0) {
        t._RemainDisabledRefresh--;
        t.RefreshTempo.set('label', 'Desactivado por '+t._RemainDisabledRefresh+' seg.');


      }else if(t._RemainDisabledRefresh < 1){
        t.RefreshTempo.set('label', 'Desactivar');
        t.Grid.refreshMode = 1;
        t._RemainDisabledRefresh = 120;	
      }else{
        t.RefreshTempo.set('label', 'Desactivar');
      }
    }, 1000);


      on(t.RefreshAuto, 'click', function (e) {
       t.Grid.refreshMode = 1;
       t.Grid.Select(t.Grid._last_select);
     });

      on(t.RefreshTempo, 'click', function (e) {
       t.Grid.refreshMode = 3;
       t.RefreshTempo.set('label', 'Desactivar');
       t._RemainDisabledRefresh = 120;
     });


      t.CTTDialogNew.on('Execute', function(e){
        t.emit('addok', e);
      });

      t.CTTDialogNew.on('Cancel', function(e){
        t.emit('addcancel', e);
      });


      on.once(t.Add, "Click", function(){

       if(t.DialogAddContent){
        dojo.place(dojo.byId(t.DialogAddContent), t.ContainerDialogNew, 'only');
      }   

    });

      t._create_grid();


    },
    uninitialize: function(){
     var t = this;
     console.log('Llama para matar el widget');
     clearInterval(t._IntervalRefresh);


     t.Grid.uninitialize();

     t.Grid.destroy();
     delete t.Grid;
     t.Grid = null;

   },     
   _create_grid: function () {

     var t = this;

     domConstruct.empty(t.Contenedor);

     t.Grid = new uDCGrid({
      target: t.target,
      selectionMode: "none",
      refreshOnTableChanged: t.refreshOnTableChanged,
      initialQuery: t.initialQuery,
      uDCColumns: t.uDCColumns,
      table: t.table,
      rowFingerPrint: t.rowFingerPrint,
      idProperty: t.idProperty

    }, t.Contenedor);

     t.Grid.startup();


     on(t.Grid, 'dgrid-set-properties', function (event) {
      t.set('titlegrid', event.properties.title_dgrid);
    });


     t.Grid.on('dgrid-error', function (event) {
      console.error(event);
    });

     t.Grid.on('dgrid-refresh-complete', function (event) {
      t.autoHeight();
    });



     t.Grid.on('dgrid-select', function (event) {

     });


     t.Grid.on('.dgrid-row:click', function (e) {
      var row = t.Grid.row(e);
      t.emit('ClickRow', row.data);
    });

t.autoHeight();

     return t;
   },
   autoHeight: function(){
    var t = this;
    var h = domStyle.get(t.domNode.parentElement, 'height') - (domStyle.get(t.TBar.domNode, 'height')+15);
    domStyle.set(t.Grid.domNode, 'height', h+'px');
//    console.debug(domStyle.get(t.domNode.parentElement, 'height'), domStyle.get(t.domNode, 'height'), h);
  },
  _notifications: function (_n) {
   topic.publish("/event/user/notify", [_n]);
 },
 resize: function(wh){
   if(this.Grid){
    this.Grid.resize(wh);
  }
},
_setSizecontainerAttr: function(size){
  var t = this;
  var h = domStyle.get(t.TBar.domNode, 'height');
  var w = domStyle.get(t.TBar.domNode, 'width');

  if(size.height){
    h = size.height - h;
    domStyle.set(t.Grid.domNode, 'height', h+'px');
    console.debug(size, h, w);
  }

  if(size.width){
    w = size.width - w;
    domStyle.set(t.Grid.domNode, 'width', w+'px');
  }




  //   
},
Clear: function(){
 this.Grid.Clear();
 return this;
},
disabledGrid: function(_disabled){
 this.Grid.disabled(_disabled);
},
_disabled: function(_disable){

 if(_disable){
  domClass.add(this.domNode, "element-disabled");
}else{
  domClass.remove(this.domNode, "element-disabled");
}
return this;
}















});
});