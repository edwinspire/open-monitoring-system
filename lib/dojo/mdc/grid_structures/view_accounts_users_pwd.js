define("oams/grid_structures/view_accounts_users_pwd",['dojo/_base/declare', 'dojo/Evented', 'dojo/date/locale'],function(_1, _2, _3){

  return _1([_2], {
	structure: {account: {r: {field:'account', width: '5em ', name:'Oficina'},  w: {field:'account', editable: 'true', name:'Oficina'}},
account_pwd: {r: {field:'account_pwd', width: 'auto' , name:'account_pwd'},  w: {field:'account_pwd', editable: 'true', name:'account_pwd'}},
account_user: {r: {field:'account_user', width: 'auto' , name:'account_user'},  w: {field:'account_user', editable: 'true', name:'account_user'}},
appointment: {r: {field:'appointment', width: 'auto' , name:'Cargo'},  w: {field:'appointment', editable: 'true', name:'Cargo'}},
enabled_account: {r: {field:'enabled_account', width: 'auto' , dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"'}, alwaysEditing: true,  name:'enabled_account'},  w: {field:'enabled_account', width: 'auto' , editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true'}, alwaysEditing: true, name:'enabled_account'}},
enabled_user: {r: {field:'enabled_user', width: 'auto' , dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"'}, alwaysEditing: true,  name:'enabled_user'},  w: {field:'enabled_user', width: 'auto' , editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true'}, alwaysEditing: true, name:'enabled_user'}},
first_name: {r: {field:'first_name', width: 'auto' , name:'Nombre'},  w: {field:'first_name', editable: 'true', name:'Nombre'}},
idaccount: {r: {field:'idaccount', width: 'auto' , name:'idaccount'},  w: {field:'idaccount', editable: 'true', name:'idaccount'}},
idcontact: {r: {field:'idcontact', width: 'auto' , name:'idcontact'},  w: {field:'idcontact', editable: 'true', name:'idcontact'}},
identification: {r: {field:'identification', width: '10em ', name:'Identificación'},  w: {field:'identification', editable: 'true', name:'Identificación'}},
last_name: {r: {field:'last_name', width: 'auto' , name:'Apellido'},  w: {field:'last_name', editable: 'true', name:'Apellido'}}}


});


});