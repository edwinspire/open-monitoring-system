define("oams/grid_structures/view_account_contacts",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {account: {r: {field:'account', name:'account'},  w: {field:'account', name:'account'}},
account_name: {r: {field:'account_name', name:'account_name'},  w: {field:'account_name', name:'account_name'}},
appointment: {r: {field:'appointment', name:'appointment'},  w: {field:'appointment', name:'appointment'}},
birthday: {r: {field:'birthday', dataType: 'datetime',  name:'birthday'},  w: {field:'birthday', dataType: 'datetime', name:'birthday'}},
contact_name: {r: {field:'contact_name', name:'contact_name'},  w: {field:'contact_name', name:'contact_name'}},
first_name: {r: {field:'first_name', name:'first_name'},  w: {field:'first_name', name:'first_name'}},
idaccount: {r: {field:'idaccount', name:'idaccount'},  w: {field:'idaccount', name:'idaccount'}},
idaccountuser: {r: {field:'idaccountuser', name:'idaccountuser'},  w: {field:'idaccountuser', name:'idaccountuser'}},
idcontact: {r: {field:'idcontact', name:'idcontact'},  w: {field:'idcontact', name:'idcontact'}},
identification: {r: {field:'identification', name:'identification'},  w: {field:'identification', name:'identification'}},
last_name: {r: {field:'last_name', name:'last_name'},  w: {field:'last_name', name:'last_name'}},
note: {r: {field:'note', name:'note'},  w: {field:'note', name:'note'}},
priority: {r: {field:'priority', name:'priority'},  w: {field:'priority', name:'priority'}},
ts: {r: {field:'ts', dataType: 'datetime',  name:'ts'},  w: {field:'ts', dataType: 'datetime', name:'ts'}}}


});


});