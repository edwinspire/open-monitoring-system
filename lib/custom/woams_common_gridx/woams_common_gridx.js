define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!woams_common_gridx/woams_common_gridx.html',
    'dojo/request',
    "gridx/Grid",
    'dojo/store/Memory',
    'dojo/dom-construct',
"dojo/_base/array",
    'gridx/modules/Dod',
    'gridx/modules/Focus',
    "gridx/core/model/cache/Async",
    'gridx/modules/Focus', 'gridx/modules/VirtualVScroller', 'gridx/modules/Edit', 'gridx/modules/CellWidget', 'gridx/modules/RowHeader', 'gridx/modules/select/Row', 'gridx/modules/extendedSelect/Row', 'gridx/modules/IndirectSelect', "gridx/modules/Pagination", "gridx/modules/pagination/PaginationBar", "gridx/modules/ColumnResizer", "gridx/modules/Filter",
    "gridx/modules/filter/FilterBar",
    "gridx/modules/filter/QuickFilter",
    "gridx/modules/SingleSort",
    "gridx/modules/extendedSelect/Row",
    "gridx/modules/IndirectSelectColumn",
    "gridx/modules/VirtualVScroller"
], function (declare, _Widget, _Templated, templateString, request, Grid, Memory, domConstruct, array) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        Url: "oams_php_query/view_events_monitor.php",
        _structure: {},
	_rowclick_enabled: true,
	RowSelected: [],
        Grid: new Grid({}),
        _enable_load: false,
	_auto_update_row: false,
	_id_name_field: null,
        postCreate: function () {
            var t = this;
            setTimeout(function () {
                t._enable_load = true;
            }, 3000);
        },
        _create_grid: function () {

            var t = this;
            domConstruct.empty(t.Contenedor);

            t.Grid = new Grid({
                store: new Memory({}),
                structure: t._structure,
                paginationInitialPageSize: 25,
                //autoHeight: true,
                //autoWidth: true,
                modules: [
                    'gridx/modules/Focus', 'gridx/modules/VirtualVScroller', 'gridx/modules/Edit', 'gridx/modules/CellWidget', 'gridx/modules/RowHeader', 'gridx/modules/select/Row', 'gridx/modules/extendedSelect/Row', 'gridx/modules/IndirectSelect', "gridx/modules/Pagination", "gridx/modules/pagination/PaginationBar", "gridx/modules/ColumnResizer", "gridx/modules/Filter",
                    "gridx/modules/filter/FilterBar",
                    "gridx/modules/filter/QuickFilter",
                    "gridx/modules/SingleSort",
                    "gridx/modules/extendedSelect/Row",
                    "gridx/modules/IndirectSelectColumn"
                ],
                summary: 'this is the gridx'
            });
            t.Grid.placeAt(t.Contenedor);
            t.Grid.resize();
            t.Grid.startup();
            t._grid_clear();

///// Capturamos el evento onRowClick y hacemos que devuelva el item correspondiente con todos los datos
            t.Grid.connect(t.Grid, 'onRowClick', function (event) {
console.log('Click en la fila'+event);

//t._rowclick_enabled = false;
  var filteredItem = t._getItemFromData(event.rowId);
console.log('Obtenemos item ');
console.log(filteredItem);
//t._rowclick_enabled = true;
//if(filteredItem.length > 0){
//console.log(filteredItem[0]);
console.log('Hasta aqyi ok');
 t.emit('onItemClick', {item: filteredItem});



            });


///// Capturamos las filas que se van seleccionando 
            t.Grid.connect(t.Grid.select.row, 'onSelectionChange', function (selected_rows) {
                t.RowSelected = selected_rows;
//console.log(t.RowSelected);
            });

// Dispara un evento cuando hay un cambio en una de las filas
t.Grid.edit.connect(t.Grid.edit, "onApply", function(cell, applySuccess) {
var _d = t._getItemFromData(cell.row.id);
t.emit("onUpdateRow", {data: _d});

if(t._auto_update_row){
t.update_row(_d);
}

});

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
  return dojo.filter(t.Grid.store.data, function(item){
	return dojo.some(t.RowSelected, function(rowId){
    return rowId == item.unique_id;
});
  });           
        },
        _getSelectedidsAttr: function () {
var t = this;
var ids = [];
if(t._id_name_field && t._id_name_field.length > 0){
          array.forEach(t.get('selecteditems'),
    function(item, i){
       ids.push(item[t._id_name_field]);
    }
  );
}else{
console.warn('Grid is not assigned property idnamefield');
}
return ids;
        },
        _getIdnamefieldAttr: function () {
return this._id_name_field;
        },
        _setIdnamefieldAttr: function (_name) {
	this._id_name_field = _name;
        },
        _setStructureAttr: function (_s) {
            this._structure = _s;
            this._create_grid();
        },
        _setAutoupdaterowAttr: function (_asc) {
            this._auto_update_row = _asc;
        },
        resize: function (r) {
            return this.Grid.resize(r);
        },
        load: function (_data) {

            var t = this;
if(!_data){
_data = {};
}

            if (t._enable_load) {

                t._enable_load = false;
		_data.query_type = "select";
                request.post(t.Url, {
                    data: _data,
                    // Parse data from xml
                    handleAs: "json"
                }
                ).then(
                        function (response) {

                            var myData = {
                                identifier: "unique_id", items: []
                            };

                            dojo.forEach(response, function (item, i) {
                                var item_temp = item;
                                item_temp.unique_id = i + 1;
                                myData.items.push(item_temp);
                            });

                            t._grid_setData(myData);
                        },
                        function (error) {
                            console.warn(error+" in "+t.Url);
                            // Display the error returned
                            t._enable_load = true;
                            t.Grid.emit('onnotify', {msg: error});
                        }
                );
                t.Grid.resize();
            }

        },
        update_row: function (_data) {
            var t = this;
	_data.query_type = "update";
//console.warn(_data);
                request.post(t.Url, {
                    data: _data,
                    // Parse data from xml
                    handleAs: "json"
                }
                ).then(
                        function (response) {
	console.log(response);
 t.emit('onUpdateRowOnServer', response);
                        },
                        function (error) {
                             console.warn(error+" in "+t.Url);
                            // Display the error returned
                          //  t._enable_load = true;
                           // t.Grid.emit('onnotify', {msg: error});
                        }
                );
               // t.Grid.resize();

        },
        send_selected_ids: function (_query_type, _data) {
            var t = this;
if(!_data){
_data = {};
}

if(_query_type && _query_type.length > 0){
_data.query_type = _query_type;
}else{
_data.query_type = "selected_ids";
}

_data.selected_ids = t.get('selectedids').toString();

                request.post(t.Url, {
                    data: _data,
                    // Parse data from xml
                    handleAs: "json"
                }
                ).then(
                        function (response) {
	console.log(response);
 t.emit('onSendSelectedIds', {response: response});
                        },
                        function (error) {
                            console.warn(error+" in "+t.Url);
                            // Display the error returned
                          //  t._enable_load = true;
                           // t.Grid.emit('onnotify', {msg: error});
                        }
                );
               // t.Grid.resize();

        },
        _grid_clear: function () {
            var myData = {identifier: "unique_id", items: []};
            this._grid_setData(myData);
        },
        _grid_setData: function (_data) {
            var t = this;
            t.Grid.store = null;
            t.Grid.setStore(new Memory({data: _data}));
            console.log('Aqui termina de cargar y mostrar');
            t._enable_load = true;
        }







    });
});
