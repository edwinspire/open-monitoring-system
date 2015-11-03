define("oams/grid_structures/view_account_network_devices",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {account: {r: {field:'account', width: '5em ', name:'Oficina'},  w: {field:'account', editable: 'true', name:'Oficina'}},
code_ref: {r: {field:'code_ref', width: 'auto' , name:'code_ref'},  w: {field:'code_ref', editable: 'true', name:'code_ref'}},
description: {r: {field:'description', width: 'auto' , name:'Descripción'},  w: {field:'description', editable: 'true', name:'Descripción'}},
enabled: {r: {field:'enabled', width: '50px ', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'Habilitado'},  w: {field:'enabled', width: '50px ', editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'Habilitado'}},
equipment: {r: {field:'equipment', width: 'auto' , name:'Equipo'},  w: {field:'equipment', editable: 'true', name:'Equipo'}},
first_name: {r: {field:'first_name', width: 'auto' , name:'Nombre'},  w: {field:'first_name', editable: 'true', name:'Nombre'}},
geox: {r: {field:'geox', width: 'auto' , name:'Latitud'},  w: {field:'geox', editable: 'true', name:'Latitud'}},
geoy: {r: {field:'geoy', width: 'auto' , name:'Longitud'},  w: {field:'geoy', editable: 'true', name:'Longitud'}},
idaccountstate: {r: {field:'idaccountstate', width: 'auto' , name:'idaccountstate'},  w: {field:'idaccountstate', editable: 'true', name:'idaccountstate'}},
idaccounttype: {r: {field:'idaccounttype', width: 'auto' , name:'idaccounttype'},  w: {field:'idaccounttype', editable: 'true', name:'idaccounttype'}},
idcontact: {r: {field:'idcontact', width: 'auto' , name:'idcontact'},  w: {field:'idcontact', editable: 'true', name:'idcontact'}},
identification: {r: {field:'identification', width: '10em ', name:'Identificación'},  w: {field:'identification', editable: 'true', name:'Identificación'}},
ip: {r: {field:'ip', width: 'auto' , name:'ip'},  w: {field:'ip', editable: 'true', name:'ip'}},
last_name: {r: {field:'last_name', width: 'auto' , name:'Apellido'},  w: {field:'last_name', editable: 'true', name:'Apellido'}},
mac: {r: {field:'mac', width: 'auto' , name:'mac'},  w: {field:'mac', editable: 'true', name:'mac'}},
mark: {r: {field:'mark', width: 'auto' , name:'Marca'},  w: {field:'mark', editable: 'true', name:'Marca'}},
model: {r: {field:'model', width: 'auto' , name:'Modelo'},  w: {field:'model', editable: 'true', name:'Modelo'}},
monitored: {r: {field:'monitored', width: 'auto' , dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'monitored'},  w: {field:'monitored', width: 'auto' , editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'monitored'}},
port: {r: {field:'port', width: 'auto' , name:'port'},  w: {field:'port', editable: 'true', name:'port'}},
pwd: {r: {field:'pwd', width: 'auto' , name:'pwd'},  w: {field:'pwd', editable: 'true', name:'pwd'}},
serial_number: {r: {field:'serial_number', width: 'auto' , name:'Número - Serie'},  w: {field:'serial_number', editable: 'true', name:'Número - Serie'}},
username: {r: {field:'username', width: 'auto' , name:'username'},  w: {field:'username', editable: 'true', name:'username'}}}


});


});