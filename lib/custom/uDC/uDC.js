define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!uDC/uDC.html',
'dojo/request', 'dojo/query', "dojo/Evented", "dijit/registry", "dojo/ready", "dojo/dom-attr", "dojo/_base/array"
], function (declare, _Widget, _Templated, templateString, _2, _3, _4, _5, _6, _7, _8) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
	table: null,
        changed: false,
        referential_field: null,
        data: [],
//store: new _10(new _9({identifier: "unique_id", items: []})),
//store: new _10(new _9({identifier: "unique_id", items: []})),
        url_data: "default_query.json",
	selector_class: null,
	node_container: null,
        _wdijit: [],
        _wdojo: [],
        _isvalid: false,
	_is_setting_values: false,

        postCreate: function () {

            var t = this;

// Con esta funcion nos aseguramos de que los widgets esten creados antes de poder usarlos.
 _6(function(){

var config = {};
//console.log(t);
var getconf = t.get("data-udc-config");
//console.log(getconf);
if(getconf){
config = dojo.fromJson(getconf);
//console.warn(config);

if(config.url_data){
t.url_data = config.url_data;
}

if(config.table){
t.table = config.table;
}

if(config.referential_field){
t.referential_field = config.referential_field;
}


if(config.selector_class){
t.selector_class = config.selector_class;
}

if(config.node_container){
t.node_container = config.node_container;
}


}
 
if(t.node_container && t.selector_class){
t.bind_fields(t.node_container, t.selector_class, config.append_byArrayIds);
}else{
console.warn('No ha declarado los parametros node y/o selector_class');
}


  });


          
        },
        bind_fields: function (_node, _selector_class, _ArrayIds) {

var r = false;
var t = this;
t.selector_class = _selector_class;
t.node_container = _node;

//console.log(t.selector_class+' => '+t.node_container);

            t._wdijit = [];
            t._wdojo = [];

var f = [];

if(t.node_container){
f = _3(t.selector_class, dojo.byId(t.node_container));
}else{
console.warn('No ha definido node_container, se buscara en todo el Dom usando la clase '+t.selector_class);
f = _3(t.selector_class);
}

//console.log(f);
    f.forEach(function (node, i) {

                var d = _5.byNode(node);

                if (d) {
                    t._wdijit.push(d);
                    t._connect_dijit_onchanged(d);
//console.log(node.id+' Es dijit ');

                } else {
//console.log(node+' No reconocido como dijit ');
                    d = node;
             //       console.warn(d);
                    if (d) {
//console.log(d);
                        t._wdojo.push(d);
                        t._connect_dojo_onchanged(d);
                    }
                }

            });


//console.warn(_ArrayIds);
// TODO comprobar que sea un array antes de proceder
if(_ArrayIds){
t.append_byArrayIds(_ArrayIds);
}

r = true;

return r;
        },
/*
        isValid: function () {
            var t = this;
            t._get_values();
            return t._isvalid;
        },
*/
append_dijit_input: function(_dijit){
this._wdijit.push(_dijit);
return this;
},
append_dojo_input: function(_dojo){
this._wdojo.push(_dojo);
return this;
},
append_byArrayIds: function(_ids){
var t = this;
_8.forEach(_ids, function(_id, i){
t.append_byId(_id);
});
return t;
},
append_byId: function(_id){
var t = this;
                var d = _5.byId(_id);

                if (d) {
                    t._wdijit.push(d);
                    t._connect_dijit_onchanged(d);
console.log(_id+' ID Es dijit ');

                } else {
console.log(_id+' ID No reconocido como dijit ');
                    d = dojo.byId(_id);
             //       console.warn(d);
                    if (d) {
                        t._wdojo.push(d);
                        t._connect_dojo_onchanged(d);
                    }else{
console.warn(_id+' no es un id valido');
}
                }
return this;
},

        _getTableAttr: function () {
return this.table;
        },
        _setTableAttr: function (_table) {
	this.table = _table;
return this;
        },
        _getUrldataAttr: function () {
return this.url_data;
        },
        _setUrldataAttr: function (_url) {
	this.url_data = _url;
return this;
        },
        _getSelectorclassAttr: function () {
return this.selector_class;
        },
        _setSelectorclassAttr: function (_sc) {
	this.selector_class = _sc;
return this;
        },
        _getNodecontainerAttr: function () {
return this.node_container;
        },
        _setNodecontainerAttr: function (_nc) {
	this.node_container = _nc;
return this;
        },

        _getReferential_fieldAttr: function () {
return this.referential_field;
        },
        _setReferential_fieldAttr: function (_rf) {
	this.referential_field = _rf;
return this;
        },
