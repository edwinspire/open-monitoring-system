define("oams/grid_structures/account_users",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {account_pwd: {r: {field:'account_pwd', name:'account_pwd'},  w: {field:'account_pwd', name:'account_pwd'}},
account_user: {r: {field:'account_user', name:'account_user'},  w: {field:'account_user', name:'account_user'}},
appointment: {r: {field:'appointment', name:'appointment'},  w: {field:'appointment', name:'appointment'}},
date_end: {r: {field:'date_end', dataType: 'datetime',  name:'date_end'},  w: {field:'date_end', dataType: 'datetime', name:'date_end'}},
date_start: {r: {field:'date_start', dataType: 'datetime',  name:'date_start'},  w: {field:'date_start', dataType: 'datetime', name:'date_start'}},
enabled: {r: {field:'enabled', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'enabled'},  w: {field:'enabled', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'enabled'}},
idaccount: {r: {field:'idaccount', name:'idaccount'},  w: {field:'idaccount', name:'idaccount'}},
idaccountuser: {r: {field:'idaccountuser', name:'idaccountuser'},  w: {field:'idaccountuser', name:'idaccountuser'}},
idcontact: {r: {field:'idcontact', name:'idcontact'},  w: {field:'idcontact', name:'idcontact'}},
note: {r: {field:'note', name:'note'},  w: {field:'note', name:'note'}},
priority: {r: {field:'priority', name:'priority'},  w: {field:'priority', name:'priority'}},
ts: {r: {field:'ts', dataType: 'datetime',  name:'ts'},  w: {field:'ts', dataType: 'datetime', name:'ts'}},
user: {r: {field:'user', name:'user'},  w: {field:'user', name:'user'}}}


});


});