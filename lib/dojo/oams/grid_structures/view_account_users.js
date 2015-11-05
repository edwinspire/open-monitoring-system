define("oams/grid_structures/view_account_users",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {account: {r: {field:'account', width: '5em ', name:'Oficina'},  w: {field:'account', editable: 'true', name:'Oficina'}},
account_identification: {r: {field:'account_identification', width: 'auto' , name:'Oficina'},  w: {field:'account_identification', editable: 'true', name:'Oficina'}},
account_name: {r: {field:'account_name', width: 'auto' , name:'Farmacia'},  w: {field:'account_name', editable: 'true', name:'Farmacia'}},
account_pwd: {r: {field:'account_pwd', width: 'auto' , name:'account_pwd'},  w: {field:'account_pwd', editable: 'true', name:'account_pwd'}},
account_user: {r: {field:'account_user', width: 'auto' , name:'account_user'},  w: {field:'account_user', editable: 'true', name:'account_user'}},
appointment: {r: {field:'appointment', width: 'auto' , name:'Cargo'},  w: {field:'appointment', editable: 'true', name:'Cargo'}},
enabled: {r: {field:'enabled', width: '50px ', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"'}, alwaysEditing: true,  name:'Habilitado'},  w: {field:'enabled', width: '50px ', editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true'}, alwaysEditing: true, name:'Habilitado'}},
idaccount: {r: {field:'idaccount', width: 'auto' , name:'idaccount'},  w: {field:'idaccount', editable: 'true', name:'idaccount'}},
idaccountuser: {r: {field:'idaccountuser', width: 'auto' , name:'idaccountuser'},  w: {field:'idaccountuser', editable: 'true', name:'idaccountuser'}},
idcontact: {r: {field:'idcontact', width: 'auto' , name:'idcontact'},  w: {field:'idcontact', editable: 'true', name:'idcontact'}},
identification: {r: {field:'identification', width: '10em ', name:'Identificación'},  w: {field:'identification', editable: 'true', name:'Identificación'}},
priority: {r: {field:'priority', width: 'auto' , name:'Prioridad'},  w: {field:'priority', editable: 'true', name:'Prioridad'}},
user_name: {r: {field:'user_name', width: 'auto' , name:'user_name'},  w: {field:'user_name', editable: 'true', name:'user_name'}}}


});


});