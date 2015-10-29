define("oams/grid_structures/Ticket",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {fecha_cierre: {r: {field:'fecha_cierre', name:'fecha_cierre'},  w: {field:'fecha_cierre', editable: 'true', name:'fecha_cierre'}},
fecha_reporte: {r: {field:'fecha_reporte', name:'fecha_reporte'},  w: {field:'fecha_reporte', editable: 'true', name:'fecha_reporte'}},
fk_id_farmacia: {r: {field:'fk_id_farmacia', name:'fk_id_farmacia'},  w: {field:'fk_id_farmacia', editable: 'true', name:'fk_id_farmacia'}},
id_ticket: {r: {field:'id_ticket', name:'id_ticket'},  w: {field:'id_ticket', editable: 'true', name:'id_ticket'}},
numero_ticket: {r: {field:'numero_ticket', name:'numero_ticket'},  w: {field:'numero_ticket', editable: 'true', name:'numero_ticket'}},
observaciones: {r: {field:'observaciones', name:'observaciones'},  w: {field:'observaciones', editable: 'true', name:'observaciones'}},
tipo_incidencia: {r: {field:'tipo_incidencia', name:'tipo_incidencia'},  w: {field:'tipo_incidencia', editable: 'true', name:'tipo_incidencia'}},
tt_estado: {r: {field:'tt_estado', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'tt_estado'},  w: {field:'tt_estado', editable: 'true', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'tt_estado'}}}


});


});