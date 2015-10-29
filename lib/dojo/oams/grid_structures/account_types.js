define("oams/grid_structures/account_types",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {idaccounttype: {r: {field:'idaccounttype', name:'idaccounttype'},  w: {field:'idaccounttype', name:'idaccounttype'}},
note: {r: {field:'note', name:'Notas'},  w: {field:'note', name:'Notas'}},
ts: {r: {field:'ts', dataType: 'datetime',  name:'ts'},  w: {field:'ts', dataType: 'datetime', name:'ts'}},
type: {r: {field:'type', name:'type'},  w: {field:'type', name:'type'}}}


});


});