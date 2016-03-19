define("oams/grid_structures/interface_words",['dojo/_base/declare', 'dojo/Evented', 'dojo/date/locale'],function(_1, _2, _3){

  return _1([_2], {
	structure: {idword: {r: {field:'idword', width: 'auto' , name:'idword'},  w: {field:'idword', editable: 'true', name:'idword'}},
notes: {r: {field:'notes', width: 'auto' , name:'notes'},  w: {field:'notes', editable: 'true', name:'notes'}},
traslation: {r: {field:'traslation', width: 'auto' , name:'traslation'},  w: {field:'traslation', editable: 'true', name:'traslation'}},
ts: {r: {field:'ts', width: 'auto' , dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'ts'},  w: {field:'ts', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'ts'}},
word: {r: {field:'word', width: 'auto' , name:'word'},  w: {field:'word', editable: 'true', name:'word'}}}


});


});