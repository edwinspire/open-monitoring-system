define("oams/grid_structures/division",['dojo/_base/declare', 'dojo/Evented', 'dojo/date/locale'],function(_1, _2, _3){

  return _1([_2], {
	structure: {description: {r: {field:'description', width: 'auto' , name:'Descripción'},  w: {field:'description', editable: 'true', name:'Descripción'}},
enabled: {r: {field:'enabled', width: 'auto' , dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"'}, alwaysEditing: true,  name:'Habilitado'},  w: {field:'enabled', width: 'auto' , editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true'}, alwaysEditing: true, name:'Habilitado'}},
iddivision: {r: {field:'iddivision', width: 'auto' , name:'Empresa'},  w: {field:'iddivision', editable: 'true', name:'Empresa'}},
name: {r: {field:'name', width: 'auto' , name:'Empresa'},  w: {field:'name', editable: 'true', name:'Empresa'}},
notes: {r: {field:'notes', width: 'auto' , name:'Notas'},  w: {field:'notes', editable: 'true', name:'Notas'}}}


});


});