values: function(){
var t = this;
_8.forEach(t._wdijit, function(wi, i){

try{
//console.log(wi.type);
if(wi.type == 'hidden'){
t.data[wi.name] = wi.value;
}
}catch(e){
console.warn(e);
}

});

_8.forEach(t._wdojo, function(wo, i){

try{
//console.log(wo);
if(wo.type == 'hidden'){
t.data[wo.name] = wo.value;
console.log(t.data);
}
}catch(e){
console.warn(e);
}

});

return t.data;
},
set_value: function(field, value){
   var t = this;
var r = false;
//console.log('Campo '+field+' = '+value);
_8.forEach(t._wdijit, function(wi, i){

console.log(wi.get('name'));
if(wi.get('name') == field){
//console.log('Econtrado como dijit');
r = true;
wi.set('value', value);
t.data[field] = value;
}
//console.log(r);
});


if(!r){

_8.forEach(t._wdojo, function(wo, i){
//console.log(wo.name);
if(wo.name == field){
console.log('Econtrado como dojo');
wo.value = value; 
t.data[field] = value;
//console.log(wo);
}
//console.log(r);
});
}

},
        isValid: function () {
            var t = this;
var r = true;
_8.forEach(t._wdijit, function(wi, i){

if(wi.udc_value_valid === false){
r = false;
}
//console.log(r);
});


if(r){
///////// TODO: Esta seccion debe ser probada (Dojo) ////////////
_8.forEach(t._wdojo, function(wo, i){
//console.debug(wo);
if(wo.udc_value_valid === false){
r = false;
}
//console.log(r);
});
}
if(!r){
window.notification_area({urgency: 1, message: 'Existen campos con datos que no son correctos, debe revisarlos.', title: 'Datos inválidos!'});
}
return r;
        },
        _value_field_to_pg: function (_w) {

var _value = _w.get('value');
var _typefield = _w.get('data-dbfieldtype');

            var r = null;
try{
            switch (_typefield) {
                case 'date':
			r = _value.toISOString();
                    break;
                case 'checkbox':
                        if (_value == 't' || _value == 'on' || _value == 'checked') {
        r = true;
    } else {
        r = false;
    }
                    break;
                case 'integer':
                    r = parseInt(_value);
                    break;
                case 'float':
                    r = parseFloat(_value);
                    break;
                case 'number':
                    r = Number(_value);
                    break;
                default:
		_typefield = 'text';
                    r = _value.toString();
                    break;

            }
}catch(e){
console.warn(e);
}

if(_w.get('data-dbfieldemptyasnull') && r.length < 1){
 r = null;
}

//            console.log(_typefield + " ==> " + _value);
            return r;
        },
        _value_pg_to_field: function (_typefield, _value) {
            var r = null;
            _value = _value.toString();
//console.log(_typefield+"  "+_value);
            switch (_typefield) {
                case 'date':
                        // Convierte una cadena de fecha devuelta desde postgres a Date
    var st = _value.replace(/-/g, "/").split("T");
    r = new Date(st[0]);
//console.log(st+' => '+r+' => '+st[0]);
                    break;
                case 'checkbox':
                        r = false;
    if (_value == 'false' || _value == 'FALSE') {
        r = false;
    } else {
        r = Boolean(_value);
    }
                    break;
                case 'integer':
                    r = parseInt(_value);
                    break;
                case 'float':
                    r = parseFloat(_value);
                    break;
                case 'number':
                    r = Number(_value);
                    break;
                default:
                    r = _value.toString();
                    break;

            }
            return r;
        },
