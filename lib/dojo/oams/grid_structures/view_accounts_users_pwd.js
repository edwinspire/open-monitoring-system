define("oams/grid_structures/view_accounts_users_pwd",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {account: {r: {field:'account', name:'account'},  w: {field:'account', name:'account'}},
account_pwd: {r: {field:'account_pwd', name:'account_pwd'},  w: {field:'account_pwd', name:'account_pwd'}},
account_user: {r: {field:'account_user', name:'account_user'},  w: {field:'account_user', name:'account_user'}},
appointment: {r: {field:'appointment', name:'appointment'},  w: {field:'appointment', name:'appointment'}},
enabled_account: {r: {field:'enabled_account', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'enabled_account'},  w: {field:'enabled_account', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'enabled_account'}},
enabled_user: {r: {field:'enabled_user', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'enabled_user'},  w: {field:'enabled_user', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'enabled_user'}},
first_name: {r: {field:'first_name', name:'first_name'},  w: {field:'first_name', name:'first_name'}},
idaccount: {r: {field:'idaccount', name:'idaccount'},  w: {field:'idaccount', name:'idaccount'}},
idcontact: {r: {field:'idcontact', name:'idcontact'},  w: {field:'idcontact', name:'idcontact'}},
identification: {r: {field:'identification', name:'identification'},  w: {field:'identification', name:'identification'}},
last_name: {r: {field:'last_name', name:'last_name'},  w: {field:'last_name', name:'last_name'}}}


});


});