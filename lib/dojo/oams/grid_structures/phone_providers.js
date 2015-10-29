define("oams/grid_structures/phone_providers",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {enable: {r: {field:'enable', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'enable'},  w: {field:'enable', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'enable'}},
idprovider: {r: {field:'idprovider', name:'idprovider'},  w: {field:'idprovider', name:'idprovider'}},
provider: {r: {field:'provider', name:'provider'},  w: {field:'provider', name:'provider'}},
ts: {r: {field:'ts', dataType: 'datetime',  name:'ts'},  w: {field:'ts', dataType: 'datetime', name:'ts'}}}


});


});