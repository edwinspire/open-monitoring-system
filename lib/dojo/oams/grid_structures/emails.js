define("oams/grid_structures/emails",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {email: {r: {field:'email', name:'email'},  w: {field:'email', name:'email'}},
idcontact: {r: {field:'idcontact', name:'idcontact'},  w: {field:'idcontact', name:'idcontact'}},
idemail: {r: {field:'idemail', name:'idemail'},  w: {field:'idemail', name:'idemail'}},
note: {r: {field:'note', name:'note'},  w: {field:'note', name:'note'}},
priority: {r: {field:'priority', name:'Prioridad'},  w: {field:'priority', name:'Prioridad'}},
ts: {r: {field:'ts', dataType: 'datetime',  name:'ts'},  w: {field:'ts', dataType: 'datetime', name:'ts'}}}


});


});