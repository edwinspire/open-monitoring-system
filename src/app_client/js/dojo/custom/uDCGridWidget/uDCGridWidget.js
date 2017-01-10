define(['dojo/_base/declare',
  'dijit/_Widget',
  'dijit/_Templated',
  'dojo/text!Widget/uDCGridWidget/uDCGridWidget.html',
  "uDCGrid/uDCGrid",
  "dojo/dom-construct",
  "dojo/on",
  "dojo/dom-style",
  "dojo/window",
  "dojo/topic",
  'dstore/Memory',
  'dstore/Trackable',
  "dijit/form/TextBox",
  "uDC/uDC"
  ],function(declare,_Widget,_Templated,templateString, uDCGrid, domConstruct, on, domStyle,  w){

   return declare([ _Widget, _Templated], {
     widgetsInTemplate:true,
     templateString:templateString,
     Config: {},
     Grid: null,
     _GridFieldsToFilter: [],
     _enable_load: false,
     refreshMode: 0,

     _GStructure: {},
     _IntervalRefresh: null,

     _last_select: null,
     initialQuery: false,
     _setTitlegridAttr: { node: "TitleGrid", type: "innerHTML" },
     postCreate: function () {
      var t = this;

      t.Search.on('Change', function (e) {
        console.debug(e);
            t.Grid.Filter(e.value);
          });

/*
          t._IntervalRefresh = setInterval(function () {
            if (t.Grid.refreshMode == 3) {

              if (domClass.contains(t.DisabledRefreshTempo, "grid_icon_refresh_red")) {
                domClass.remove(t.DisabledRefreshTempo, "grid_icon_refresh_red");
                domClass.add(t.DisabledRefreshTempo, "grid_icon_refresh_white");
              } else {
                domClass.remove(t.DisabledRefreshTempo, "grid_icon_refresh_white");
                domClass.add(t.DisabledRefreshTempo, "grid_icon_refresh_red");
              }

              domClass.replace(t.Refresh, "grid_icon_refresh_red", "grid_icon_refresh_green grid_icon_refresh_white grid_icon_refresh_blue");
            }
          }, 500);


          on(t.Refresh, 'click', function (e) {
            t.Grid.refreshMode = 1;
            domClass.replace(t.DisabledRefreshTempo, "grid_icon_refresh_white", "grid_icon_refresh_green grid_icon_refresh_red grid_icon_refresh_blue");
            domClass.replace(t.Refresh, "grid_icon_refresh_white", "grid_icon_refresh_green grid_icon_refresh_red grid_icon_refresh_blue");
            console.log('Se activa el refresco ');
            t.Grid.Select(t.Grid._last_select);
             
              });


          on(t.DialogDisabledRefreshOK, 'click', function (e) {
            t.Grid.refreshMode = 3;
            var timeDes = Number(t.DisabledRefreshTime.get('value') * 1000);
              
              popup.close(t.DialogDisabledRefresh);
              setTimeout(function () {
                on.emit(t.Refresh, 'click', {});
              }, timeDes);
            });

          on(t.DialogDisabledRefreshCancel, 'click', function (e) {
            popup.close(t.DialogDisabledRefresh);
          });



          on.once(t.Add, "click", function(){

                    if (t.newForm && t.newForm.title) {
                      t.DialogNew.set('title', t.newForm.title);
                    }


                    if (t.newForm && t.newForm.nodeContainer) {
                      var _n =  dojo.byId(t.newForm.nodeContainer);

                      if (_n) {
                        domConstruct.place(_n, t.DialogNewContent, "replace");
                      }
                    }  
                    
                  });





          on(t.Add, 'click', function (e) {

            t.HTMLForm.reset();
            t.DialogNew.show();
          });

          on(t.DialogNewCancel, 'click', function (e) {
            t.DialogNew.hide();
          });


          on(t.DialogNewOK, 'click', function (e) {

            t.uDC.Insert();
            t.DialogNew.hide();
          });




          on(t.DisabledRefreshTempo, 'click', function (e) {
            popup.open({
              popup: t.DialogDisabledRefresh,
              around: t.DisabledRefreshTempo
            });
          });

          t.CollapseLink.set('contentelement', t.XContent);
*/

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
        _setFormnewrowAttr: function (_node, _udc_class, _title) {
          var t = this;
          console.log(_node);
          if (_title) {
            t.DialogNew.set('title', _title);
          }
          t.uDC.set('config', { SelectorClass: _udc_class, NodeContainer: t.DialogNew.domNode });
          domConstruct.place(_node, t.DialogNewContent, "replace");
          return this;
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

            setTimeout(function(){
              t.resize();
            }, 2000);
          });


          t.Grid.on('dgrid-error', function (event) {

            console.error(event);
          });

          t.Grid.on('dgrid-refresh-complete', function (event) {

            domStyle.set(t.Contenedor, 'height', w.getBox().h-120+'px');

          });



          t.Grid.on('dgrid-select', function (event) {

          });


          t.Grid.on('.dgrid-row:click', function (e) {

           var row = t.Grid.row(e);
           console.debug('Row clicked:', row);
           on.emit(t, 'ClickRow', row.data);

         });


          if(t.newForm){

           var conf = t.newForm;
           if(!conf.table || conf.table.length < 1){
             conf.table = t.table || 'uDCGridWidget.undefined.table.uDC';
           }

           if(!conf.target || conf.target.length < 1){
             conf.target = t.target || 'uDCGridWidget.undefined.target.uDC';
           }

           console.debug(conf);            
           t.uDC.set('config', conf);
           domStyle.set(t.Add, 'display', 'block');
         }else{

         }


         return t;
},
_notifications: function (_n) {
 topic.publish("/event/user/notify", [_n]);
},
resize: function(){
 this.Grid.resize();
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