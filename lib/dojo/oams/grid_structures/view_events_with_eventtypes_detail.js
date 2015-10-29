define("oams/grid_structures/view_events_with_eventtypes_detail",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {auto_close_on_event_defined: {r: {field:'auto_close_on_event_defined', name:'auto_close_on_event_defined'},  w: {field:'auto_close_on_event_defined', name:'auto_close_on_event_defined'}},
dateevent: {r: {field:'dateevent', dataType: 'datetime',  name:'dateevent'},  w: {field:'dateevent', dataType: 'datetime', name:'dateevent'}},
enable_auto_close_on_event_defined: {r: {field:'enable_auto_close_on_event_defined', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'enable_auto_close_on_event_defined'},  w: {field:'enable_auto_close_on_event_defined', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'enable_auto_close_on_event_defined'}},
idaccount: {r: {field:'idaccount', name:'idaccount'},  w: {field:'idaccount', name:'idaccount'}},
idevent: {r: {field:'idevent', name:'idevent'},  w: {field:'idevent', name:'idevent'}},
ideventtype: {r: {field:'ideventtype', name:'ideventtype'},  w: {field:'ideventtype', name:'ideventtype'}},
status: {r: {field:'status', name:'status'},  w: {field:'status', name:'status'}},
zu: {r: {field:'zu', name:'zu'},  w: {field:'zu', name:'zu'}}}


});


});