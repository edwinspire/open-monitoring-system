define("oams/grid_structures/account_users",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {account_pwd: {r: {field:'account_pwd', width: 'auto' , name:'account_pwd'},  w: {field:'account_pwd', editable: 'true', name:'account_pwd'}},
account_user: {r: {field:'account_user', width: 'auto' , name:'account_user'},  w: {field:'account_user', editable: 'true', name:'account_user'}},
appointment: {r: {field:'appointment', width: 'auto' , name:'Cargo'},  w: {field:'appointment', editable: 'true', name:'Cargo'}},
date_end: {r: {field:'date_end', width: 'auto' , dataType: 'datetime',  name:'date_end'},  w: {field:'date_end', editable: 'true', dataType: 'datetime', name:'date_end'}},
date_start: {r: {field:'date_start', width: 'auto' , dataType: 'datetime',  name:'date_start'},  w: {field:'date_start', editable: 'true', dataType: 'datetime', name:'date_start'}},
enabled: {r: {field:'enabled', width: '50px ', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'Habilitado'},  w: {field:'enabled', width: '50px ', editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'Habilitado'}},
idaccount: {r: {field:'idaccount', width: 'auto' , name:'idaccount'},  w: {field:'idaccount', editable: 'true', name:'idaccount'}},
idaccountuser: {r: {field:'idaccountuser', width: 'auto' , name:'idaccountuser'},  w: {field:'idaccountuser', editable: 'true', name:'idaccountuser'}},
idcontact: {r: {field:'idcontact', width: 'auto' , name:'idcontact'},  w: {field:'idcontact', editable: 'true', name:'idcontact'}},
note: {r: {field:'note', width: 'auto' , name:'Notas'},  w: {field:'note', editable: 'true', name:'Notas'}},
priority: {r: {field:'priority', width: 'auto' , name:'Prioridad'},  w: {field:'priority', editable: 'true', name:'Prioridad'}},
ts: {r: {field:'ts', width: 'auto' , dataType: 'datetime',  name:'ts'},  w: {field:'ts', editable: 'true', dataType: 'datetime', name:'ts'}},
user: {r: {field:'user', width: 'auto' , name:'Usuario'},  w: {field:'user', editable: 'true', name:'Usuario'}}}


});


});