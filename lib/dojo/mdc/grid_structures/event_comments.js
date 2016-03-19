define("oams/grid_structures/event_comments",['dojo/_base/declare', 'dojo/Evented', 'dojo/date/locale'],function(_1, _2, _3){

  return _1([_2], {
	structure: {comment_event: {r: {field:'comment_event', width: 'auto' , name:'comment_event'},  w: {field:'comment_event', editable: 'true', name:'comment_event'}},
idadmin: {r: {field:'idadmin', width: 'auto' , name:'idadmin'},  w: {field:'idadmin', editable: 'true', name:'idadmin'}},
idevent: {r: {field:'idevent', width: 'auto' , name:'idevent'},  w: {field:'idevent', editable: 'true', name:'idevent'}},
ideventcomment: {r: {field:'ideventcomment', width: 'auto' , name:'ideventcomment'},  w: {field:'ideventcomment', editable: 'true', name:'ideventcomment'}},
seconds: {r: {field:'seconds', width: 'auto' , name:'Segundos'},  w: {field:'seconds', editable: 'true', name:'Segundos'}},
start: {r: {field:'start', width: 'auto' , dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'Inicio'},  w: {field:'start', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'Inicio'}},
status: {r: {field:'status', width: 'auto' , name:'Estado'},  w: {field:'status', editable: 'true', name:'Estado'}},
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
}, name:'ts'}}}


});


});