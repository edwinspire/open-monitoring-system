define("oams/grid_structures/events_dbsizes",['dojo/_base/declare', 'dojo/Evented', 'dojo/date/locale'],function(_1, _2, _3){

  return _1([_2], {
	structure: {account: {r: {field:'account', width: '5em ', name:'Oficina'},  w: {field:'account', editable: 'true', name:'Oficina'}},
code: {r: {field:'code', width: 'auto' , name:'Código'},  w: {field:'code', editable: 'true', name:'Código'}},
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
}, name:'Fecha Evento'},  w: {field:'dateevent', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'Fecha Evento'}},
db_name: {r: {field:'db_name', width: 'auto' , name:'db_name'},  w: {field:'db_name', editable: 'true', name:'db_name'}},
db_size: {r: {field:'db_size', width: 'auto' , name:'db_size'},  w: {field:'db_size', editable: 'true', name:'db_size'}},
db_type: {r: {field:'db_type', width: 'auto' , name:'db_type'},  w: {field:'db_type', editable: 'true', name:'db_type'}},
description: {r: {field:'description', width: 'auto' , name:'Descripción'},  w: {field:'description', editable: 'true', name:'Descripción'}},
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
}, name:'Ultimo Comentario'},  w: {field:'last_comment', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'Ultimo Comentario'}},
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
note: {r: {field:'note', width: 'auto' , name:'Notas'},  w: {field:'note', editable: 'true', name:'Notas'}},
priority: {r: {field:'priority', width: 'auto' , name:'Prioridad'},  w: {field:'priority', editable: 'true', name:'Prioridad'}},
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
}, name:'ts'}},
zu: {r: {field:'zu', width: 'auto' , name:'IDZ'},  w: {field:'zu', editable: 'true', name:'IDZ'}}}


});


});