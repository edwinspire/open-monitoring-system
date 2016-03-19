define("oams/grid_structures/view_events_monitor",['dojo/_base/declare', 'dojo/Evented', 'dojo/date/locale'],function(_1, _2, _3){

  return _1([_2], {
	structure: {account: {r: {field:'account', width: '5em ', name:'Oficina'},  w: {field:'account', editable: 'true', name:'Oficina'}},
account_name: {r: {field:'account_name', width: 'auto' , name:'Farmacia'},  w: {field:'account_name', editable: 'true', name:'Farmacia'}},
code: {r: {field:'code', width: '50px ', name:'Código'},  w: {field:'code', editable: 'true', name:'Código'}},
dateevent: {r: {field:'dateevent', width: '90px ', dataType: 'datetime', decorator: function(value)
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
description: {r: {field:'description', width: 'auto' , name:'Descripción'},  w: {field:'description', editable: 'true', name:'Descripción'}},
first_name: {r: {field:'first_name', width: '50px ', name:'Farmacia'},  w: {field:'first_name', editable: 'true', name:'Farmacia'}},
idaccount: {r: {field:'idaccount', width: 'auto' , name:'idaccount'},  w: {field:'idaccount', editable: 'true', name:'idaccount'}},
idevent: {r: {field:'idevent', width: 'auto' , name:'idevent'},  w: {field:'idevent', editable: 'true', name:'idevent'}},
ideventtype: {r: {field:'ideventtype', width: 'auto' , name:'ideventtype'},  w: {field:'ideventtype', editable: 'true', name:'ideventtype'}},
label: {r: {field:'label', width: '100px ', name:'Evento'},  w: {field:'label', editable: 'true', name:'Evento'}},
last_comment: {r: {field:'last_comment', width: '80px ', dataType: 'datetime', decorator: function(value)
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
last_name: {r: {field:'last_name', width: 'auto' , name:'Apellido'},  w: {field:'last_name', editable: 'true', name:'Apellido'}},
oams_assigned: {r: {field:'oams_assigned', width: 'auto' , name:'Técnico Asignado'},  w: {field:'oams_assigned', editable: 'true', name:'Técnico Asignado'}},
priority: {r: {field:'priority', width: '20px ', name:'P'},  w: {field:'priority', editable: 'true', name:'P'}},
status: {r: {field:'status', width: 'auto' , name:'Estado'},  w: {field:'status', editable: 'true', name:'Estado'}},
status_label: {r: {field:'status_label', width: '50px ', name:'Estado'},  w: {field:'status_label', editable: 'true', name:'Estado'}},
zu: {r: {field:'zu', width: '40px ', name:'ID'},  w: {field:'zu', editable: 'true', name:'ID'}}}


});


});