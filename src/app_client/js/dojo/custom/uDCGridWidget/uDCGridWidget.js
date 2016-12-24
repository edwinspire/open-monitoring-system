define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!uDCGridWidget/uDCGridWidget.html',
    "dojo/topic",
    'dstore/Memory',
    'dstore/Trackable',
    'dstore/Filter',
    'uDCGrid/uDCGrid',
    'dojo/dom-construct',
    'dojo/query',
    "dojo/window",
    "dojo/dom-style",
    "dojo/ready",
    'dojo/request',
    "dojo/on",
    "dojo/_base/array",
    "dojo/dom-class",
    "dojo/fx",
    "dijit/TooltipDialog",
    "dijit/popup",
    "dgrid/extensions/DijitRegistry",
    "dijit/Tooltip",
    "dojo/request/script",
    "dojo/Evented",
    "uDC/uDC", 
    "dijit/form/Form"
    ], function (declare, _Widget, _Templated, templateString, topic, Memory, Trackable, Filter, uDCGrid, domConstruct, query, w, domStyle, ready, request, on, array, domClass, fx, TTD, popup, DijitRegistry, TT, Script, Evented) {

        return declare([_Widget, _Templated, Evented], {
            widgetsInTemplate: true,
            templateString: templateString,
            Config: {},
            Grid: null,
            _GridFieldsToFilter: [],
            _enable_load: false,
            refreshMode: 0,
       // _array_subscribe: [],
       _GStructure: {},
       _IntervalRefresh: null,
        //_selected_data: {}, // Array
        _last_select: null,
        initialQuery: false,
        _setTitlegridAttr: { node: "TitleGrid", type: "innerHTML" },
        postCreate: function () {
            var t = this;

//dojo.parser.parse();
/*
new TT({
    label: "Actualiza manualmente la tabla"
}).addTarget(t.Refresh);

new TT({
    label: "Desactiva la actualización de datos por 120 seg."
}).addTarget(t.DisabledRefreshTempo);
*/

t.Search.on('Change', function (e) {
    t.Grid.Filter(e.value);
});


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
                //popup.close(myTooltipDialog);
            });


on(t.DialogDisabledRefreshOK, 'click', function (e) {
    t.Grid.refreshMode = 3;
    var timeDes = Number(t.DisabledRefreshTime.get('value') * 1000);
              //  console.log('Se desactivara por ' + timeDes);
              popup.close(t.DialogDisabledRefresh);
              setTimeout(function () {
                on.emit(t.Refresh, 'click', {});
            }, timeDes);
          });

on(t.DialogDisabledRefreshCancel, 'click', function (e) {
    popup.close(t.DialogDisabledRefresh);
});



on.once(t.Add, "click", function(){
    // will only fire once...
                    ////////////////////////////////////////////////////
                    // CONFIGURAMOS EL DIALOGO PARA NUEVOS REGISTROS //
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
                // La propiedad t.Add.NewFormSet fue agregada debido a que habia un problema al identificar el NODO al momento de la creacion de widget dandome como NULL, configurarlo para que el nodo se agregue antes de mostrar el dialogo soluciono el inconveniente
                t.HTMLForm.reset();
                t.DialogNew.show();
            });

on(t.DialogNewCancel, 'click', function (e) {
    t.DialogNew.hide();
});


on(t.DialogNewOK, 'click', function (e) {
                      //   console.log('DialogNewOK', t.uDC._modified_fields_to_send);
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


t._create_grid();

},
uninitialize: function(){
    var t = this;
    console.log('Llama para matar el widget');
    clearInterval(t._IntervalRefresh);

/*
        array.forEach(t._array_subscribe, function(s){
	topic.unsubscribe(s);        
        });
        */
        
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

           // t.Store = new (declare([Memory, Trackable]))({ data: null, idProperty: t.Config.idProperty });

            // Instantiate grid
            t.Grid = new uDCGrid({
               target: t.target,
               selectionMode: "none",
               refreshOnTableChanged: t.refreshOnTableChanged,
               initialQuery: t.initialQuery,
               uDCColumns: t.uDCColumns,
               table: t.table,
               rowFingerPrint: t.rowFingerPrint,
               idProperty: t.idProperty
//			                columns: t.Config.Columns
}, t.Contenedor);

		//t.Grid.getColumns();
		t.Grid.startup();
		//t.Select(t.initialQuery);

        on(t.Grid, 'dgrid-set-properties', function (event) {
                // Display an error message above the grid when an error occurs.
              //  console.warn('dgrid-set-properties', event);
//                alert('+');
t.set('titlegrid', event.properties.title_dgrid);
//	console.debug(event);
setTimeout(function(){
  t.resize();
}, 2000);
});


        t.Grid.on('dgrid-error', function (event) {
                // Display an error message above the grid when an error occurs.
                console.error(event);
            });

        t.Grid.on('dgrid-refresh-complete', function (event) {
                // var cell = grid.cell(evt);
              //  console.log('Se ha refrescado la tabla');
              domStyle.set(t.Contenedor, 'height', w.getBox().h-120+'px');
               //  t.resize();
                // cell.element == the element with the dgrid-cell class
                // cell.column == the column definition object for the column the cell is within
                // cell.row == the same object obtained from grid.row(evt)
                //t.Grid.refresh();
                
            });



        t.Grid.on('dgrid-select', function (event) {
              //   var r =  t.Grid.row(event);
             //   console.log('Se ha seleccionado una o mas filas', r, event);

                // cell.element == the element with the dgrid-cell class
                // cell.column == the column definition object for the column the cell is within
                // cell.row == the same object obtained from grid.row(evt)
            });


        t.Grid.on('.dgrid-row:click', function (e) {
           // console.debug(e);
            var row = t.Grid.row(e);
   console.debug('Row clicked:', row);
  on.emit(t, 'ClickRow', row.data);
//console.log(event);
});


           // t.Select(t._last_select);

/////////////////////////////
//** Conectamos con UDC **//
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
// TODO Aqui ocultar el boton de 
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
disabled: function(_disable){

if(_disable){
domClass.add(this.domNode, "element-disabled");
}else{
domClass.remove(this.domNode, "element-disabled");
}
return this;
}









});
});
