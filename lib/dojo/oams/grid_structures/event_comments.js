define("oams/grid_structures/event_comments",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {comment_event: {r: {field:'comment_event', width: 'auto' , name:'comment_event'},  w: {field:'comment_event', editable: 'true', name:'comment_event'}},
idadmin: {r: {field:'idadmin', width: 'auto' , name:'idadmin'},  w: {field:'idadmin', editable: 'true', name:'idadmin'}},
idevent: {r: {field:'idevent', width: 'auto' , name:'idevent'},  w: {field:'idevent', editable: 'true', name:'idevent'}},
ideventcomment: {r: {field:'ideventcomment', width: 'auto' , name:'ideventcomment'},  w: {field:'ideventcomment', editable: 'true', name:'ideventcomment'}},
seconds: {r: {field:'seconds', width: 'auto' , name:'Segundos'},  w: {field:'seconds', editable: 'true', name:'Segundos'}},
start: {r: {field:'start', width: 'auto' , dataType: 'datetime',  name:'Inicio'},  w: {field:'start', editable: 'true', dataType: 'datetime', name:'Inicio'}},
status: {r: {field:'status', width: 'auto' , name:'Estado'},  w: {field:'status', editable: 'true', name:'Estado'}},
ts: {r: {field:'ts', width: 'auto' , dataType: 'datetime',  name:'ts'},  w: {field:'ts', editable: 'true', dataType: 'datetime', name:'ts'}}}


});


});