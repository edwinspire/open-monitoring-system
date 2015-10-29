define("oams/grid_structures/events",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {account: {r: {field:'account', name:'Oficina'},  w: {field:'account', name:'Oficina'}},
code: {r: {field:'code', name:'Codigo'},  w: {field:'code', name:'Codigo'}},
dateevent: {r: {field:'dateevent', dataType: 'datetime',  name:'dateevent'},  w: {field:'dateevent', dataType: 'datetime', name:'dateevent'}},
description: {r: {field:'description', name:'description'},  w: {field:'description', name:'description'}},
idaccount: {r: {field:'idaccount', name:'idaccount'},  w: {field:'idaccount', name:'idaccount'}},
idadmin: {r: {field:'idadmin', name:'idadmin'},  w: {field:'idadmin', name:'idadmin'}},
idevent: {r: {field:'idevent', name:'idevent'},  w: {field:'idevent', name:'idevent'}},
ideventtype: {r: {field:'ideventtype', name:'ideventtype'},  w: {field:'ideventtype', name:'ideventtype'}},
last_comment: {r: {field:'last_comment', dataType: 'datetime',  name:'last_comment'},  w: {field:'last_comment', dataType: 'datetime', name:'last_comment'}},
loaded: {r: {field:'loaded', dataType: 'datetime',  name:'loaded'},  w: {field:'loaded', dataType: 'datetime', name:'loaded'}},
note: {r: {field:'note', name:'note'},  w: {field:'note', name:'note'}},
priority: {r: {field:'priority', name:'Prioridad'},  w: {field:'priority', name:'Prioridad'}},
status: {r: {field:'status', name:'Estado'},  w: {field:'status', name:'Estado'}},
ts: {r: {field:'ts', dataType: 'datetime',  name:'ts'},  w: {field:'ts', dataType: 'datetime', name:'ts'}},
zu: {r: {field:'zu', name:'Zona'},  w: {field:'zu', name:'Zona'}}}


});


});