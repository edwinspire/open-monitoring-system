define("oams/grid_structures/notification_area",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {body: {r: {field:'body', width: 'auto' , name:'body'},  w: {field:'body', editable: 'true', name:'body'}},
closable: {r: {field:'closable', width: 'auto' , dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'closable'},  w: {field:'closable', width: 'auto' , editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'closable'}},
idnotify: {r: {field:'idnotify', width: 'auto' , name:'idnotify'},  w: {field:'idnotify', editable: 'true', name:'idnotify'}},
img: {r: {field:'img', width: 'auto' , name:'img'},  w: {field:'img', editable: 'true', name:'img'}},
sessionid: {r: {field:'sessionid', width: 'auto' , name:'sessionid'},  w: {field:'sessionid', editable: 'true', name:'sessionid'}},
snd: {r: {field:'snd', width: 'auto' , name:'snd'},  w: {field:'snd', editable: 'true', name:'snd'}},
timeout: {r: {field:'timeout', width: 'auto' , name:'timeout'},  w: {field:'timeout', editable: 'true', name:'timeout'}},
title: {r: {field:'title', width: 'auto' , name:'title'},  w: {field:'title', editable: 'true', name:'title'}},
ts: {r: {field:'ts', width: 'auto' , dataType: 'datetime',  name:'ts'},  w: {field:'ts', editable: 'true', dataType: 'datetime', name:'ts'}},
urgency: {r: {field:'urgency', width: 'auto' , name:'urgency'},  w: {field:'urgency', editable: 'true', name:'urgency'}}}


});


});