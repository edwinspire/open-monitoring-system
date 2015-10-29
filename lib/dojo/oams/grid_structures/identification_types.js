define("oams/grid_structures/identification_types",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {enabled: {r: {field:'enabled', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'enabled'},  w: {field:'enabled', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'enabled'}},
ididtype: {r: {field:'ididtype', name:'ididtype'},  w: {field:'ididtype', name:'ididtype'}},
name: {r: {field:'name', name:'name'},  w: {field:'name', name:'name'}},
note: {r: {field:'note', name:'note'},  w: {field:'note', name:'note'}},
ts: {r: {field:'ts', dataType: 'datetime',  name:'ts'},  w: {field:'ts', dataType: 'datetime', name:'ts'}}}


});


});