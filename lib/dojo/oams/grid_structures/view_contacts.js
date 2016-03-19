define("oams/grid_structures/view_contacts",['dojo/_base/declare', 'dojo/Evented', 'dojo/date/locale'],function(_1, _2, _3){

  return _1([_2], {
	structure: {address: {r: {field:'address', width: 'auto' , name:'Dirección'},  w: {field:'address', editable: 'true', name:'Dirección'}},
address_ref: {r: {field:'address_ref', width: 'auto' , name:'Dirección Referencia'},  w: {field:'address_ref', editable: 'true', name:'Dirección Referencia'}},
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
contact_name: {r: {field:'contact_name', width: 'auto' , name:'Nombre'},  w: {field:'contact_name', editable: 'true', name:'Nombre'}},
enabled: {r: {field:'enabled', width: '50px ', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"'}, alwaysEditing: true,  name:'Habilitado'},  w: {field:'enabled', width: '50px ', editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true'}, alwaysEditing: true, name:'Habilitado'}},
gender: {r: {field:'gender', width: 'auto' , name:'Género'},  w: {field:'gender', editable: 'true', name:'Género'}},
geox: {r: {field:'geox', width: 'auto' , name:'Latitud'},  w: {field:'geox', editable: 'true', name:'Latitud'}},
geoy: {r: {field:'geoy', width: 'auto' , name:'Longitud'},  w: {field:'geoy', editable: 'true', name:'Longitud'}},
groups: {r: {field:'groups', width: 'auto' , name:'Grupos'},  w: {field:'groups', editable: 'true', name:'Grupos'}},
idcontact: {r: {field:'idcontact', width: 'auto' , name:'idcontact'},  w: {field:'idcontact', editable: 'true', name:'idcontact'}},
identification: {r: {field:'identification', width: '10em ', name:'Identificación'},  w: {field:'identification', editable: 'true', name:'Identificación'}},
ididtype: {r: {field:'ididtype', width: 'auto' , name:'Tipo de Identificación'},  w: {field:'ididtype', editable: 'true', name:'Tipo de Identificación'}},
note: {r: {field:'note', width: 'auto' , name:'note'},  w: {field:'note', editable: 'true', name:'note'}},
postal_code: {r: {field:'postal_code', width: 'auto' , name:'postal_code'},  w: {field:'postal_code', editable: 'true', name:'postal_code'}},
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