define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!uDC_gridx/uDC_gridx.html',
    'dojo/request',
    "gridx/Grid",
    'dojo/store/Memory',
    'dojo/dom-construct',
"dojo/_base/array",
"dijit/registry",
"gridx/modules/filter/QuickFilter",
'dojo/query',
'uDC/uDC',
 "dojo/ready",
 "dojo/dom-style",
 'dojo/date/locale',
'dojo/store/Observable',
'dojo/on',
'gridx/core/model/cache/Async',
'gridx/modules/Focus', 
'gridx/modules/VirtualVScroller', 
'gridx/modules/Edit', 
'gridx/modules/CellWidget', 
'gridx/modules/RowHeader', 
'gridx/modules/select/Row', 
'gridx/modules/extendedSelect/Row', 
'gridx/modules/IndirectSelect', 
"gridx/modules/Pagination", 
"gridx/modules/pagination/PaginationBar", 
"gridx/modules/ColumnResizer", 
"gridx/modules/Filter",
"gridx/modules/filter/FilterBar",
"gridx/modules/SingleSort",
"gridx/modules/extendedSelect/Row",
"gridx/modules/IndirectSelectColumn",
"gridx/modules/VirtualVScroller",
'dojo/NodeList-traverse'
], function (declare, _Widget, _Templated, templateString, request, Gridx, Memory, domConstruct, array, registry, QuickFilter, query, uDc, ready, style, locale, Observable, on) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        url_data: null,
        structure: {},
	_rowclick_enabled: true,
	auto_select_on_change: false,
	RowSelected: [],
        Grid: null,
	_temp_last_data_to_select: null, // Usando para guardar temporalmente el ultimo set de datos usado para cargar la tabla
        _enable_load: false,
	_is_created: false,
	auto_update_row: false, //TODO posiblemente esta opcion no sea neceario
	load_method: 'auto',
	referential_field: null,
	table: '',
	tuples: null,
