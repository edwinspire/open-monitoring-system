define("oams/grid_structures/account_states",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {idaccountstate: {r: {field:'idaccountstate', width: 'auto' , name:'idaccountstate'},  w: {field:'idaccountstate', editable: 'true', name:'idaccountstate'}},
note: {r: {field:'note', width: 'auto' , name:'Notas'},  w: {field:'note', editable: 'true', name:'Notas'}},
state: {r: {field:'state', width: 'auto' , name:'Estado'},  w: {field:'state', editable: 'true', name:'Estado'}},
ts: {r: {field:'ts', width: 'auto' , dataType: 'datetime',  name:'ts'},  w: {field:'ts', editable: 'true', dataType: 'datetime', name:'ts'}}}


});


});