define("oams/grid_structures/view_account_users",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {account: {r: {field:'account', name:'account'},  w: {field:'account', name:'account'}},
account_identification: {r: {field:'account_identification', name:'account_identification'},  w: {field:'account_identification', name:'account_identification'}},
account_name: {r: {field:'account_name', name:'account_name'},  w: {field:'account_name', name:'account_name'}},
account_pwd: {r: {field:'account_pwd', name:'account_pwd'},  w: {field:'account_pwd', name:'account_pwd'}},
account_user: {r: {field:'account_user', name:'account_user'},  w: {field:'account_user', name:'account_user'}},
appointment: {r: {field:'appointment', name:'appointment'},  w: {field:'appointment', name:'appointment'}},
enabled: {r: {field:'enabled', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'enabled'},  w: {field:'enabled', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'enabled'}},
idaccount: {r: {field:'idaccount', name:'idaccount'},  w: {field:'idaccount', name:'idaccount'}},
idaccountuser: {r: {field:'idaccountuser', name:'idaccountuser'},  w: {field:'idaccountuser', name:'idaccountuser'}},
idcontact: {r: {field:'idcontact', name:'idcontact'},  w: {field:'idcontact', name:'idcontact'}},
identification: {r: {field:'identification', name:'identification'},  w: {field:'identification', name:'identification'}},
priority: {r: {field:'priority', name:'priority'},  w: {field:'priority', name:'priority'}},
user_name: {r: {field:'user_name', name:'user_name'},  w: {field:'user_name', name:'user_name'}}}


});


});