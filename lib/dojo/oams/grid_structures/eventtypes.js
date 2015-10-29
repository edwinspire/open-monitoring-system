define("oams/grid_structures/eventtypes",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {autoclose_if_there_is_an_equal_even_noclosed_event: {r: {field:'autoclose_if_there_is_an_equal_even_noclosed_event', name:'autoclose_if_there_is_an_equal_even_noclosed_event'},  w: {field:'autoclose_if_there_is_an_equal_even_noclosed_event', name:'autoclose_if_there_is_an_equal_even_noclosed_event'}},
auto_close_on_event_defined: {r: {field:'auto_close_on_event_defined', name:'auto_close_on_event_defined'},  w: {field:'auto_close_on_event_defined', name:'auto_close_on_event_defined'}},
code: {r: {field:'code', name:'code'},  w: {field:'code', name:'code'}},
date_editable: {r: {field:'date_editable', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'date_editable'},  w: {field:'date_editable', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'date_editable'}},
enable_auto_close_on_event_defined: {r: {field:'enable_auto_close_on_event_defined', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'enable_auto_close_on_event_defined'},  w: {field:'enable_auto_close_on_event_defined', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'enable_auto_close_on_event_defined'}},
expiration: {r: {field:'expiration', name:'expiration'},  w: {field:'expiration', name:'expiration'}},
ideventtype: {r: {field:'ideventtype', name:'ideventtype'},  w: {field:'ideventtype', name:'ideventtype'}},
label: {r: {field:'label', name:'label'},  w: {field:'label', name:'label'}},
manual: {r: {field:'manual', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'manual'},  w: {field:'manual', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'manual'}},
name: {r: {field:'name', name:'name'},  w: {field:'name', name:'name'}},
note: {r: {field:'note', name:'note'},  w: {field:'note', name:'note'}},
notify_all_users: {r: {field:'notify_all_users', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'notify_all_users'},  w: {field:'notify_all_users', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'notify_all_users'}},
notify_closable: {r: {field:'notify_closable', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'notify_closable'},  w: {field:'notify_closable', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'notify_closable'}},
notify_img: {r: {field:'notify_img', name:'notify_img'},  w: {field:'notify_img', name:'notify_img'}},
notify_snd: {r: {field:'notify_snd', name:'notify_snd'},  w: {field:'notify_snd', name:'notify_snd'}},
notify_timeout: {r: {field:'notify_timeout', name:'notify_timeout'},  w: {field:'notify_timeout', name:'notify_timeout'}},
priority: {r: {field:'priority', name:'priority'},  w: {field:'priority', name:'priority'}},
treatment: {r: {field:'treatment', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'treatment'},  w: {field:'treatment', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'treatment'}},
ts: {r: {field:'ts', dataType: 'datetime',  name:'ts'},  w: {field:'ts', dataType: 'datetime', name:'ts'}}}


});


});