define("oams/grid_structures/providers",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {address: {r: {field:'address', width: 'auto' , name:'Dirección'},  w: {field:'address', editable: 'true', name:'Dirección'}},
address_ref: {r: {field:'address_ref', width: 'auto' , name:'Dirección - Ref.'},  w: {field:'address_ref', editable: 'true', name:'Dirección - Ref.'}},
admin_end: {r: {field:'admin_end', width: 'auto' , dataType: 'datetime',  name:'admin_end'},  w: {field:'admin_end', editable: 'true', dataType: 'datetime', name:'admin_end'}},
admin_failed_access_attempts: {r: {field:'admin_failed_access_attempts', width: 'auto' , name:'admin_failed_access_attempts'},  w: {field:'admin_failed_access_attempts', editable: 'true', name:'admin_failed_access_attempts'}},
admin_ip: {r: {field:'admin_ip', width: 'auto' , name:'admin_ip'},  w: {field:'admin_ip', editable: 'true', name:'admin_ip'}},
admin_level: {r: {field:'admin_level', width: 'auto' , name:'admin_level'},  w: {field:'admin_level', editable: 'true', name:'admin_level'}},
admin_locked_date: {r: {field:'admin_locked_date', width: 'auto' , dataType: 'datetime',  name:'admin_locked_date'},  w: {field:'admin_locked_date', editable: 'true', dataType: 'datetime', name:'admin_locked_date'}},
admin_pwd: {r: {field:'admin_pwd', width: 'auto' , name:'admin_pwd'},  w: {field:'admin_pwd', editable: 'true', name:'admin_pwd'}},
admin_sessionid: {r: {field:'admin_sessionid', width: 'auto' , name:'admin_sessionid'},  w: {field:'admin_sessionid', editable: 'true', name:'admin_sessionid'}},
admin_start: {r: {field:'admin_start', width: 'auto' , dataType: 'datetime',  name:'admin_start'},  w: {field:'admin_start', editable: 'true', dataType: 'datetime', name:'admin_start'}},
admin_username: {r: {field:'admin_username', width: 'auto' , name:'admin_username'},  w: {field:'admin_username', editable: 'true', name:'admin_username'}},
birthday: {r: {field:'birthday', width: 'auto' , dataType: 'datetime',  name:'Fecha Nacimiento'},  w: {field:'birthday', editable: 'true', dataType: 'datetime', name:'Fecha Nacimiento'}},
enabled: {r: {field:'enabled', width: '50px ', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'Habilitado'},  w: {field:'enabled', width: '50px ', editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'Habilitado'}},
first_name: {r: {field:'first_name', width: 'auto' , name:'Nombre'},  w: {field:'first_name', editable: 'true', name:'Nombre'}},
gender: {r: {field:'gender', width: 'auto' , name:'gender'},  w: {field:'gender', editable: 'true', name:'gender'}},
geox: {r: {field:'geox', width: 'auto' , name:'Latitud'},  w: {field:'geox', editable: 'true', name:'Latitud'}},
geoy: {r: {field:'geoy', width: 'auto' , name:'Longitud'},  w: {field:'geoy', editable: 'true', name:'Longitud'}},
groups: {r: {field:'groups', width: 'auto' , name:'groups'},  w: {field:'groups', editable: 'true', name:'groups'}},
idcontact: {r: {field:'idcontact', width: 'auto' , name:'idcontact'},  w: {field:'idcontact', editable: 'true', name:'idcontact'}},
identification: {r: {field:'identification', width: '10em ', name:'Identificación'},  w: {field:'identification', editable: 'true', name:'Identificación'}},
ididtype: {r: {field:'ididtype', width: 'auto' , name:'ididtype'},  w: {field:'ididtype', editable: 'true', name:'ididtype'}},
is_admin: {r: {field:'is_admin', width: 'auto' , dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'is_admin'},  w: {field:'is_admin', width: 'auto' , editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'is_admin'}},
last_name: {r: {field:'last_name', width: 'auto' , name:'Apellido'},  w: {field:'last_name', editable: 'true', name:'Apellido'}},
note: {r: {field:'note', width: 'auto' , name:'Notas'},  w: {field:'note', editable: 'true', name:'Notas'}},
postal_code: {r: {field:'postal_code', width: 'auto' , name:'Código Postal'},  w: {field:'postal_code', editable: 'true', name:'Código Postal'}},
product_or_service: {r: {field:'product_or_service', width: 'auto' , name:'product_or_service'},  w: {field:'product_or_service', editable: 'true', name:'product_or_service'}},
ts: {r: {field:'ts', width: 'auto' , dataType: 'datetime',  name:'ts'},  w: {field:'ts', editable: 'true', dataType: 'datetime', name:'ts'}}}


});


});