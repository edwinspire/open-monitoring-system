define("oams/grid_structures/events_jobs_201508",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {account: {r: {field:'account', name:'account'},  w: {field:'account', name:'account'}},
code: {r: {field:'code', name:'code'},  w: {field:'code', name:'code'}},
dateevent: {r: {field:'dateevent', dataType: 'datetime',  name:'dateevent'},  w: {field:'dateevent', dataType: 'datetime', name:'dateevent'}},
description: {r: {field:'description', name:'description'},  w: {field:'description', name:'description'}},
idaccount: {r: {field:'idaccount', name:'idaccount'},  w: {field:'idaccount', name:'idaccount'}},
idadmin: {r: {field:'idadmin', name:'idadmin'},  w: {field:'idadmin', name:'idadmin'}},
idevent: {r: {field:'idevent', name:'idevent'},  w: {field:'idevent', name:'idevent'}},
ideventtype: {r: {field:'ideventtype', name:'ideventtype'},  w: {field:'ideventtype', name:'ideventtype'}},
job_date_create: {r: {field:'job_date_create', dataType: 'datetime',  name:'job_date_create'},  w: {field:'job_date_create', dataType: 'datetime', name:'job_date_create'}},
job_description: {r: {field:'job_description', name:'job_description'},  w: {field:'job_description', name:'job_description'}},
job_enabled: {r: {field:'job_enabled', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'job_enabled'},  w: {field:'job_enabled', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'job_enabled'}},
job_name: {r: {field:'job_name', name:'job_name'},  w: {field:'job_name', name:'job_name'}},
job_next_run: {r: {field:'job_next_run', dataType: 'datetime',  name:'job_next_run'},  w: {field:'job_next_run', dataType: 'datetime', name:'job_next_run'}},
job_run_duration: {r: {field:'job_run_duration', name:'job_run_duration'},  w: {field:'job_run_duration', name:'job_run_duration'}},
job_run_status: {r: {field:'job_run_status', name:'job_run_status'},  w: {field:'job_run_status', name:'job_run_status'}},
last_comment: {r: {field:'last_comment', dataType: 'datetime',  name:'last_comment'},  w: {field:'last_comment', dataType: 'datetime', name:'last_comment'}},
loaded: {r: {field:'loaded', dataType: 'datetime',  name:'loaded'},  w: {field:'loaded', dataType: 'datetime', name:'loaded'}},
note: {r: {field:'note', name:'note'},  w: {field:'note', name:'note'}},
priority: {r: {field:'priority', name:'priority'},  w: {field:'priority', name:'priority'}},
status: {r: {field:'status', name:'status'},  w: {field:'status', name:'status'}},
ts: {r: {field:'ts', dataType: 'datetime',  name:'ts'},  w: {field:'ts', dataType: 'datetime', name:'ts'}},
zu: {r: {field:'zu', name:'zu'},  w: {field:'zu', name:'zu'}}}


});


});