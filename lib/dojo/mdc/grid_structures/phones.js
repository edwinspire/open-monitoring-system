define("oams/grid_structures/phones",['dojo/_base/declare', 'dojo/Evented', 'dojo/date/locale'],function(_1, _2, _3){

  return _1([_2], {
	structure: {enabled: {r: {field:'enabled', width: '50px ', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"'}, alwaysEditing: true,  name:'Habilitado'},  w: {field:'enabled', width: '50px ', editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true'}, alwaysEditing: true, name:'Habilitado'}},
ext: {r: {field:'ext', width: '6em ', name:'Extensión'},  w: {field:'ext', editable: 'true', name:'Extensión'}},
idcontact: {r: {field:'idcontact', width: 'auto' , name:'idcontact'},  w: {field:'idcontact', editable: 'true', name:'idcontact'}},
idphone: {r: {field:'idphone', width: 'auto' , name:'idphone'},  w: {field:'idphone', editable: 'true', name:'idphone'}},
idphonetype: {r: {field:'idphonetype', width: 'auto' , name:'Tipo de teléfono'},  w: {field:'idphonetype', editable: 'true', name:'Tipo de teléfono'}},
idprovider: {r: {field:'idprovider', width: 'auto' , name:'Proveedor'},  w: {field:'idprovider', editable: 'true', name:'Proveedor'}},
note: {r: {field:'note', width: 'auto' , name:'Notas'},  w: {field:'note', editable: 'true', name:'Notas'}},
number: {r: {field:'number', width: '12em ', name:'Número'},  w: {field:'number', editable: 'true', name:'Número'}},
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