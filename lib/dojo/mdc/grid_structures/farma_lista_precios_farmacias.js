define("oams/grid_structures/farma_lista_precios_farmacias",['dojo/_base/declare', 'dojo/Evented', 'dojo/date/locale'],function(_1, _2, _3){

  return _1([_2], {
	structure: {activa: {r: {field:'activa', width: 'auto' , name:'fa_activa'},  w: {field:'activa', editable: 'true', name:'fa_activa'}},
idaccount: {r: {field:'idaccount', width: 'auto' , name:'idaccount'},  w: {field:'idaccount', editable: 'true', name:'idaccount'}},
idlista_precios: {r: {field:'idlista_precios', width: 'auto' , name:'idlista_precios'},  w: {field:'idlista_precios', editable: 'true', name:'idlista_precios'}},
ip: {r: {field:'ip', width: 'auto' , name:'ip'},  w: {field:'ip', editable: 'true', name:'ip'}},
principal: {r: {field:'principal', width: 'auto' , name:'fa_principal'},  w: {field:'principal', editable: 'true', name:'fa_principal'}},
productos: {r: {field:'productos', width: 'auto' , name:'fa_productos'},  w: {field:'productos', editable: 'true', name:'fa_productos'}},
provincia: {r: {field:'provincia', width: 'auto' , name:'provincia'},  w: {field:'provincia', editable: 'true', name:'provincia'}},
sincronizado: {r: {field:'sincronizado', width: 'auto' , name:'sincronizado'},  w: {field:'sincronizado', editable: 'true', name:'sincronizado'}},
srv159_activa: {r: {field:'srv159_activa', width: 'auto' , name:'srv159_activa'},  w: {field:'srv159_activa', editable: 'true', name:'srv159_activa'}},
srv159_principal: {r: {field:'srv159_principal', width: 'auto' , name:'srv159_principal'},  w: {field:'srv159_principal', editable: 'true', name:'srv159_principal'}},
srv159_productos: {r: {field:'srv159_productos', width: 'auto' , name:'srv159_productos'},  w: {field:'srv159_productos', editable: 'true', name:'srv159_productos'}},
status: {r: {field:'status', width: 'auto' , name:'estado'},  w: {field:'status', editable: 'true', name:'estado'}},
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
ts_lista_farmacia: {r: {field:'ts_lista_farmacia', width: 'auto' , dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'fa_fecha'},  w: {field:'ts_lista_farmacia', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'fa_fecha'}},
ts_lista_srv159: {r: {field:'ts_lista_srv159', width: 'auto' , dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'srv159_fecha'},  w: {field:'ts_lista_srv159', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'srv159_fecha'}}}


});


});