define("oams/grid_structures/phones",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {enabled: {r: {field:'enabled', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'enabled'},  w: {field:'enabled', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'enabled'}},
ext: {r: {field:'ext', name:'ext'},  w: {field:'ext', name:'ext'}},
idcontact: {r: {field:'idcontact', name:'idcontact'},  w: {field:'idcontact', name:'idcontact'}},
idphone: {r: {field:'idphone', name:'idphone'},  w: {field:'idphone', name:'idphone'}},
idphonetype: {r: {field:'idphonetype', name:'idphonetype'},  w: {field:'idphonetype', name:'idphonetype'}},
idprovider: {r: {field:'idprovider', name:'idprovider'},  w: {field:'idprovider', name:'idprovider'}},
note: {r: {field:'note', name:'note'},  w: {field:'note', name:'note'}},
number: {r: {field:'number', name:'number'},  w: {field:'number', name:'number'}},
ts: {r: {field:'ts', dataType: 'datetime',  name:'ts'},  w: {field:'ts', dataType: 'datetime', name:'ts'}}}


});


});