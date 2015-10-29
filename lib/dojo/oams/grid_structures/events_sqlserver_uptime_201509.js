define("oams/grid_structures/events_sqlserver_uptime_201509",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {account: {r: {field:'account', name:'account'},  w: {field:'account', editable: 'true', name:'account'}},
code: {r: {field:'code', name:'code'},  w: {field:'code', editable: 'true', name:'code'}},
dateevent: {r: {field:'dateevent', dataType: 'datetime',  name:'dateevent'},  w: {field:'dateevent', editable: 'true', dataType: 'datetime', name:'dateevent'}},
description: {r: {field:'description', name:'description'},  w: {field:'description', editable: 'true', name:'description'}},
idaccount: {r: {field:'idaccount', dataType: 'number',  name:'idaccount'},  w: {field:'idaccount', editable: 'true', dataType: 'number', name:'idaccount'}},
idadmin: {r: {field:'idadmin', dataType: 'number',  name:'idadmin'},  w: {field:'idadmin', editable: 'true', dataType: 'number', name:'idadmin'}},
idevent: {r: {field:'idevent', name:'idevent'},  w: {field:'idevent', editable: 'true', name:'idevent'}},
ideventtype: {r: {field:'ideventtype', dataType: 'number',  name:'ideventtype'},  w: {field:'ideventtype', editable: 'true', dataType: 'number', name:'ideventtype'}},
last_comment: {r: {field:'last_comment', dataType: 'datetime',  name:'last_comment'},  w: {field:'last_comment', editable: 'true', dataType: 'datetime', name:'last_comment'}},
loaded: {r: {field:'loaded', dataType: 'datetime',  name:'loaded'},  w: {field:'loaded', editable: 'true', dataType: 'datetime', name:'loaded'}},
note: {r: {field:'note', name:'note'},  w: {field:'note', editable: 'true', name:'note'}},
priority: {r: {field:'priority', dataType: 'number',  name:'priority'},  w: {field:'priority', editable: 'true', dataType: 'number', name:'priority'}},
status: {r: {field:'status', dataType: 'number',  name:'status'},  w: {field:'status', editable: 'true', dataType: 'number', name:'status'}},
ts: {r: {field:'ts', dataType: 'datetime',  name:'ts'},  w: {field:'ts', editable: 'true', dataType: 'datetime', name:'ts'}},
uptime: {r: {field:'uptime', dataType: 'number',  name:'uptime'},  w: {field:'uptime', editable: 'true', dataType: 'number', name:'uptime'}},
zu: {r: {field:'zu', name:'zu'},  w: {field:'zu', editable: 'true', name:'zu'}}}


});


});