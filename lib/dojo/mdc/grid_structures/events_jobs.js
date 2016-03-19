define("oams/grid_structures/events_jobs",['dojo/_base/declare', 'dojo/Evented', 'dojo/date/locale'],function(_1, _2, _3){

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
description: {r: {field:'description', width: 'auto' , name:'Descripción'},  w: {field:'description', editable: 'true', name:'Descripción'}},
idaccount: {r: {field:'idaccount', width: 'auto' , name:'idaccount'},  w: {field:'idaccount', editable: 'true', name:'idaccount'}},
idadmin: {r: {field:'idadmin', width: 'auto' , name:'idadmin'},  w: {field:'idadmin', editable: 'true', name:'idadmin'}},
idequipment: {r: {field:'idequipment', width: 'auto' , name:'idequipment'},  w: {field:'idequipment', editable: 'true', name:'idequipment'}},
idevent: {r: {field:'idevent', width: 'auto' , name:'idevent'},  w: {field:'idevent', editable: 'true', name:'idevent'}},
ideventtype: {r: {field:'ideventtype', width: 'auto' , name:'ideventtype'},  w: {field:'ideventtype', editable: 'true', name:'ideventtype'}},
job_date_create: {r: {field:'job_date_create', width: 'auto' , dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'job_date_create'},  w: {field:'job_date_create', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'job_date_create'}},
job_description: {r: {field:'job_description', width: 'auto' , name:'job_description'},  w: {field:'job_description', editable: 'true', name:'job_description'}},
job_enabled: {r: {field:'job_enabled', width: 'auto' , dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"'}, alwaysEditing: true,  name:'job_enabled'},  w: {field:'job_enabled', width: 'auto' , editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true'}, alwaysEditing: true, name:'job_enabled'}},
job_name: {r: {field:'job_name', width: 'auto' , name:'job_name'},  w: {field:'job_name', editable: 'true', name:'job_name'}},
job_next_run: {r: {field:'job_next_run', width: 'auto' , dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'job_next_run'},  w: {field:'job_next_run', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'job_next_run'}},
job_run_duration: {r: {field:'job_run_duration', width: 'auto' , name:'job_run_duration'},  w: {field:'job_run_duration', editable: 'true', name:'job_run_duration'}},
job_run_status: {r: {field:'job_run_status', width: 'auto' , name:'job_run_status'},  w: {field:'job_run_status', editable: 'true', name:'job_run_status'}},
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