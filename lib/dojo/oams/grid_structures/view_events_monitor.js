define("oams/grid_structures/view_events_monitor",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {account: {r: {field:'account', name:'account'},  w: {field:'account', name:'account'}},
code: {r: {field:'code', name:'code'},  w: {field:'code', name:'code'}},
dateevent: {r: {field:'dateevent', dataType: 'datetime',  name:'dateevent'},  w: {field:'dateevent', dataType: 'datetime', name:'dateevent'}},
description: {r: {field:'description', name:'description'},  w: {field:'description', name:'description'}},
first_name: {r: {field:'first_name', name:'first_name'},  w: {field:'first_name', name:'first_name'}},
idaccount: {r: {field:'idaccount', name:'idaccount'},  w: {field:'idaccount', name:'idaccount'}},
idevent: {r: {field:'idevent', name:'idevent'},  w: {field:'idevent', name:'idevent'}},
ideventtype: {r: {field:'ideventtype', name:'ideventtype'},  w: {field:'ideventtype', name:'ideventtype'}},
label: {r: {field:'label', name:'label'},  w: {field:'label', name:'label'}},
last_comment: {r: {field:'last_comment', dataType: 'datetime',  name:'last_comment'},  w: {field:'last_comment', dataType: 'datetime', name:'last_comment'}},
last_name: {r: {field:'last_name', name:'last_name'},  w: {field:'last_name', name:'last_name'}},
oams_assigned: {r: {field:'oams_assigned', name:'oams_assigned'},  w: {field:'oams_assigned', name:'oams_assigned'}},
priority: {r: {field:'priority', name:'priority'},  w: {field:'priority', name:'priority'}},
status: {r: {field:'status', name:'status'},  w: {field:'status', name:'status'}},
status_label: {r: {field:'status_label', name:'status_label'},  w: {field:'status_label', name:'status_label'}},
zu: {r: {field:'zu', name:'zu'},  w: {field:'zu', name:'zu'}}}


});


});