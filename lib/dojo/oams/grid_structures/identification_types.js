define("oams/grid_structures/identification_types",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {enabled: {r: {field:'enabled', width: '50px ', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"'}, alwaysEditing: true,  name:'Habilitado'},  w: {field:'enabled', width: '50px ', editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true'}, alwaysEditing: true, name:'Habilitado'}},
ididtype: {r: {field:'ididtype', width: 'auto' , name:'ididtype'},  w: {field:'ididtype', editable: 'true', name:'ididtype'}},
name: {r: {field:'name', width: 'auto' , name:'name'},  w: {field:'name', editable: 'true', name:'name'}},
note: {r: {field:'note', width: 'auto' , name:'Notas'},  w: {field:'note', editable: 'true', name:'Notas'}},
ts: {r: {field:'ts', width: 'auto' , dataType: 'datetime',  name:'ts'},  w: {field:'ts', editable: 'true', dataType: 'datetime', name:'ts'}}}


});


});