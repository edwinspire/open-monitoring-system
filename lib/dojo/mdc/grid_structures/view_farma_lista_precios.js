define("oams/grid_structures/view_farma_lista_precios",['dojo/_base/declare', 'dojo/Evented', 'dojo/date/locale'],function(_1, _2, _3){

  return _1([_2], {
	structure: {account: {r: {field:'account', width: '50px ', name:'Oficina'},  w: {field:'account', editable: 'true', name:'Oficina'}},
account_name: {r: {field:'account_name', width: 'auto' , name:'Farmacia'},  w: {field:'account_name', editable: 'true', name:'Farmacia'}},
activa: {r: {field:'activa', width: '5em ', name:'Activa Farma'},  w: {field:'activa', editable: 'true', name:'Activa Farma'}},
address: {r: {field:'address', width: 'auto' , name:'Dirección'},  w: {field:'address', editable: 'true', name:'Dirección'}},
contact_name: {r: {field:'contact_name', width: 'auto' , name:'Técnico Responsable'},  w: {field:'contact_name', editable: 'true', name:'Técnico Responsable'}},
enabled: {r: {field:'enabled', width: '50px ', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"'}, alwaysEditing: true,  name:'Habilitado'},  w: {field:'enabled', width: '50px ', editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true'}, alwaysEditing: true, name:'Habilitado'}},
estado: {r: {field:'estado', width: '50px ', name:'Estado'},  w: {field:'estado', editable: 'true', name:'Estado'}},
geolink: {r: {field:'geolink', width: 'auto' , name:'Link Geolocalización'},  w: {field:'geolink', editable: 'true', name:'Link Geolocalización'}},
idaccount: {r: {field:'idaccount', width: 'auto' , name:'idaccount'},  w: {field:'idaccount', editable: 'true', name:'idaccount'}},
idaccountuser: {r: {field:'idaccountuser', width: 'auto' , name:'idaccountuser'},  w: {field:'idaccountuser', editable: 'true', name:'idaccountuser'}},
idcontact: {r: {field:'idcontact', width: 'auto' , name:'idcontact'},  w: {field:'idcontact', editable: 'true', name:'idcontact'}},
ip: {r: {field:'ip', width: 'auto' , name:'ip'},  w: {field:'ip', editable: 'true', name:'ip'}},
note: {r: {field:'note', width: 'auto' , name:'note'},  w: {field:'note', editable: 'true', name:'note'}},
principal: {r: {field:'principal', width: '6em ', name:'Principal Farma'},  w: {field:'principal', editable: 'true', name:'Principal Farma'}},
productos: {r: {field:'productos', width: '7em ', name:'Productos Farma'},  w: {field:'productos', editable: 'true', name:'Productos Farma'}},
provincia: {r: {field:'provincia', width: 'auto' , name:'provincia'},  w: {field:'provincia', editable: 'true', name:'provincia'}},
sincronizado: {r: {field:'sincronizado', width: '50px ', name:'Farma = SRV159'},  w: {field:'sincronizado', editable: 'true', name:'Farma = SRV159'}},
srv159_activa: {r: {field:'srv159_activa', width: '5em ', name:'Activa SRV159'},  w: {field:'srv159_activa', editable: 'true', name:'Activa SRV159'}},
srv159_principal: {r: {field:'srv159_principal', width: '6em ', name:'Principal SRV159'},  w: {field:'srv159_principal', editable: 'true', name:'Principal SRV159'}},
srv159_productos: {r: {field:'srv159_productos', width: '7em ', name:'Productos SRV159'},  w: {field:'srv159_productos', editable: 'true', name:'Productos SRV159'}},
status: {r: {field:'status', width: '50px ', name:'Estado Farma'},  w: {field:'status', editable: 'true', name:'Estado Farma'}},
tecnico: {r: {field:'tecnico', width: 'auto' , name:'Técnico Responsable'},  w: {field:'tecnico', editable: 'true', name:'Técnico Responsable'}},
ts: {r: {field:'ts', width: '10em ', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'Fecha Tabla'},  w: {field:'ts', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'Fecha Tabla'}},
ts_farmacia: {r: {field:'ts_farmacia', width: '10em ', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'Fecha Farma'},  w: {field:'ts_farmacia', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'Fecha Farma'}},
ts_server159: {r: {field:'ts_server159', width: '10em ', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'Fecha SRV159'},  w: {field:'ts_server159', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'Fecha SRV159'}}}


});


});