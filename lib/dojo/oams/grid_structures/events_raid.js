define("oams/grid_structures/events_raid",['dojo/_base/declare', 'dojo/Evented', 'dojo/date/locale'],function(_1, _2, _3){

  return _1([_2], {
	structure: {account: {r: {field:'account', width: 'auto' , name:'account'},  w: {field:'account', editable: 'true', name:'account'}},
code: {r: {field:'code', width: 'auto' , name:'code'},  w: {field:'code', editable: 'true', name:'code'}},
dateevent: {r: {field:'dateevent', width: 'auto' , dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'dateevent'},  w: {field:'dateevent', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'dateevent'}},
description: {r: {field:'description', width: 'auto' , name:'description'},  w: {field:'description', editable: 'true', name:'description'}},
hostname: {r: {field:'hostname', width: 'auto' , name:'hostname'},  w: {field:'hostname', editable: 'true', name:'hostname'}},
idaccount: {r: {field:'idaccount', width: 'auto' , name:'idaccount'},  w: {field:'idaccount', editable: 'true', name:'idaccount'}},
idadmin: {r: {field:'idadmin', width: 'auto' , name:'idadmin'},  w: {field:'idadmin', editable: 'true', name:'idadmin'}},
idequipment: {r: {field:'idequipment', width: 'auto' , name:'idequipment'},  w: {field:'idequipment', editable: 'true', name:'idequipment'}},
idevent: {r: {field:'idevent', width: 'auto' , name:'idevent'},  w: {field:'idevent', editable: 'true', name:'idevent'}},
ideventtype: {r: {field:'ideventtype', width: 'auto' , name:'ideventtype'},  w: {field:'ideventtype', editable: 'true', name:'ideventtype'}},
last_comment: {r: {field:'last_comment', width: 'auto' , dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'last_comment'},  w: {field:'last_comment', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'last_comment'}},
line_file: {r: {field:'line_file', width: 'auto' , name:'line_file'},  w: {field:'line_file', editable: 'true', name:'line_file'}},
loaded: {r: {field:'loaded', width: 'auto' , dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'loaded'},  w: {field:'loaded', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'loaded'}},
note: {r: {field:'note', width: 'auto' , name:'note'},  w: {field:'note', editable: 'true', name:'note'}},
priority: {r: {field:'priority', width: 'auto' , name:'priority'},  w: {field:'priority', editable: 'true', name:'priority'}},
status: {r: {field:'status', width: 'auto' , name:'status'},  w: {field:'status', editable: 'true', name:'status'}},
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
zu: {r: {field:'zu', width: 'auto' , name:'zu'},  w: {field:'zu', editable: 'true', name:'zu'}}}


});


});