refresh_on_changed_table: [],
        postCreate: function () {
            var t = this;


 ready(function(){

t.on('updatedrow', function(o){
t.update(o.item);
});


/*
t.uDC.on('oninsert', function(){
//t.NewForm.reset();
console.log('Reseta los campos para el nuevo registro');
});
*/


var config = {};

 query('input[type=radio]', t.ConfirmDialogLoad.domNode).on('change', function(e){
t.ConfirmDialogLoad.temp_selection_load = e.target.value;
  });


t.ConfirmDialogLoad.on('Execute', function(e){
t.load_method = t.ConfirmDialogLoad.temp_selection_load;
switch(t.load_method){
case 'disabled':
    t.ButtonLoad.set("iconClass", "dijitIcon dijitIconError");
break;
case 'auto':
    t.ButtonLoad.set("iconClass", "dijitEditorIcon dijitEditorIconCreateLink");
break;
case 'manual':
    t.ButtonLoad.set("iconClass", "dijitEditorIcon dijitEditorIconUnlink");
console.log('onloadmanual');
t.emit('onloadmanual');
t._repeat_last_select();
break;
}

});

t.ButtonLoad.on('Click', function(){
 query('input[type=radio]', t.ConfirmDialogLoad.domNode).forEach(function(node){

var dijitnode = registry.getEnclosingWidget(node);

if(node.value == t.load_method){
dijitnode.set('checked', true);
}else{
dijitnode.set('checked', false);
}

  });
});


t.ConfirmDialogNew.on('Execute', function(e){
console.log('ConfirmDialogNew');
t.uDC.set('table', t.table);
t.uDC.set('urldata', t.url_data);
console.log(t.uDC.values());
t.uDC.insert();
t.emit('onclicknew');
});

t.ConfirmDialogDelete.on('Execute', function(e){
console.log('ConfirmDialogDelete');
t.delete_selection();
t.emit('onclickdelete');
});


t.ConfirmDialogExport.on('Execute', function(e){
console.log('ConfirmDialogExport');

var sids = [];

query('input[type=radio]:checked', t.FormExport).forEach(function(item, i){
//console.log(item.value);
switch(item.value){
case 'all':
array.forEach(t.Grid.store.data,
    function(item, i){
       sids.push(item[t.referential_field]);
    }
  );
break;
case 'selection':
sids = t.get("selectedids");
break;
}
});

//console.log(sids);

t.udc_action_export.value = t.table;
t.udc_referential_field_export.value = t.referential_field;
t.udc_action_export_ids.value = "["+sids+"]";
t.FormExport.submit();
t.emit('onclickexport');
});



// Esta configuracion es obtenida de la declarada por html
var getconf = t.get("data-udc-gridx-config");

if(getconf){
config = dojo.fromJson(getconf);
//console.log(config);

t.url_data = config.url_data;
if(!t.url_data){
t.url_data = "/undefined/gridx/url_data.json";
t.uDC.url_data = t.url_data;
}

if(config.auto_select_on_change){
t.auto_select_on_change = config.auto_select_on_change;
}

if(typeof config.new != 'undefined'){

t.bind_fields_new_tuple(config.new.node_form, config.new.class, config.new.append_byArrayIds);

}else{
t.ButtonLoadNew.setAttribute('disabled', true);
}

if(typeof config.url_export != 'undefined'){

if(config.url_export.length > 0){
t.FormExport.action = config.url_export;
}else{
t.FormExport.action = t.url_data;
}

}else{
t.ButtonExport.setAttribute('disabled', true);
}


if(config.referential_field && config.referential_field.length > 0){
t.referential_field = config.referential_field;
}else{
t.referential_field = null;
}

if(config.auto_update_row){
t.auto_update_row = config.auto_update_row;
}else{
t.auto_update_row = false;
}

if(config.refresh_on_changed_table){
t.refresh_on_changed_table = config.refresh_on_changed_table;
}else{
t.refresh_on_changed_table = [];
}


}

if(config.structure){

var data = config.fields;
t.table = config.table;
data.udc_gridx_structure_table = t.table;

//console.log(data);

                request.post(config.structure, {
                    data: data,
                    // Parse data from xml
                    handleAs: "javascript"
                }
                ).then(
                        function (response) {
t.structure = response;
t._create_grid(config.IndirectSelect);
t.set('enabledload', true);

                        },
                        function (error) {
                            console.error(error);
console.debug(config.structure);
                        }
                );
}else{
console.warn('No ha ingresado la url donde se encuentra la estructura de la tabla');
}

 on(window, "on_table_data_has_changed", function(e){

var position = array.indexOf(t.refresh_on_changed_table, e.table_name);
//console.log(e.table_name+' => '+position);
if(t.refresh_on_changed_table){

if(position >= 0){
         t._repeat_last_select();
}

}else{
console.log('La tabla '+e.table_name+' ha sido actualizada pero no ha configurado la opcion refresh_on_changed_table para actualizar automaticamente la tabla');
}

  });

  });



        },

bind_fields_new_tuple: function(node_form, class_selection, append_byArrayIds){
var t = this;
if(typeof node_form  != 'undefined'){

if(dojo.byId(node_form)){
domConstruct.place(node_form, t.NewForm, 'only');
style.set(node_form, "display", "block");

// Este metodo debe ir siempre al inicio porque borra todos los widget que hayan anteriormente

if(append_byArrayIds){

t.uDC.bind_fields(node_form, class_selection, append_byArrayIds);

}else{
t.uDC.bind_fields(node_form, class_selection);
}
}else{
console.error('El nodo id '+node_form+' no es un elemento HTML.');
t.ButtonLoadNew.setAttribute('disabled', true);
}



}else{
console.warn('El nodo id '+node_form+' no es válido o no existe');
t.ButtonLoadNew.setAttribute('disabled', true);
}
return t;
},
_repeat_last_select: function(){

if(this.auto_select_on_change && this._temp_last_data_to_select != null){
//console.log(this._temp_last_data_to_select);
this.select(this._temp_last_data_to_select) ;
}else{
console.log('Posiblemente hubo cambios en la tabla pero no se refrescarán los datos ya que no esta habilitado auto_select_on_change');
}
return this;
},

        _create_grid: function (_IndirectSelect) {

            var t = this;

            domConstruct.empty(t.Contenedor);
var mod = [
'gridx/modules/Focus', 
'gridx/modules/select/Row', 
'gridx/modules/CellWidget', 
'gridx/modules/Edit', 
'gridx/modules/VirtualVScroller',
'gridx/modules/ColumnResizer', 
'gridx/modules/HScroller', 
'gridx/modules/HLayout', 
'gridx/modules/RowHeader', 
'gridx/modules/extendedSelect/Row', 
"gridx/modules/Pagination", 
"gridx/modules/pagination/PaginationBar", 
"gridx/modules/Filter",
"gridx/modules/filter/FilterBar",
"gridx/modules/filter/QuickFilter",
"gridx/modules/SingleSort",
"gridx/modules/extendedSelect/Row"
           ];

if(_IndirectSelect){
mod.push('gridx/modules/IndirectSelect');
}

//console.log(t.structure);

            t.Grid = new Gridx({
                store: new Observable(new Memory()),
                structure: t.structure,
                paginationInitialPageSize: 25,
                //autoHeight: true,
                //autoWidth: true,
                modules: mod,
		barTop: [{plugin: t.TBar, colSpan: 2}],
                summary: 'this is the gridx'
            });
            t.Grid.placeAt(t.Contenedor);
            t.Grid.resize();
            t.Grid.startup();
            t._grid_clear();

///// Capturamos el evento onRowClick y hacemos que devuelva el item correspondiente con todos los datos
            t.Grid.on('rowClick', function (event) {
console.log('Click en la fila'+event);

//t._rowclick_enabled = false;
  var filteredItem = t._getItemFromData(event.rowId);

 t.emit('onItemClick', {item: filteredItem});
            });


///// Capturamos las filas que se van seleccionando 
            t.Grid.connect(t.Grid.select.row, 'onSelectionChange', function (selected_rows) {
                t.RowSelected = selected_rows;
console.log(t.RowSelected.length);
if(t.RowSelected.length > 0){
t.ButtonDeleteSelection.setAttribute("disabled", false);
}else{
t.ButtonDeleteSelection.setAttribute("disabled", true);
}
            });

t._is_created = true;
return t;
        },
