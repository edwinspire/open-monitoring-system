define("oams/grid_structures/view_events_monitor",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {account: {r: {field:'account', width: '5em ', name:'Oficina'},  w: {field:'account', editable: 'true', name:'Oficina'}},
code: {r: {field:'code', width: 'auto' , name:'Código'},  w: {field:'code', editable: 'true', name:'Código'}},
dateevent: {r: {field:'dateevent', width: 'auto' , dataType: 'datetime',  name:'dateevent'},  w: {field:'dateevent', editable: 'true', dataType: 'datetime', name:'dateevent'}},
description: {r: {field:'description', width: 'auto' , name:'Descripción'},  w: {field:'description', editable: 'true', name:'Descripción'}},
first_name: {r: {field:'first_name', width: 'auto' , name:'Nombre'},  w: {field:'first_name', editable: 'true', name:'Nombre'}},
idaccount: {r: {field:'idaccount', width: 'auto' , name:'idaccount'},  w: {field:'idaccount', editable: 'true', name:'idaccount'}},
idevent: {r: {field:'idevent', width: 'auto' , name:'idevent'},  w: {field:'idevent', editable: 'true', name:'idevent'}},
ideventtype: {r: {field:'ideventtype', width: 'auto' , name:'ideventtype'},  w: {field:'ideventtype', editable: 'true', name:'ideventtype'}},
label: {r: {field:'label', width: 'auto' , name:'label'},  w: {field:'label', editable: 'true', name:'label'}},
last_comment: {r: {field:'last_comment', width: 'auto' , dataType: 'datetime',  name:'Ultimo Comentario'},  w: {field:'last_comment', editable: 'true', dataType: 'datetime', name:'Ultimo Comentario'}},
last_name: {r: {field:'last_name', width: 'auto' , name:'Apellido'},  w: {field:'last_name', editable: 'true', name:'Apellido'}},
oams_assigned: {r: {field:'oams_assigned', width: 'auto' , name:'Técnico Asignado'},  w: {field:'oams_assigned', editable: 'true', name:'Técnico Asignado'}},
priority: {r: {field:'priority', width: 'auto' , name:'Prioridad'},  w: {field:'priority', editable: 'true', name:'Prioridad'}},
status: {r: {field:'status', width: 'auto' , name:'Estado'},  w: {field:'status', editable: 'true', name:'Estado'}},
status_label: {r: {field:'status_label', width: 'auto' , name:'status_label'},  w: {field:'status_label', editable: 'true', name:'status_label'}},
zu: {r: {field:'zu', width: 'auto' , name:'IDZ'},  w: {field:'zu', editable: 'true', name:'IDZ'}}}


});


});