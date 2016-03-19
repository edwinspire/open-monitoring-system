define("oams/grid_structures/accounts",['dojo/_base/declare', 'dojo/Evented', 'dojo/date/locale'],function(_1, _2, _3){

  return _1([_2], {
	structure: {account: {r: {field:'account', width: '5em ', name:'Oficina'},  w: {field:'account', editable: 'true', name:'Oficina'}},
address: {r: {field:'address', width: 'auto' , name:'Dirección'},  w: {field:'address', editable: 'true', name:'Dirección'}},
address_ref: {r: {field:'address_ref', width: 'auto' , name:'Referencia Dirección'},  w: {field:'address_ref', editable: 'true', name:'Referencia Dirección'}},
admin_end: {r: {field:'admin_end', width: 'auto' , dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'admin_end'},  w: {field:'admin_end', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'admin_end'}},
admin_failed_access_attempts: {r: {field:'admin_failed_access_attempts', width: 'auto' , name:'admin_failed_access_attempts'},  w: {field:'admin_failed_access_attempts', editable: 'true', name:'admin_failed_access_attempts'}},
admin_ip: {r: {field:'admin_ip', width: 'auto' , name:'admin_ip'},  w: {field:'admin_ip', editable: 'true', name:'admin_ip'}},
admin_level: {r: {field:'admin_level', width: 'auto' , name:'admin_level'},  w: {field:'admin_level', editable: 'true', name:'admin_level'}},
admin_locked_date: {r: {field:'admin_locked_date', width: 'auto' , dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'admin_locked_date'},  w: {field:'admin_locked_date', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'admin_locked_date'}},
admin_pwd: {r: {field:'admin_pwd', width: 'auto' , name:'admin_pwd'},  w: {field:'admin_pwd', editable: 'true', name:'admin_pwd'}},
admin_sessionid: {r: {field:'admin_sessionid', width: 'auto' , name:'admin_sessionid'},  w: {field:'admin_sessionid', editable: 'true', name:'admin_sessionid'}},
admin_start: {r: {field:'admin_start', width: 'auto' , dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'admin_start'},  w: {field:'admin_start', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'admin_start'}},
admin_username: {r: {field:'admin_username', width: 'auto' , name:'admin_username'},  w: {field:'admin_username', editable: 'true', name:'admin_username'}},
birthday: {r: {field:'birthday', width: 'auto' , dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'Fecha Nacimiento'},  w: {field:'birthday', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'Fecha Nacimiento'}},
enabled: {r: {field:'enabled', width: '50px ', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"'}, alwaysEditing: true,  name:'Habilitado'},  w: {field:'enabled', width: '50px ', editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true'}, alwaysEditing: true, name:'Habilitado'}},
end_date: {r: {field:'end_date', width: 'auto' , dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'Fecha de finalización'},  w: {field:'end_date', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'Fecha de finalización'}},
first_name: {r: {field:'first_name', width: 'auto' , name:'Nombre'},  w: {field:'first_name', editable: 'true', name:'Nombre'}},
gender: {r: {field:'gender', width: 'auto' , name:'Género'},  w: {field:'gender', editable: 'true', name:'Género'}},
geox: {r: {field:'geox', width: 'auto' , name:'Latitud'},  w: {field:'geox', editable: 'true', name:'Latitud'}},
geoy: {r: {field:'geoy', width: 'auto' , name:'Longitud'},  w: {field:'geoy', editable: 'true', name:'Longitud'}},
groups: {r: {field:'groups', width: 'auto' , name:'Grupos'},  w: {field:'groups', editable: 'true', name:'Grupos'}},
idaccountstate: {r: {field:'idaccountstate', width: 'auto' , name:'Estado de la cuenta'},  w: {field:'idaccountstate', editable: 'true', name:'Estado de la cuenta'}},
idaccounttype: {r: {field:'idaccounttype', width: 'auto' , name:'Tipo de cuenta'},  w: {field:'idaccounttype', editable: 'true', name:'Tipo de cuenta'}},
idcontact: {r: {field:'idcontact', width: 'auto' , name:'idcontact'},  w: {field:'idcontact', editable: 'true', name:'idcontact'}},
iddivision: {r: {field:'iddivision', width: 'auto' , name:'iddivision'},  w: {field:'iddivision', editable: 'true', name:'iddivision'}},
identification: {r: {field:'identification', width: '10em ', name:'Identificación'},  w: {field:'identification', editable: 'true', name:'Identificación'}},
ididtype: {r: {field:'ididtype', width: 'auto' , name:'Tipo de Identificación'},  w: {field:'ididtype', editable: 'true', name:'Tipo de Identificación'}},
is_admin: {r: {field:'is_admin', width: 'auto' , dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"'}, alwaysEditing: true,  name:'is_admin'},  w: {field:'is_admin', width: 'auto' , editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true'}, alwaysEditing: true, name:'is_admin'}},
last_name: {r: {field:'last_name', width: 'auto' , name:'Apellido'},  w: {field:'last_name', editable: 'true', name:'Apellido'}},
note: {r: {field:'note', width: 'auto' , name:'Notas'},  w: {field:'note', editable: 'true', name:'Notas'}},
postal_code: {r: {field:'postal_code', width: 'auto' , name:'Código Postal'},  w: {field:'postal_code', editable: 'true', name:'Código Postal'}},
start_date: {r: {field:'start_date', width: 'auto' , dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'Fecha de inicio'},  w: {field:'start_date', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'Fecha de inicio'}},
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