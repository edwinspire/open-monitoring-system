define("oams/grid_structures/view_equipments",['dojo/_base/declare', 'dojo/Evented', 'dojo/date/locale'],function(_1, _2, _3){

  return _1([_2], {
	structure: {account: {r: {field:'account', width: '5em ', name:'Oficina'},  w: {field:'account', editable: 'true', name:'Oficina'}},
account_name: {r: {field:'account_name', width: 'auto' , name:'Farmacia'},  w: {field:'account_name', editable: 'true', name:'Farmacia'}},
accounttype: {r: {field:'accounttype', width: 'auto' , name:'Tipo de cuenta'},  w: {field:'accounttype', editable: 'true', name:'Tipo de cuenta'}},
agreement_code_provider: {r: {field:'agreement_code_provider', width: 'auto' , name:'agreement_code_provider'},  w: {field:'agreement_code_provider', editable: 'true', name:'agreement_code_provider'}},
code_ref: {r: {field:'code_ref', width: 'auto' , name:'Código de referencia'},  w: {field:'code_ref', editable: 'true', name:'Código de referencia'}},
description: {r: {field:'description', width: 'auto' , name:'Descripción'},  w: {field:'description', editable: 'true', name:'Descripción'}},
enabled: {r: {field:'enabled', width: '50px ', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"'}, alwaysEditing: true,  name:'Habilitado'},  w: {field:'enabled', width: '50px ', editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true'}, alwaysEditing: true, name:'Habilitado'}},
equipment: {r: {field:'equipment', width: 'auto' , name:'Equipo'},  w: {field:'equipment', editable: 'true', name:'Equipo'}},
idaccountstate: {r: {field:'idaccountstate', width: 'auto' , name:'idaccountstate'},  w: {field:'idaccountstate', editable: 'true', name:'idaccountstate'}},
idaccounttype: {r: {field:'idaccounttype', width: 'auto' , name:'idaccounttype'},  w: {field:'idaccounttype', editable: 'true', name:'idaccounttype'}},
idcontact: {r: {field:'idcontact', width: 'auto' , name:'idcontact'},  w: {field:'idcontact', editable: 'true', name:'idcontact'}},
identification: {r: {field:'identification', width: '10em ', name:'Identificación'},  w: {field:'identification', editable: 'true', name:'Identificación'}},
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
}, name:'Fecha Instalación'},  w: {field:'installation_date', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'Fecha Instalación'}},
mark: {r: {field:'mark', width: 'auto' , name:'Marca'},  w: {field:'mark', editable: 'true', name:'Marca'}},
model: {r: {field:'model', width: 'auto' , name:'Modelo'},  w: {field:'model', editable: 'true', name:'Modelo'}},
note: {r: {field:'note', width: 'auto' , name:'Notas'},  w: {field:'note', editable: 'true', name:'Notas'}},
oams_assigned: {r: {field:'oams_assigned', width: 'auto' , name:'Técnico Asignado'},  w: {field:'oams_assigned', editable: 'true', name:'Técnico Asignado'}},
operability: {r: {field:'operability', width: 'auto' , name:'Operatividad'},  w: {field:'operability', editable: 'true', name:'Operatividad'}},
serial_number: {r: {field:'serial_number', width: 'auto' , name:'Número - Serie'},  w: {field:'serial_number', editable: 'true', name:'Número - Serie'}},
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
}, name:'Fecha Desinstalación'},  w: {field:'uninstall_date', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'Fecha Desinstalación'}}}


});


});