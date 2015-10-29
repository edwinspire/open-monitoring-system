define("oams/grid_structures/view_accounts",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {account: {r: {field:'account', width: '5em ', name:'Oficina'},  w: {field:'account', editable: 'true', name:'Oficina'}},
account_name: {r: {field:'account_name', width: 'auto' , name:'Farmacia'},  w: {field:'account_name', editable: 'true', name:'Farmacia'}},
address: {r: {field:'address', width: 'auto' , name:'Dirección'},  w: {field:'address', editable: 'true', name:'Dirección'}},
address_ref: {r: {field:'address_ref', width: 'auto' , name:'Referencia Dirección'},  w: {field:'address_ref', editable: 'true', name:'Referencia Dirección'}},
birthday: {r: {field:'birthday', width: 'auto' , dataType: 'datetime',  name:'Fecha Nacimiento'},  w: {field:'birthday', editable: 'true', dataType: 'datetime', name:'Fecha Nacimiento'}},
enabled: {r: {field:'enabled', width: '50px ', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "true"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'Habilitado'},  w: {field:'enabled', width: '50px ', editable: 'true', dataType: 'boolean', editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: "false"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'Habilitado'}},
end_date: {r: {field:'end_date', width: 'auto' , dataType: 'datetime',  name:'end_date'},  w: {field:'end_date', editable: 'true', dataType: 'datetime', name:'end_date'}},
gender: {r: {field:'gender', width: 'auto' , name:'Género'},  w: {field:'gender', editable: 'true', name:'Género'}},
geox: {r: {field:'geox', width: 'auto' , name:'Latitud'},  w: {field:'geox', editable: 'true', name:'Latitud'}},
geoy: {r: {field:'geoy', width: 'auto' , name:'Longitud'},  w: {field:'geoy', editable: 'true', name:'Longitud'}},
idaccountstate: {r: {field:'idaccountstate', width: 'auto' , name:'Estado de la cuenta'},  w: {field:'idaccountstate', editable: 'true', name:'Estado de la cuenta'}},
idaccounttype: {r: {field:'idaccounttype', width: 'auto' , name:'Tipo de cuenta'},  w: {field:'idaccounttype', editable: 'true', name:'Tipo de cuenta'}},
idcontact: {r: {field:'idcontact', width: 'auto' , name:'idcontact'},  w: {field:'idcontact', editable: 'true', name:'idcontact'}},
identification: {r: {field:'identification', width: '10em ', name:'Identificación'},  w: {field:'identification', editable: 'true', name:'Identificación'}},
ididtype: {r: {field:'ididtype', width: 'auto' , name:'Tipo de Identificación'},  w: {field:'ididtype', editable: 'true', name:'Tipo de Identificación'}},
note: {r: {field:'note', width: 'auto' , name:'Notas'},  w: {field:'note', editable: 'true', name:'Notas'}},
postal_code: {r: {field:'postal_code', width: 'auto' , name:'Código postal'},  w: {field:'postal_code', editable: 'true', name:'Código postal'}},
start_date: {r: {field:'start_date', width: 'auto' , dataType: 'datetime',  name:'Fecha de inicio'},  w: {field:'start_date', editable: 'true', dataType: 'datetime', name:'Fecha de inicio'}},
ts: {r: {field:'ts', width: 'auto' , dataType: 'datetime',  name:'ts'},  w: {field:'ts', editable: 'true', dataType: 'datetime', name:'ts'}}}


});


});