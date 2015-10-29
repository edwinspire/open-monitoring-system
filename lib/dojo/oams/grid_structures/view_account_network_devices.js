define("oams/grid_structures/view_account_network_devices",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {account: {r: {field:'account', name:'account'},  w: {field:'account', name:'account'}},
code_ref: {r: {field:'code_ref', name:'code_ref'},  w: {field:'code_ref', name:'code_ref'}},
description: {r: {field:'description', name:'description'},  w: {field:'description', name:'description'}},
enabled: {r: {field:'enabled', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'enabled'},  w: {field:'enabled', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'enabled'}},
equipment: {r: {field:'equipment', name:'equipment'},  w: {field:'equipment', name:'equipment'}},
first_name: {r: {field:'first_name', name:'first_name'},  w: {field:'first_name', name:'first_name'}},
geox: {r: {field:'geox', name:'geox'},  w: {field:'geox', name:'geox'}},
geoy: {r: {field:'geoy', name:'geoy'},  w: {field:'geoy', name:'geoy'}},
idaccountstate: {r: {field:'idaccountstate', name:'idaccountstate'},  w: {field:'idaccountstate', name:'idaccountstate'}},
idaccounttype: {r: {field:'idaccounttype', name:'idaccounttype'},  w: {field:'idaccounttype', name:'idaccounttype'}},
idcontact: {r: {field:'idcontact', name:'idcontact'},  w: {field:'idcontact', name:'idcontact'}},
identification: {r: {field:'identification', name:'identification'},  w: {field:'identification', name:'identification'}},
ip: {r: {field:'ip', name:'ip'},  w: {field:'ip', name:'ip'}},
last_name: {r: {field:'last_name', name:'last_name'},  w: {field:'last_name', name:'last_name'}},
mac: {r: {field:'mac', name:'mac'},  w: {field:'mac', name:'mac'}},
mark: {r: {field:'mark', name:'mark'},  w: {field:'mark', name:'mark'}},
model: {r: {field:'model', name:'model'},  w: {field:'model', name:'model'}},
port: {r: {field:'port', name:'port'},  w: {field:'port', name:'port'}},
pwd: {r: {field:'pwd', name:'pwd'},  w: {field:'pwd', name:'pwd'}},
serial_number: {r: {field:'serial_number', name:'serial_number'},  w: {field:'serial_number', name:'serial_number'}},
username: {r: {field:'username', name:'username'},  w: {field:'username', name:'username'}}}


});


});