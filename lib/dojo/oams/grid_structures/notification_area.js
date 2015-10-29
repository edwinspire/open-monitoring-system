define("oams/grid_structures/notification_area",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {body: {r: {field:'body', name:'body'},  w: {field:'body', name:'body'}},
closable: {r: {field:'closable', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'closable'},  w: {field:'closable', width: '50px', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'closable'}},
idnotify: {r: {field:'idnotify', name:'idnotify'},  w: {field:'idnotify', name:'idnotify'}},
img: {r: {field:'img', name:'img'},  w: {field:'img', name:'img'}},
sessionid: {r: {field:'sessionid', name:'sessionid'},  w: {field:'sessionid', name:'sessionid'}},
snd: {r: {field:'snd', name:'snd'},  w: {field:'snd', name:'snd'}},
timeout: {r: {field:'timeout', name:'timeout'},  w: {field:'timeout', name:'timeout'}},
title: {r: {field:'title', name:'title'},  w: {field:'title', name:'title'}},
ts: {r: {field:'ts', dataType: 'datetime',  name:'ts'},  w: {field:'ts', dataType: 'datetime', name:'ts'}},
urgency: {r: {field:'urgency', name:'urgency'},  w: {field:'urgency', name:'urgency'}}}


});


});