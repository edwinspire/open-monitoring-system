define("oams/grid_structures/events_sqlserver_uptime",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {account: {r: {field:'account', name:'account'},  w: {field:'account', editable: 'true', name:'account'}},
code: {r: {field:'code', name:'code'},  w: {field:'code', editable: 'true', name:'code'}},
dateevent: {r: {field:'dateevent', dataType: 'datetime',  name:'dateevent'},  w: {field:'dateevent', editable: 'true', dataType: 'datetime', name:'dateevent'}},
description: {r: {field:'description', name:'description'},  w: {field:'description', editable: 'true', name:'description'}},
idaccount: {r: {field:'idaccount', name:'idaccount'},  w: {field:'idaccount', editable: 'true', name:'idaccount'}},
idadmin: {r: {field:'idadmin', name:'idadmin'},  w: {field:'idadmin', editable: 'true', name:'idadmin'}},
idevent: {r: {field:'idevent', name:'idevent'},  w: {field:'idevent', editable: 'true', name:'idevent'}},
ideventtype: {r: {field:'ideventtype', name:'ideventtype'},  w: {field:'ideventtype', editable: 'true', name:'ideventtype'}},
last_comment: {r: {field:'last_comment', dataType: 'datetime',  name:'last_comment'},  w: {field:'last_comment', editable: 'true', dataType: 'datetime', name:'last_comment'}},
loaded: {r: {field:'loaded', dataType: 'datetime',  name:'loaded'},  w: {field:'loaded', editable: 'true', dataType: 'datetime', name:'loaded'}},
priority: {r: {field:'priority', name:'priority'},  w: {field:'priority', editable: 'true', name:'priority'}},
status: {r: {field:'status', name:'status'},  w: {field:'status', editable: 'true', name:'status'}},
ts: {r: {field:'ts', dataType: 'datetime',  name:'ts'},  w: {field:'ts', editable: 'true', dataType: 'datetime', name:'ts'}},
uptime: {r: {field:'uptime', name:'uptime'},  w: {field:'uptime', editable: 'true', name:'uptime'}},
zu: {r: {field:'zu', name:'zu'},  w: {field:'zu', editable: 'true', name:'zu'}}}


});


});