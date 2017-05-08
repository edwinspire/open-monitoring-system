/**

 * Handles elements

 * @namespace OpenMonitoringSystem

 */
 define([
 	'dojo/_base/declare',
  "dijit/layout/ContentPane",
  'dojo/request', 'dojo/query', "dojo/Evented", "dijit/registry", "dojo/dom-attr", "dojo/_base/array", "dojo/on", "dojo/topic", "dojo/Deferred", "dojo/store/Memory"
  ], function (declare, ContentPane, request, query, Evented, Registry, domAttr, array, on, topic, Deferred, Memory) {
    /**
     * Micro Data Connector
     *
     * @module uDC/uDC
     */
     return declare([ContentPane, Evented], {
      target: '',
      __affected_table: '',
      idProperty: '',
      selectorClass: '',
      hiddenFields: [],
      fieldTypes: [],
      Gui: {target: '/njs/db/gui/properties'},
      _ConnectionsOnChange: [],
      _store: new Memory(),
    /**
     * @class uDC
     * @param args {object}
              * @property {string}  hiddenFields - Id del contenedor donde se buscaran los campos que tengan el selectorClass
         * @property {string}  fieldTypes - Id del contenedor donde se buscaran los campos que tengan el selectorClass
         * @property {string}  target - Url donde apunta para obtener o enviar datos 
 		 * @property {string}  table - Tabla a la cual esta vinculado este uDC
 	 	 * @property {integer}  idProperty - Nombre del campo que se usa como referecia.
 	 	 * @property {string}  nodeContainer - Id del contenedor donde se buscaran los campos que tengan el selectorClass 	 	 
 	 	 * @property {string}  selectorClass - Selector CSS para buscar los campos que van a pertenecer a este uDC
 	 	 * @property {string}  Gui.target - Url de donde se obtendran los tipos de datos de cada campo
     */

     postCreate: function () {
      this.Gui.target = "/njs/db/gui/properties";
      var t = this;
      t._store = new Memory({ data: null, idProperty: 'namefield'});

      t._Build();
    },
    _HiddenFieldCreate: function (_name, _data_type) {
      var t = this;
      var r = { name: _name, value: '', type: 'HiddenField' }; 

      t._store.put({node: r, namefield: r.name, value: null, isvalid: false, send: false, changed: false, type: _data_type});

      r.get = function (v) {
       var g = null;
       switch (v) {
        case 'name':
        g = this.name;
        break;
        case 'value':
        g = this.value;
        break;
      }
      return g;
    }

    r.set = function (_p, _v, _noeventchanged) {

     switch (_p) {
      case 'name':
      this.name = _v;
      break;
      case 'value':
      this.value = _v;

      _noeventchanged = _noeventchanged || true;

      var sf = t._store.get(this.name);

      if (_noeventchanged) {

        sf.changed = true;
        sf.isvalid = true;
        sf.send = true;
        sf.value = _v;

      }else{
        sf.changed = false;
      }

      t._store.put(sf);

      break;
    }
  };

  r.isValid = function () { return true; }
  r.reset = function(){console.debug('No esta implementado el reset en campos ocultos uDC');}

  return r;
},
setField: function (_field, _value, _noeventchanged) {
 var t = this;
 var name;
 var value;
 var f = t._store.get(_field);
 console.debug(_field, _value, f);

 if(f){
   _noeventchanged = _noeventchanged || true;

   try{
     value = t._value_pg_to_field(_field, _value);
   }catch(e){
     console.warn(e);
   }

   try { 

     f.node.set('value', value, _noeventchanged);

   } catch (e) {
    console.error(t.__affected_table, _field, f, e);
  }

}else{
  console.error('No se pudo obtener el campos '+_field+' usando la tabla '+t.__affected_table);
}

return this;
},
_setFieldAttr: function (_field, _value, _noeventchanged) {
  return this.setField(_field, _value, _noeventchanged);
},
getField: function(_field){

 var t = this;

// Obtiene
try{
  return t._store.get(_field).value;
}catch(e){
  console.warn(e, 'No existe valor para el campo '+_field);
  return null;
}



},
getData: function(){
  return this._store.data;
},
_BindFields: function (_fieldTypes) {

  var t = this;  
  console.log(_fieldTypes, t.__affected_table);
  t.startup();

  var storeFielTypes = new Memory({ data: _fieldTypes, idProperty: 'field'});

  console.warn(storeFielTypes);

  if (Array.isArray(t.hiddenFields)) {
   array.forEach(t.hiddenFields, function (item, i) {
    console.warn(item);
    try{
      t._HiddenFieldCreate(item.name, storeFielTypes.get(item.name).data_type);
    }catch(e){
      t._HiddenFieldCreate(item.name, 'text');
      console.warn(e, t.target, t.__affected_table);
    }

  });
 }else{
   console.log('No hay campos ocultos / internos');
 }


 var f = [];
 var ft = "";

 var name;

 t.getDescendants().forEach(function (node, i) {

  var d = node; 

  if (d) {
   name = d.get('name');
   if (name) {
    ft = 'text';
    try{
      ft = storeFielTypes.get(name).data_type;    
    }catch(e){
      console.error(e, name, storeFielTypes);
    }

    t._store.put({node: d, namefield: name, value: null, isvalid: false, send: false, changed: false, type: ft});

    try {
     d.isValid();
   } catch (e) {
     d.isValid = function () { return true; }
   }

   t._ConnectDijitOnChanged(d);
 }

} else {
	d = node;
	if (d) {
		try {
			name = node.name;

      ft = storeFielTypes.get(name).data_type;    
    } catch (e) {
     console.warn(e);
   }
   t._store.put({node: d, namefield: name, value: null, isvalid: false, send: false, changed: false, type: ft});
 }
}

});

 r = true;
 

 return this;
},

_RemoveOnChangeHandler: function(){
 var t = this; 
 array.forEach(t._ConnectionsOnChange, function(e){
  e.remove();
});
 return this;        
},
_Build: function(){
 var t = this;

 if (t.Gui.target) {

   t._get_fieldtypes().then(function (results) {

//console.debug(results);

    if(results[0] && results[0].columns_properties){
      t._BindFields(results[0].columns_properties);
    }else{
      console.warn('_get_fieldtypes no ha devuelto la propiedad columns_properties', results, t.__affected_table);
    }

  });

 } else{
  console.warn('No se ha configurado Gui.target');
}

return this;
},
_setConfigAttr: function (_config, _bind, _force) {
 var t = this;
 if (_force) {

 } else {

  for (var item in _config) {
   try {
    t[item] = _config[item];
  } catch (e) {
    console.error(e);
  }
}

}
if (!_bind != 'undefined') {
  t._Build();
}

       // console.debug(t);

       return this;
     },         
     uninitialize: function(){
      var t = this;
      t._RemoveOnChangeHandler();
    },
        /**
         * A method in first level, just for test
         * @memberof uDC
         * @method isValid
          * @instance
          */
          isValid: function () {
          	var t = this;

            var fieldsInvalid = t._store.query({isvalid: false, send: true, changed: true});

            if(fieldsInvalid.length > 0){

              fieldsInvalid.forEach(function(field){
                t._notifications({ Urgency: 2, Message: field.msg, Title: 'Datos inválidos!' });
              });

              return false;
            }else{
              var rf = {};
              t._store.query({isvalid: true, send: true, changed: true}).forEach(function(field){
                rf[field.namefield] = field.value;
              });

              return rf;
            }
          },
          _value_to_pg: function (_row) {

           var _value = String(_row.node.get('value'));
           var t = this;
           var r = null;

           try{

            var typeF = _row.type;

            if(typeF.indexOf("[]") > -1){
              typeF = "[]";
            }

            switch (typeF) {
              case 'timestamp without time zone':
              r = _value;
              break;
              case 'timestamp with time zone':
              r = _value;
              break;
              case 'boolean':
              r = _value.to_boolean();
              break;
              case 'integer':
              r = _value.to_int();
              break;
              case 'float':
              r = _value.to_float();
              break;
              case 'double precision':
              r = _value.to_float();
              break;
              case 'number':
              r = _value.to_number();
              break;
              case '[]':
              r = '{'+_value+'}';
              break;                        
              default:
              r = _value;
              break;

            }

          }catch(e){
            console.warn(e, _row);
            r = _value;
          }            

          return r;
        },
        _value_pg_to_field: function (_type, _v) {
         var t = this;
         var r = null;
         var _value = String(_v);

         try{

          switch (_type) {
           case 'timestamp without time zone':
           r = _value.fromISO_to_date();
           break;
           case 'timestamp with time zone':
           r = _value.fromISO_to_date();
           break;
           case 'boolean':
           r = _value.to_boolean();
           break;
           case 'integer':
           r = _value.to_int();
           break;
           case 'float':
           r = _value.to_float();
           break;
           case 'double precision':
           r = _value.to_float();
           break;
           case 'number':
           r = _value.to_number();
           break;
           default:
           r = _v;
           break;

         }

       }catch(e){
         console.warn(e);
         r = _value;
       }

       return r;
     },
     _set_values_onload: function (_v) {
      var t = this;

      t._store.query().forEach(function(field){
        try{
          field.node.set('value', t._value_pg_to_field(field.type, _v[field.namefield]), false);
        }catch(e){
          console.error(e, field);
        }
      });

    /**
     * Emite el evento cuando los datos se han cargado.
     *
     * @event uDC#Loaded
     * @type {object}
     */

     t.emit('Loaded', _v);            

     console.log('se termina de cargar los datos');
     return this;

   },
   _reset_fields: function () {
     var t = this;

     t._store.query().forEach(function(field){
      try{
        field.node.reset();
      }catch(e){
        t.setField(field.name, '', false);
        console.error(e, field);
      }
    });

     return t;
   },
   _ConnectDijitOnChanged: function (_w) {
     var t = this;

     console.log(_w);

     t._ConnectionsOnChange.push(

       _w.on('Change', function (v) {

        var name = _w.get('name');
        var row = t._store.get(name);
        row.changed = true;

        console.debug(name+' ha cambiado ' +v);

        if (_w.isValid()) {

         row.value = t._value_to_pg(row);
         row.isvalid = true;
         row.send = true;
         row.msg = '';

       } else if (!this.attr("required")) {

         row.value = null;
         row.isvalid = false;
         row.send = false;
         row.msg = '';

       } else if (this.attr("required")) {

        row.value = null;
        row.isvalid = false;
        row.send = true; 
        row.msg = 'El campo '+name+' es requerido.';                   

      }

      t._store.put(row);

    })

       );

     return t;
   },
   _ConnectDojoOnChanged: function (_input) {
     var t = this;
     console.warn('No esta implementado');
     return t;
   },
   _post: function (_data, _query_type) {
     var t = this;
     var r;

     var count_fields = 0;
     for (var field in _data) {
      if (_data.hasOwnProperty(field)) {
       ++count_fields;
     }
   }


   if (count_fields > 0) {
    if (_data) {
     _data.__action = _query_type;
     _data.__affected_table = t.__affected_table;

     _data.__idProperty = t.idProperty;

     console.log(_data);

     if (_query_type == 'insert') {
      r =  t._internal_post(_data);
    } else if (_query_type != 'insert' && _data.__idProperty) {
      r = t._internal_post(_data);
    } else {
      console.warn('La operacion ' + _query_type + ' requiere del parametro idProperty');
    }



  } else {
    console.log('no hay datos para enviar');
  }

} else {
  console.warn('No hay campos registrados/configurados a este udc');
}

if(!r){
  deferred = new Deferred();
  deferred.resolve("success");
  r = deferred.promise;
}

return r;
},
_internal_post: function (_data) {
  var t = this;

  var data_send = {};

  for (var index in _data) {

    if (_data[index] && _data[index].constructor.toString().indexOf("Array") > -1) {

      data_send[index] = '{' + _data[index].toString() + '}';
    } else {
     data_send[index] = _data[index];
   }

 }

 return  request.post(t.target, {
  data: data_send,
  preventCache: true,
  handleAs: 'json'
}).then(
function (response) {

  switch (data_send.__action) {
                        /////// De aqui hacia abajo es la nueva version /////////////////
                        case 'select':
                        t._set_values_onload(response[0]);

                        t.emit('onSelect', { data: response[0]});
                        break;
                        case 'insert':
                        if (response.success) {
                         t._notifications({ Urgency: 10, Message: 'Ok', Title: 'Registro ingresado' });
                       } else {
                         t._request_success_fail(response);
                       }
                       t.emit('onInsert', { data: response });
                       break;
                       case 'update':
                       if (response.success) {
                         t._notifications({ Urgency: 10, Message: 'Update ' + response.rowCount + ' row(s)', Title: 'Registro actualizado' });

                         t.Select(data_send[t.idProperty]);
                       } else {
                         t._request_success_fail(response);
                       }

                       t.emit('onUpdate', { data: response });
                       break;
                       case 'delete':
                       if (response.success) {
                         t._notifications({ Urgency: 10, Message: 'Delete ' + response.rowCount + ' row(s)', Title: 'Registro eliminado' });
                       } else {
                         t._request_success_fail(response);
                       }
                       t.emit('onDelete', { data: response });
                       break;


                     }

                   },
                   function (e) {
                    // Display the error returned
                    t._notifications({ Urgency: 1, Message: e, Title: 'Error!' });
                    t.emit('onError', { error: e });
                    //  alert(e);
                  }, 
                  function(f){

                  }
                  );

},
_request_success_fail: function(response){
  t._notifications({ Urgency: 2, Message: response.data.code, Title: 'La operacion ha fallado'});
},
_notifications: function (_args) {
  topic.publish("/event/user/notify", _args);

},        
                /**
         * Hace un reset de todos los campos
         * @memberof OpenMonitoringSystem.uDC.uDC
         * @method Clear
         */
         Clear: function () {
           console.log('reset');
           this._reset_fields();
           return this;
         },
                /**
         * Hace select a la base de datos segun el id pasado como parametro
         * @memberof uDC
         * @method Select
          * @param id {integer|string}
          * @instance
          */
          Select: function (idrow) {
           var t = this;
           t.changed = false;
         //   console.log('select_tuple ' + idrow);
         var _d = {};
         _d[this.idProperty] = idrow;
         return this._post(_d, 'select');    
       },

       Insert: function () {

        var v = this.isValid();
        if (v){
          return this._post(v, 'insert');
        }else{
         deferred = new Deferred();
         deferred.resolve({success: false});
         return  deferred.promise;
       }
           // return this;
         },
         New: function () {
          return this.Insert();            
        },
        Update: function () {

          var t = this;
            // var v = this.values();
            console.log(t._store);

            deferred = new Deferred();
            deferred.resolve({success: false});


            if (t.idProperty && t.idProperty.length > 0) {

              var data = t.isValid();

              if(data){
                return  t._post(data, "update");  
              }else{
                return  deferred.promise;
              }

            }else{
              console.warn('El idProperty es necesario para actualizaciones de registros');
              return  deferred.promise;
            }


           // return this;
         },
         Delete: function () {
          console.log('Delete');
          var _data = {};
          _data[this.idProperty] = this._data[this.idProperty];
          return this._post(_data, 'Delete');
        },
        _get_fieldtypes: function () {
          var t = this;


          if(t.__affected_table && t.__affected_table.length > 0 && t.Gui.target && t.Gui.target.length > 0){

            return request.post(t.Gui.target, {
             data: { __affected_table: t.__affected_table },
             preventCache: true,
             handleAs: 'json'
           });

          }else{

            console.warn('Faltan parametros, Table: '+t.__affected_table+' Target: '+t.Gui.target);

            deferred = new Deferred();
            deferred.resolve([]);
            return  deferred.promise;

          }
 //                 return requestFieldTypes;
}







        // Fin de funciones //
        //************************************//
      });
});
