define("oams/grid_structures/providers",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {address: {r: {field:'address', name:'address'},  w: {field:'address', name:'address'}},
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
birthday: {r: {field:'birthday', dataType: 'datetime',  name:'birthday'},  w: {field:'birthday', dataType: 'datetime', name:'birthday'}},
enabled: {r: {field:'enabled', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'enabled'},  w: {field:'enabled', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'enabled'}},
first_name: {r: {field:'first_name', name:'first_name'},  w: {field:'first_name', name:'first_name'}},
gender: {r: {field:'gender', name:'gender'},  w: {field:'gender', name:'gender'}},
geox: {r: {field:'geox', name:'geox'},  w: {field:'geox', name:'geox'}},
geoy: {r: {field:'geoy', name:'geoy'},  w: {field:'geoy', name:'geoy'}},
groups: {r: {field:'groups', name:'groups'},  w: {field:'groups', name:'groups'}},
idcontact: {r: {field:'idcontact', name:'idcontact'},  w: {field:'idcontact', name:'idcontact'}},
identification: {r: {field:'identification', name:'identification'},  w: {field:'identification', name:'identification'}},
ididtype: {r: {field:'ididtype', name:'ididtype'},  w: {field:'ididtype', name:'ididtype'}},
is_admin: {r: {field:'is_admin', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'is_admin'},  w: {field:'is_admin', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'is_admin'}},
last_name: {r: {field:'last_name', name:'last_name'},  w: {field:'last_name', name:'last_name'}},
note: {r: {field:'note', name:'note'},  w: {field:'note', name:'note'}},
postal_code: {r: {field:'postal_code', name:'postal_code'},  w: {field:'postal_code', name:'postal_code'}},
product_or_service: {r: {field:'product_or_service', name:'product_or_service'},  w: {field:'product_or_service', name:'product_or_service'}},
ts: {r: {field:'ts', dataType: 'datetime',  name:'ts'},  w: {field:'ts', dataType: 'datetime', name:'ts'}}}


});


});