/*
_put_store: function(name, value){
var put_value = {};
put_value[name] = value;
this.store.put(put_value);
return this;
},
*/
        _set_values_onload: function (_v) {
            var t = this;
            var name;
            var value;
		var fieldtype;

t.data = _v;
t.changed = false;

_8.forEach(t._wdijit, function(wi, i){

     name = wi.get("name");
fieldtype = wi.get('data-dbfieldtype');
wi.udc_value_valid = true;

                if (name) {
                    value = t.data[name];

                    if (value) {
                        if (fieldtype == "checkbox") {
                            wi.set("checked", value, false);
                        } else {
                            wi.set("value", t._value_pg_to_field(fieldtype, value), false);
                        }


                    } else {
                        try {
                            wi.reset();
                        } catch (e) {
                            console.warn(e);
                        }
                    }

                } else {
                    console.warn('El widget no tiene la propiedad: ' + name);
                }
});


////////////////////////////////////////////////////////
// TODO // esta seccion no ha sido probada
_8.forEach(t._wdojo, function(wo, i){

                name = wo.name;
wo.udc_value_valid = true;
                if (name) {
                    value = t.data[name];
console.debug('2) Seteando valor a '+value);
                    if (value) {
                        wo.value = value;
                    } else {
                        console.log('No hay valor para el nombre: ' + name);
                        try {
                            wo.reset();
                        } catch (e) {
                            console.warn(e);
                        }
                    }

                } else {
                    console.warn('El elemento no tiene la propiedad: ' + name);
                }
});
t.changed = false;
console.log('se termina de cargar los datos');
return this;
        },
        _reset_fields: function () {
            var t = this;
          
_8.forEach(t._wdijit, function(wi, i){
try {
                    wi.reset();
                } catch (e) {
                    console.warn(e);
                }
});

            

///////////////////////////////////////////
// TODO // esta seccion no ha sido probada
_8.forEach(t._wdojo, function(wo, i){
                try {
                    wo.reset();
                } catch (e) {
                    console.warn(e);
                }
});
return t;
        },
        _connect_dijit_onchanged: function (_w) {
            var t = this;
var name = _w.get('name');

            if (name) {
//console.debug(name +' es agregado al evento onchanged');
                _w.on('Change', function (v) {
console.log('Hubo un cambio en '+name);

if(t._validate_dijit(this)){
//t._put_store(name, t._value_field_to_pg(this));
t.data[name] =  t._value_field_to_pg(this);
t.changed = true;

}else if(!this.attr("required")){
// No es valido y tampoco es requerido asi que lo seteamos a null
//t._put_store(name, null);
t.data[name] =  null;
t.changed = true;

}else if(this.attr("required")){
window.notification_area({urgency: 2, message: 'Uno o varios de los campos que son requeridos no han sido ingresados', title: 'Error en los datos'});
console.warn('El campo es requerido'); // Notificar al usuario
}




                });

            } else {
                console.error('El widget ' + _w + ' no tiene la propiedad name.');
            }
return t;
        },
_validate_dijit: function(_w){
var r = false;
try{
r = _w.validate();
}catch(e){
r = true;
console.debug('elemento dijit no tiene el metodo validate()');
}
if(!r){
_w.focus();
}
_w.udc_value_valid = r;
//console.log(r);
return r;
},
        _connect_dojo_onchanged: function (_input) {
            var t = this;

            if (_input.name) {

dojo.connect(_input, 'onchange', function (v) {
 t.data[this.name] = this.value;
                  
console.log('eL INPUT ha cambiado');

                    t.changed = true;
console.log(this.name+' ha cambiado');
                    t.emit('onChange', {});


                });

            } else {
                console.error('El elemento ' + _input + ' no tiene la propiedad name.');
            }
return t;
        },
        _post: function (_data, _query_type) {
            var t = this;

if(t._wdijit.length > 0 || t._wdojo.length > 0){
            if (_data) {
                _data.udc_action = _query_type;
                _data.udc_table = t.table;
                _data.udc_isvalid = t.isValid();
                _data.udc_referential_field = t.referential_field;

if(_query_type == 'insert'){
t._internal_post(_data);
}else if(_query_type != 'insert' && _data.udc_referential_field){
t._internal_post(_data);
}else{
console.warn('La operacion '+_query_type+' requiere del parametro referential_field');
}



            } else {
                console.log('no hay datos para enviar');
            }

}else{
console.warn('No hay campos registrados/configurados a este udc');
}
return t;
        },
