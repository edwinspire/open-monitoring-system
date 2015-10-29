define("oams/grid_structures/events_dbsizes",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {account: {r: {field:'account', name:'account'},  w: {field:'account', name:'account'}},
code: {r: {field:'code', name:'code'},  w: {field:'code', name:'code'}},
dateevent: {r: {field:'dateevent', dataType: 'datetime',  name:'dateevent'},  w: {field:'dateevent', dataType: 'datetime', name:'dateevent'}},
db_name: {r: {field:'db_name', name:'db_name'},  w: {field:'db_name', name:'db_name'}},
db_size: {r: {field:'db_size', name:'db_size'},  w: {field:'db_size', name:'db_size'}},
db_type: {r: {field:'db_type', name:'db_type'},  w: {field:'db_type', name:'db_type'}},
description: {r: {field:'description', name:'description'},  w: {field:'description', name:'description'}},
idaccount: {r: {field:'idaccount', name:'idaccount'},  w: {field:'idaccount', name:'idaccount'}},
idadmin: {r: {field:'idadmin', name:'idadmin'},  w: {field:'idadmin', name:'idadmin'}},
idevent: {r: {field:'idevent', name:'idevent'},  w: {field:'idevent', name:'idevent'}},
ideventtype: {r: {field:'ideventtype', name:'ideventtype'},  w: {field:'ideventtype', name:'ideventtype'}},
last_comment: {r: {field:'last_comment', dataType: 'datetime',  name:'last_comment'},  w: {field:'last_comment', dataType: 'datetime', name:'last_comment'}},
loaded: {r: {field:'loaded', dataType: 'datetime',  name:'loaded'},  w: {field:'loaded', dataType: 'datetime', name:'loaded'}},
note: {r: {field:'note', name:'note'},  w: {field:'note', name:'note'}},
priority: {r: {field:'priority', name:'priority'},  w: {field:'priority', name:'priority'}},
status: {r: {field:'status', name:'status'},  w: {field:'status', name:'status'}},
ts: {r: {field:'ts', dataType: 'datetime',  name:'ts'},  w: {field:'ts', dataType: 'datetime', name:'ts'}},
zu: {r: {field:'zu', name:'zu'},  w: {field:'zu', name:'zu'}}}


});


});