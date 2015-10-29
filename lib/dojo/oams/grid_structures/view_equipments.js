define("oams/grid_structures/view_equipments",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {account: {r: {field:'account', name:'account'},  w: {field:'account', name:'account'}},
account_name: {r: {field:'account_name', name:'account_name'},  w: {field:'account_name', name:'account_name'}},
agreement_code_provider: {r: {field:'agreement_code_provider', name:'agreement_code_provider'},  w: {field:'agreement_code_provider', name:'agreement_code_provider'}},
code_ref: {r: {field:'code_ref', name:'code_ref'},  w: {field:'code_ref', name:'code_ref'}},
description: {r: {field:'description', name:'description'},  w: {field:'description', name:'description'}},
enabled: {r: {field:'enabled', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'enabled'},  w: {field:'enabled', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'enabled'}},
equipment: {r: {field:'equipment', name:'equipment'},  w: {field:'equipment', name:'equipment'}},
idaccountstate: {r: {field:'idaccountstate', name:'idaccountstate'},  w: {field:'idaccountstate', name:'idaccountstate'}},
idaccounttype: {r: {field:'idaccounttype', name:'idaccounttype'},  w: {field:'idaccounttype', name:'idaccounttype'}},
idcontact: {r: {field:'idcontact', name:'idcontact'},  w: {field:'idcontact', name:'idcontact'}},
identification: {r: {field:'identification', name:'identification'},  w: {field:'identification', name:'identification'}},
idequipment: {r: {field:'idequipment', name:'idequipment'},  w: {field:'idequipment', name:'idequipment'}},
idprovider: {r: {field:'idprovider', name:'idprovider'},  w: {field:'idprovider', name:'idprovider'}},
installation_date: {r: {field:'installation_date', dataType: 'datetime',  name:'installation_date'},  w: {field:'installation_date', dataType: 'datetime', name:'installation_date'}},
mark: {r: {field:'mark', name:'mark'},  w: {field:'mark', name:'mark'}},
model: {r: {field:'model', name:'model'},  w: {field:'model', name:'model'}},
note: {r: {field:'note', name:'note'},  w: {field:'note', name:'note'}},
oams_assigned: {r: {field:'oams_assigned', name:'oams_assigned'},  w: {field:'oams_assigned', name:'oams_assigned'}},
operability: {r: {field:'operability', name:'operability'},  w: {field:'operability', name:'operability'}},
serial_number: {r: {field:'serial_number', name:'serial_number'},  w: {field:'serial_number', name:'serial_number'}},
uninstall_date: {r: {field:'uninstall_date', dataType: 'datetime',  name:'uninstall_date'},  w: {field:'uninstall_date', dataType: 'datetime', name:'uninstall_date'}}}


});


});