_internal_post: function(_data){
var t = this;
//console.log(_data);
var data_send = {};

for(var index in _data) { 
//    var attr = object[index]; 
console.log(index);
console.log(_data[index]);
if(_data[index].constructor.toString().indexOf("Array") > -1) {
//if( Object.prototype.toString.call( _data[index] ) === '[object Array]' ) {
//    alert( 'Array!' );
data_send[index] = '{'+_data[index].toString()+'}';
}else{
data_send[index] = _data[index];
}

}

 _2.post(t.url_data, {
                    data: data_send,
                    handleAs: 'json'
                }).then(
                        function (response) {

                            switch (data_send.udc_action) {
/////// De aqui hacia abajo es la nueva version /////////////////
                                case 'select':
t._set_values_onload(response[0]);
//                                    t._set_values_onload();
                                   
                                    t.emit('onSelect', {data: t.data});
                                    break;
                                case 'insert':
if(response.insert > 0){
window.notification_area({urgency: 10, message: 'Insert '+response.insert, title: 'Registro ingresado'});
}else{
window.notification_area({urgency: 2, message: response.error, title: 'Registro no ingresado'});
}
                                    t.emit('onInsert', {data: response});
                                    break;
                                case 'update':
if(response.update > 0){
window.notification_area({urgency: 10, message: 'Update '+response.update+' row(s)', title: 'Registro actualizado'});

t.select(t.data[t.referential_field]);
}else{
window.notification_area({urgency: 2, message: response.error, title: 'Registro no actualizado'});
}
                                    //console.log(response);
                                    t.emit('onUpdate', {data: response});
                                    break;
                                case 'delete':
if(response.delete > 0){
window.notification_area({urgency: 10, message: 'Delete '+response.delete+' row(s)', title: 'Registro eliminado'});
}else{
window.notification_area({urgency: 2, message: response.error, title: 'Registro no eliminado'});
}
                                    t.emit('onDelete', {data: response});
                                    break;


                            }

//t.changed = false;

                        },
                        function (e) {
                            // Display the error returned
window.notification_area({urgency: 1, message: e, title: 'Error!'});
                            t.emit('onError', {error: e});
                          //  alert(e);
                        }
                );
return t;
},
        clear: function () {
            console.log('reset');
            this._reset_fields();
            return this;
        },
        select: function (idrow) {
var t = this;
t.changed = false;
            console.log('select_tuple ' + idrow);
            var _d = {};
		_d[this.referential_field] = idrow;
            this._post(_d, 'select');
            return this;
        },
        insert: function () {
            var v = this.values();
            if (this.isValid()) {
  //              console.log(v);
//console.log('No están definidos aun los campos a ser usados.');
                this._post(v, 'insert');
            }
            return this;
        },
        new: function () {
	this.insert();
            return this;
        },
        update: function () {
           // var v = this.values();
            if (this.changed) {
             //   console.log('is valid save_tuple');
//console.log('No están definidos aun los campos a ser usados.');
if(this.isValid()){
  this._post(this.values(), 'update');
}             
            }else{
console.log('No hubo cambios');
}
            return this;
        },
        delete: function () {
            console.log('delete');
var _data = {};		
_data[this.referential_field] = this._data[this.referential_field];
            this._post(_data, 'delete');
            return this;
        }








// Fin de funciones //
//************************************//
    });
});
