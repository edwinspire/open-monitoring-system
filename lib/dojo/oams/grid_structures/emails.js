define("oams/grid_structures/emails",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {email: {r: {field:'email', width: 'auto' , name:'Email'},  w: {field:'email', editable: 'true', name:'Email'}},
idcontact: {r: {field:'idcontact', width: 'auto' , name:'idcontact'},  w: {field:'idcontact', editable: 'true', name:'idcontact'}},
idemail: {r: {field:'idemail', width: 'auto' , name:'idemail'},  w: {field:'idemail', editable: 'true', name:'idemail'}},
note: {r: {field:'note', width: 'auto' , name:'Notas'},  w: {field:'note', editable: 'true', name:'Notas'}},
notify_if_administrator: {r: {field:'notify_if_administrator', width: 'auto' , dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"'}, alwaysEditing: true,  name:'notify_if_administrator'},  w: {field:'notify_if_administrator', width: 'auto' , editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true'}, alwaysEditing: true, name:'notify_if_administrator'}},
priority: {r: {field:'priority', width: 'auto' , name:'Prioridad'},  w: {field:'priority', editable: 'true', name:'Prioridad'}},
ts: {r: {field:'ts', width: 'auto' , dataType: 'datetime',  name:'ts'},  w: {field:'ts', editable: 'true', dataType: 'datetime', name:'ts'}}}


});


});