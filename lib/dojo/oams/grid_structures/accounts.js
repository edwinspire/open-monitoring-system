define("oams/grid_structures/accounts",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {account: {r: {field:'account', name:'Oficina'},  w: {field:'account', name:'Oficina'}},
address: {r: {field:'address', name:'Direccion'},  w: {field:'address', name:'Direccion'}},
address_ref: {r: {field:'address_ref', name:'address_ref'},  w: {field:'address_ref', name:'address_ref'}},
admin_end: {r: {field:'admin_end', dataType: 'datetime',  name:'admin_end'},  w: {field:'admin_end', dataType: 'datetime', name:'admin_end'}},
admin_failed_access_attempts: {r: {field:'admin_failed_access_attempts', name:'admin_failed_access_attempts'},  w: {field:'admin_failed_access_attempts', name:'admin_failed_access_attempts'}},
admin_ip: {r: {field:'admin_ip', name:'admin_ip'},  w: {field:'admin_ip', name:'admin_ip'}},
admin_level: {r: {field:'admin_level', name:'admin_level'},  w: {field:'admin_level', name:'admin_level'}},
admin_locked_date: {r: {field:'admin_locked_date', dataType: 'datetime',  name:'admin_locked_date'},  w: {field:'admin_locked_date', dataType: 'datetime', name:'admin_locked_date'}},
admin_pwd: {r: {field:'admin_pwd', name:'admin_pwd'},  w: {field:'admin_pwd', name:'admin_pwd'}},
admin_sessionid: {r: {field:'admin_sessionid', name:'admin_sessionid'},  w: {field:'admin_sessionid', name:'admin_sessionid'}},
admin_start: {r: {field:'admin_start', dataType: 'datetime',  name:'admin_start'},  w: {field:'admin_start', dataType: 'datetime', name:'admin_start'}},
admin_username: {r: {field:'admin_username', name:'admin_username'},  w: {field:'admin_username', name:'admin_username'}},
birthday: {r: {field:'birthday', dataType: 'datetime',  name:'Fecha Nacimiento'},  w: {field:'birthday', dataType: 'datetime', name:'Fecha Nacimiento'}},
enabled: {r: {field:'enabled', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'Habilitado'},  w: {field:'enabled', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'Habilitado'}},
end_date: {r: {field:'end_date', dataType: 'datetime',  name:'end_date'},  w: {field:'end_date', dataType: 'datetime', name:'end_date'}},
first_name: {r: {field:'first_name', name:'Nombre'},  w: {field:'first_name', name:'Nombre'}},
gender: {r: {field:'gender', name:'Genero'},  w: {field:'gender', name:'Genero'}},
geox: {r: {field:'geox', name:'Latitud'},  w: {field:'geox', name:'Latitud'}},
geoy: {r: {field:'geoy', name:'Longitud'},  w: {field:'geoy', name:'Longitud'}},
groups: {r: {field:'groups', name:'groups'},  w: {field:'groups', name:'groups'}},
idaccountstate: {r: {field:'idaccountstate', name:'idaccountstate'},  w: {field:'idaccountstate', name:'idaccountstate'}},
idaccounttype: {r: {field:'idaccounttype', name:'idaccounttype'},  w: {field:'idaccounttype', name:'idaccounttype'}},
idcontact: {r: {field:'idcontact', name:'idcontact'},  w: {field:'idcontact', name:'idcontact'}},
identification: {r: {field:'identification', name:'identification'},  w: {field:'identification', name:'identification'}},
ididtype: {r: {field:'ididtype', name:'ididtype'},  w: {field:'ididtype', name:'ididtype'}},
is_admin: {r: {field:'is_admin', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'is_admin'},  w: {field:'is_admin', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'is_admin'}},
last_name: {r: {field:'last_name', name:'Apellido'},  w: {field:'last_name', name:'Apellido'}},
note: {r: {field:'note', name:'Notas'},  w: {field:'note', name:'Notas'}},
postal_code: {r: {field:'postal_code', name:'Codigo Postal'},  w: {field:'postal_code', name:'Codigo Postal'}},
start_date: {r: {field:'start_date', dataType: 'datetime',  name:'Fecha Inicio'},  w: {field:'start_date', dataType: 'datetime', name:'Fecha Inicio'}},
ts: {r: {field:'ts', dataType: 'datetime',  name:'ts'},  w: {field:'ts', dataType: 'datetime', name:'ts'}}}


});


});