_getItemFromData: function(_rowId){
var t = this;
var d = t.Grid.store.data;
var item = {};
var items = dojo.filter(d, function(item){
    return item.unique_id == _rowId;
  });

if(items.length > 0){
item = items[0];
}
return item;
},
        _getSelecteditemsAttr: function () {
var t = this;
return t.Grid.store.query(function(item){
return array.some(t.RowSelected, function(v){
 return item.unique_id == v; 
	});
});

        },
        _getSelectedidsAttr: function () {

var t = this;
var ids = [];

if(t.referential_field && t.referential_field.length > 0){
          array.forEach(t.get('selecteditems'),
    function(item, i){
console.log(item);
       ids.push(item[t.referential_field]);
    }
  );
}else{
console.warn('Grid is not assigned property idnamefield');
}
if(ids.length < 1){
console.warn('Ningun id encontrado usando '+ t.referential_field+' como referencia');
}
console.log(ids);
return ids;
        },
        _getReferential_fieldAttr: function () {
return this.referential_field;
        },
        _setReferential_fieldAttr: function (_name) {
	this.referential_field = _name;
return this;
        },
        _getEnabledloadAttr: function () {
return this._enable_load;
        },
        _setEnabledloadAttr: function (_enable_load) {
	this._enable_load = _enable_load;
return this;
        },
        _getLoadmethodAttr: function () {
return this.load_method;
        },
        _setLoadmethodAttr: function (_method) {
	this.load_method = _method;
return this;
        },
        _getUrldataAttr: function () {
return this.url_data;
        },
        _setUrldataAttr: function (_url) {
	this.url_data = _url;
	this.uDC.url_data = _url;
return this;
        },
        _setStructureAttr: function (_s, _IndirectSelect) {
            this.structure = _s;
            this._create_grid(_IndirectSelect);
        },
        _setAutoupdaterowAttr: function (_aur) {
            this.auto_update_row = _aur;
        },
        resize: function (r) {
            return this.Grid.resize(r);
        },
