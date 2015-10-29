define("oams/grid_structures/account_types",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {idaccounttype: {r: {field:'idaccounttype', width: 'auto' , name:'idaccounttype'},  w: {field:'idaccounttype', editable: 'true', name:'idaccounttype'}},
note: {r: {field:'note', width: 'auto' , name:'Notas'},  w: {field:'note', editable: 'true', name:'Notas'}},
ts: {r: {field:'ts', width: 'auto' , dataType: 'datetime',  name:'ts'},  w: {field:'ts', editable: 'true', dataType: 'datetime', name:'ts'}},
type: {r: {field:'type', width: 'auto' , name:'Tipo'},  w: {field:'type', editable: 'true', name:'Tipo'}}}


});


});