define("oams/grid_structures/attachments",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {file: {r: {field:'file', width: 'auto' , name:'Archivo'},  w: {field:'file', editable: 'true', name:'Archivo'}},
idattachment: {r: {field:'idattachment', width: 'auto' , name:'idattachment'},  w: {field:'idattachment', editable: 'true', name:'idattachment'}},
md5: {r: {field:'md5', width: 'auto' , name:'md5'},  w: {field:'md5', editable: 'true', name:'md5'}},
ts: {r: {field:'ts', width: 'auto' , dataType: 'datetime',  name:'ts'},  w: {field:'ts', editable: 'true', dataType: 'datetime', name:'ts'}}}


});


});