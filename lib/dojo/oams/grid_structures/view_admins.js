define("oams/grid_structures/view_admins",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {address: {r: {field:'address', width: 'auto' , name:'Dirección'},  w: {field:'address', editable: 'true', name:'Dirección'}},
address_ref: {r: {field:'address_ref', width: 'auto' , name:'Dirección - Ref.'},  w: {field:'address_ref', editable: 'true', name:'Dirección - Ref.'}},
admin_end: {r: {field:'admin_end', width: 'auto' , dataType: 'datetime',  name:'admin_end'},  w: {field:'admin_end', editable: 'true', dataType: 'datetime', name:'admin_end'}},
admin_ip: {r: {field:'admin_ip', width: 'auto' , name:'admin_ip'},  w: {field:'admin_ip', editable: 'true', name:'admin_ip'}},
admin_level: {r: {field:'admin_level', width: 'auto' , name:'admin_level'},  w: {field:'admin_level', editable: 'true', name:'admin_level'}},
admin_name: {r: {field:'admin_name', width: 'auto' , name:'Administrador'},  w: {field:'admin_name', editable: 'true', name:'Administrador'}},
admin_pwd: {r: {field:'admin_pwd', width: 'auto' , name:'admin_pwd'},  w: {field:'admin_pwd', editable: 'true', name:'admin_pwd'}},
admin_sessionid: {r: {field:'admin_sessionid', width: 'auto' , name:'admin_sessionid'},  w: {field:'admin_sessionid', editable: 'true', name:'admin_sessionid'}},
admin_start: {r: {field:'admin_start', width: 'auto' , dataType: 'datetime',  name:'admin_start'},  w: {field:'admin_start', editable: 'true', dataType: 'datetime', name:'admin_start'}},
admin_username: {r: {field:'admin_username', width: 'auto' , name:'admin_username'},  w: {field:'admin_username', editable: 'true', name:'admin_username'}},
birthday: {r: {field:'birthday', width: 'auto' , dataType: 'datetime',  name:'Fecha Nacimiento'},  w: {field:'birthday', editable: 'true', dataType: 'datetime', name:'Fecha Nacimiento'}},
enabled: {r: {field:'enabled', width: '50px ', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'Habilitado'},  w: {field:'enabled', width: '50px ', editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'Habilitado'}},
gender: {r: {field:'gender', width: 'auto' , name:'gender'},  w: {field:'gender', editable: 'true', name:'gender'}},
geox: {r: {field:'geox', width: 'auto' , name:'Latitud'},  w: {field:'geox', editable: 'true', name:'Latitud'}},
geoy: {r: {field:'geoy', width: 'auto' , name:'Longitud'},  w: {field:'geoy', editable: 'true', name:'Longitud'}},
groups: {r: {field:'groups', width: 'auto' , name:'groups'},  w: {field:'groups', editable: 'true', name:'groups'}},
idcontact: {r: {field:'idcontact', width: 'auto' , name:'idcontact'},  w: {field:'idcontact', editable: 'true', name:'idcontact'}},
identification: {r: {field:'identification', width: '10em ', name:'Identificación'},  w: {field:'identification', editable: 'true', name:'Identificación'}},
ididtype: {r: {field:'ididtype', width: 'auto' , name:'ididtype'},  w: {field:'ididtype', editable: 'true', name:'ididtype'}},
is_admin: {r: {field:'is_admin', width: 'auto' , dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'is_admin'},  w: {field:'is_admin', width: 'auto' , editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'is_admin'}},
note: {r: {field:'note', width: 'auto' , name:'Notas'},  w: {field:'note', editable: 'true', name:'Notas'}},
postal_code: {r: {field:'postal_code', width: 'auto' , name:'Código Postal'},  w: {field:'postal_code', editable: 'true', name:'Código Postal'}}}


});


});