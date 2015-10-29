define("oams/grid_structures/account_contacts",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {appointment: {r: {field:'appointment', name:'Cargo'},  w: {field:'appointment', name:'Cargo'}},
idaccount: {r: {field:'idaccount', name:'idaccount'},  w: {field:'idaccount', name:'idaccount'}},
idaccountuser: {r: {field:'idaccountuser', name:'idaccountuser'},  w: {field:'idaccountuser', name:'idaccountuser'}},
idcontact: {r: {field:'idcontact', name:'idcontact'},  w: {field:'idcontact', name:'idcontact'}},
note: {r: {field:'note', name:'note'},  w: {field:'note', name:'note'}},
priority: {r: {field:'priority', name:'Prioridad'},  w: {field:'priority', name:'Prioridad'}},
ts: {r: {field:'ts', dataType: 'datetime',  name:'ts'},  w: {field:'ts', dataType: 'datetime', name:'ts'}}}


});


});