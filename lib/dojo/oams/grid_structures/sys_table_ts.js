define("oams/grid_structures/sys_table_ts",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {table_name: {r: {field:'table_name', width: 'auto' , name:'table_name'},  w: {field:'table_name', editable: 'true', name:'table_name'}},
ts: {r: {field:'ts', width: 'auto' , dataType: 'datetime',  name:'ts'},  w: {field:'ts', editable: 'true', dataType: 'datetime', name:'ts'}}}


});


});