define("oams/grid_structures/view_events_with_eventtypes_detail",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {auto_close_on_event_defined: {r: {field:'auto_close_on_event_defined', width: 'auto' , name:'auto_close_on_event_defined'},  w: {field:'auto_close_on_event_defined', editable: 'true', name:'auto_close_on_event_defined'}},
dateevent: {r: {field:'dateevent', width: 'auto' , dataType: 'datetime',  name:'dateevent'},  w: {field:'dateevent', editable: 'true', dataType: 'datetime', name:'dateevent'}},
enable_auto_close_on_event_defined: {r: {field:'enable_auto_close_on_event_defined', width: 'auto' , dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'enable_auto_close_on_event_defined'},  w: {field:'enable_auto_close_on_event_defined', width: 'auto' , editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'enable_auto_close_on_event_defined'}},
idaccount: {r: {field:'idaccount', width: 'auto' , name:'idaccount'},  w: {field:'idaccount', editable: 'true', name:'idaccount'}},
idevent: {r: {field:'idevent', width: 'auto' , name:'idevent'},  w: {field:'idevent', editable: 'true', name:'idevent'}},
ideventtype: {r: {field:'ideventtype', width: 'auto' , name:'ideventtype'},  w: {field:'ideventtype', editable: 'true', name:'ideventtype'}},
status: {r: {field:'status', width: 'auto' , name:'Estado'},  w: {field:'status', editable: 'true', name:'Estado'}},
zu: {r: {field:'zu', width: 'auto' , name:'IDZ'},  w: {field:'zu', editable: 'true', name:'IDZ'}}}


});


});