define("oams/grid_structures/view_accounts_oams_assigned",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {account: {r: {field:'account', name:'account'},  w: {field:'account', name:'account'}},
account_name: {r: {field:'account_name', name:'account_name'},  w: {field:'account_name', name:'account_name'}},
address: {r: {field:'address', name:'address'},  w: {field:'address', name:'address'}},
address_ref: {r: {field:'address_ref', name:'address_ref'},  w: {field:'address_ref', name:'address_ref'}},
enabled: {r: {field:'enabled', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'enabled'},  w: {field:'enabled', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'enabled'}},
geolink: {r: {field:'geolink', name:'geolink'},  w: {field:'geolink', name:'geolink'}},
geox: {r: {field:'geox', name:'geox'},  w: {field:'geox', name:'geox'}},
geoy: {r: {field:'geoy', name:'geoy'},  w: {field:'geoy', name:'geoy'}},
idcontact: {r: {field:'idcontact', name:'idcontact'},  w: {field:'idcontact', name:'idcontact'}},
oams_assigned: {r: {field:'oams_assigned', name:'oams_assigned'},  w: {field:'oams_assigned', name:'oams_assigned'}}}


});


});