form_set_value: function(field, value){
this.uDC.set_value(field, value);
},
select: function(_data){
var t = this;
if(t.load_method == 'auto'){
// Esta funcion hace que espere la carga de datos hasta que la tabla haya sido creada

if(!t._is_created){
var interval = setInterval(function(){
if(t._is_created){
t._interval_select(_data, interval);
}else{
console.log('Esperando a que la tabla se haya creado');
}
}, 500);

}else{
t._interval_select(_data, null);
}
}else{
console.log('No se cargara la tabla porque no esta en modo auto');
}
return this;
},
_interval_select: function(_data, _interval){
  var t = this;
if(_interval){
clearInterval(_interval);
}
            if (t.get('enabledload')  && t.get('loadmethod') !== 'disabled') {

if(!_data){
_data = {};
}
	t.request(_data, "select");
}else{
console.log('Se la rechazado la solicitud de carga de datos porque aun hay una solicitud sin terminar o esta desactivada la opcion, se cargará los datos en cuanto este habilitada la opcion.');
}
 return t;
},
// Esta funcion es universal y sirve para enviar o recibir datos desde el servidor
        request: function (_data, _action) {
            var t = this;
t.set('enabledload', false);
console.log('Accion a realizar: '+_action);

	_data.udc_action = _action;
	_data.udc_table = t.table;
	_data.udc_referential_field = t.referential_field;


           
//console.log(_data);
for(var index in _data) { 
//    var attr = object[index]; 
console.log(typeof _data[index]);
}

    
if(t.url_data){
 request.post(t.url_data, {
                    data: _data,
                    // Parse data from xml
                    handleAs: "json"
                }
                ).then(
                        function (response) {
	 //console.log(response);
switch(_action){
case "update":

if(response.update > 0){
window.notification_area({urgency: 10, message: 'Update '+response.update+' row(s)', title: 'Registro actualizado'});
}else{
window.notification_area({urgency: 2, message: response.error, title: 'Registro no actualizado'});
}

t.set('enabledload', true);

// t.emit('onupdate', response);

//t._repeat_last_select();

break;
case "select":
t._temp_last_data_to_select = _data;
                            var myData = {
                                identifier: "unique_id", items: []
                            };

                            array.forEach(response, function (item, i) {
                                var item_temp = item;
                                item_temp.unique_id = i+1;
                                myData.items.push(item_temp);
                            });


                            t._grid_setData(myData);
break;
case "delete":
if(response.delete > 0){
window.notification_area({urgency: 10, message: 'Delete '+response.delete+' row(s)', title: 'Registro eliminado'});
}else{
window.notification_area({urgency: 2, message: response.error, title: 'Registro no eliminado'});
}
t.set('enabledload', true);
//t._repeat_last_select();
// t.emit('ondelete', response);
break;
case "selected":
t.set('enabledload', true);
// t.emit('onselected', response);
//t._repeat_last_select();
break;
default:
t.set('enabledload', true);
// t.emit('onresponseserver', response);
break;
}

                        },
                        function (error) {
t.set('enabledload', true);
window.notification_area({urgency: 1, message: t.url_data+' </br>'+error, title: 'Grid Error!'});
// t.emit('onerror', error);

setTimeout(function(){
console.warn('Hubo un problema en el ultimo request se volverá cargar los datos con los ultimos parametros');
t.select(t._temp_last_data_to_select);
}, 2000);


                             console.warn(error+" in "+t.url_data);
                        }
                );
}else{
console.warn('No ha definido una url_data');
}
return t;
        },
        update: function (_data) {
            var t = this;
if(t.referential_field && t.referential_field.length > 0){

if(t.auto_update_row){
		_data.udc_referential_field  = t.referential_field;
		t.request(_data, "update");
}else{
console.log('Auto Update no ha sido habilitado');
}

}else{
console.warn('El referential_field es necesario para actualizaciones de registros');
}
return t;
        },
	delete_selection: function(){
return this.selected(null, 'delete_selection');
}, 
        selected: function (_data, _selected_action) {
            var t = this;
if(!_data){
_data = {};
}

if(t.RowSelected.length > 0){

if(_selected_action && _selected_action.length > 0){
_data.udc_selected_action = _selected_action;
}else{
_data.udc_selected_action = "selected";
}

_data.udc_referential_field  = t.referential_field;
_data.udc_selected_id = '['+t.get('selectedids').toString()+']';
t.request(_data, _data.udc_selected_action);
}else{
console.log('No ha realizado ninguna selecccion');
}
return t;
        },

        _grid_clear: function () {
            var myData = {identifier: "unique_id", items: []};
            this._grid_setData(myData);
return this;
        },
clear: function(){
return this._grid_clear();
},
        _grid_setData: function (_data) {
            var t = this;
 
           t.Grid.store = null;

// create the initial Observable store
var store = new Observable(new Memory({data: _data}));

//console.log(t.Grid.model)

// now listen for any changes
var observeHandle = store.query().observe(function(object, removedFrom, insertedInto){
//console.log(object);
t.emit('updatedrow', {item: object});
}, true);

        t.Grid.setStore(store)
		t.Grid.resize();

t.set('enabledload', true);
 //t.emit('onselect', {});
return t;
        }







    });
});
