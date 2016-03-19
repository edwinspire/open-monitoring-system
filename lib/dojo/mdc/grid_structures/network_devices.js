define("oams/grid_structures/network_devices",['dojo/_base/declare', 'dojo/Evented', 'dojo/date/locale'],function(_1, _2, _3){

  return _1([_2], {
	structure: {agreement_code_provider: {r: {field:'agreement_code_provider', width: 'auto' , name:'agreement_code_provider'},  w: {field:'agreement_code_provider', editable: 'true', name:'agreement_code_provider'}},
code_ref: {r: {field:'code_ref', width: 'auto' , name:'code_ref'},  w: {field:'code_ref', editable: 'true', name:'code_ref'}},
connection_speed: {r: {field:'connection_speed', width: 'auto' , name:'connection_speed'},  w: {field:'connection_speed', editable: 'true', name:'connection_speed'}},
description: {r: {field:'description', width: 'auto' , name:'Descripción'},  w: {field:'description', editable: 'true', name:'Descripción'}},
equipment: {r: {field:'equipment', width: 'auto' , name:'Equipo'},  w: {field:'equipment', editable: 'true', name:'Equipo'}},
idaccount: {r: {field:'idaccount', width: 'auto' , name:'idaccount'},  w: {field:'idaccount', editable: 'true', name:'idaccount'}},
idequipment: {r: {field:'idequipment', width: 'auto' , name:'idequipment'},  w: {field:'idequipment', editable: 'true', name:'idequipment'}},
idprovider: {r: {field:'idprovider', width: 'auto' , name:'idprovider'},  w: {field:'idprovider', editable: 'true', name:'idprovider'}},
installation_date: {r: {field:'installation_date', width: 'auto' , dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'installation_date'},  w: {field:'installation_date', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'installation_date'}},
ip: {r: {field:'ip', width: '15em ', name:'IP'},  w: {field:'ip', editable: 'true', name:'IP'}},
mac: {r: {field:'mac', width: 'auto' , name:'mac'},  w: {field:'mac', editable: 'true', name:'mac'}},
mark: {r: {field:'mark', width: 'auto' , name:'Marca'},  w: {field:'mark', editable: 'true', name:'Marca'}},
model: {r: {field:'model', width: 'auto' , name:'Modelo'},  w: {field:'model', editable: 'true', name:'Modelo'}},
monitored: {r: {field:'monitored', width: 'auto' , dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"'}, alwaysEditing: true,  name:'monitored'},  w: {field:'monitored', width: 'auto' , editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true'}, alwaysEditing: true, name:'monitored'}},
network_access_method: {r: {field:'network_access_method', width: 'auto' , name:'network_access_method'},  w: {field:'network_access_method', editable: 'true', name:'network_access_method'}},
note: {r: {field:'note', width: 'auto' , name:'Notas'},  w: {field:'note', editable: 'true', name:'Notas'}},
operability: {r: {field:'operability', width: 'auto' , name:'Operatividad'},  w: {field:'operability', editable: 'true', name:'Operatividad'}},
port: {r: {field:'port', width: 'auto' , name:'port'},  w: {field:'port', editable: 'true', name:'port'}},
pwd: {r: {field:'pwd', width: 'auto' , name:'pwd'},  w: {field:'pwd', editable: 'true', name:'pwd'}},
serial_number: {r: {field:'serial_number', width: 'auto' , name:'Número - Serie'},  w: {field:'serial_number', editable: 'true', name:'Número - Serie'}},
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
uninstall_date: {r: {field:'uninstall_date', width: 'auto' , dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'uninstall_date'},  w: {field:'uninstall_date', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'uninstall_date'}},
username: {r: {field:'username', width: 'auto' , name:'username'},  w: {field:'username', editable: 'true', name:'username'}}}


});


});