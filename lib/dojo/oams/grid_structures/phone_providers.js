define("oams/grid_structures/phone_providers",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {enable: {r: {field:'enable', width: 'auto' , dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"'}, alwaysEditing: true,  name:'Habilitado'},  w: {field:'enable', width: 'auto' , editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true'}, alwaysEditing: true, name:'Habilitado'}},
idprovider: {r: {field:'idprovider', width: 'auto' , name:'idprovider'},  w: {field:'idprovider', editable: 'true', name:'idprovider'}},
provider: {r: {field:'provider', width: 'auto' , name:'provider'},  w: {field:'provider', editable: 'true', name:'provider'}},
ts: {r: {field:'ts', width: 'auto' , dataType: 'datetime',  name:'ts'},  w: {field:'ts', editable: 'true', dataType: 'datetime', name:'ts'}}}


});


});