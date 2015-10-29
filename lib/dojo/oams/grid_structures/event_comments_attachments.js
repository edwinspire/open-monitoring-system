define("oams/grid_structures/event_comments_attachments",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {idattachment: {r: {field:'idattachment', width: 'auto' , name:'idattachment'},  w: {field:'idattachment', editable: 'true', name:'idattachment'}},
idevent: {r: {field:'idevent', width: 'auto' , name:'idevent'},  w: {field:'idevent', editable: 'true', name:'idevent'}},
ideventcommentattach: {r: {field:'ideventcommentattach', width: 'auto' , name:'ideventcommentattach'},  w: {field:'ideventcommentattach', editable: 'true', name:'ideventcommentattach'}},
ts: {r: {field:'ts', width: 'auto' , dataType: 'datetime',  name:'ts'},  w: {field:'ts', editable: 'true', dataType: 'datetime', name:'ts'}}}


});


});