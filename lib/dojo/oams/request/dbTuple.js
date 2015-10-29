define("oams/request/dbTuple", ["dojo/_base/declare", 'dojo/request', 'dojo/query', "dojo/Evented"], function (_1, _2, _3, _4) {


    return _1([_4], {
        changed: false,
        name_id_field: Math.random(),
        _data: [],
        url: "default_query.json",
        _wdijit: [],
        _wdojo: [],
        _isvalid: false,
//	_form: null,
        bind_fields: function (_name, _node) {
            var t = this;
            t._wdijit = [];
            t._wdojo = [];
////var f = _3('[data-dbTuple='+_name+'"]', _node);
            console.warn(_name);
            var f = _3('[data-dbTuple$=\"' + _name + '\"]', _node);
            var ii = 1;

            f.forEach(function (node) {

                if (node.id) {

                } else {
                    node.id = 'dbTuple_' + (new Date().getTime()) + '_' + Math.random().toString().replace('.', '');
                }

//console.log(node.id+' '+node+' '+node.name);

                try {
                    var n = node.name;

                    if (n) {

                    } else {
                        n = node.get('name');
                    }

                    //console.log(ii + ') ' + node.id + ' ' + node + ' ' + n);
                    ii++;
                } catch (e) {
//console.warn(e);
                }




                var d = dijit.byId(node.id);

                if (d) {
                    t._wdijit.push(d);
                    t._connect_dijit_onchanged(d);
                } else {

//d = dojo.byId(node.id);
                    d = node;
                    console.warn(d);
                    if (d) {
                        t._wdojo.push(d);
                        t._connect_dojo_onchanged(d);
                    }
                }

            });

        },
        isValid: function () {
            var t = this;
            t._get_values();
            return t._isvalid;
        },
        _get_values: function () {
            var t = this;
            var name;
            var value;
            t._isvalid = true;


            for (var i = 0; i < t._wdijit.length; i++) {
                var wi = t._wdijit[i];
                name = wi.get("name");
                //console.log(name);
                if (name) {
                    try {

                        if (!wi.validate()) {
                            t._isvalid = false;
                        }

                    } catch (e) {
                        console.error('El campo ' + name + ' no tiene validate');
                    }

                    try {
                        wi.focus();
                    } catch (e) {
                        console.error('El campo ' + name + ' no tiene focus');
                    }




                    t._data[name] = t._value_field_to_pg(wi.get('data-dbfieldtype'), wi.get("value"));
                    console.log(name + ' => ' + wi.get("value"));
                } else {
                    console.warn('El widget no tiene la propiedad: ' + name);
                }
            }


            for (var i = 0; i < t._wdojo.length; i++) {
                var wo = t._wdojo[i];
                name = wo.name;
                if (name) {
                    console.log(name);
                    console.log(name + ' => ' + wo.get("value"));
                    t._data[name] = wo.get("value");
                } else {
                    console.warn('El elemento no tiene la propiedad: ' + name);
                }
            }

        },
        values: function () {
            this._get_values();
            return this._data;
        },
        _value_field_to_pg: function (_typefield, _value) {
            var r = null;
//_value = _value.toString();
//console.log(_typefield);
//console.log(_value);

            switch (_typefield) {
                case 'date':
                    r = _value.toISOString();
                    break;
                case 'checkbox':
                    r = _value.toString().pg_to_boolean();
                    break;
                case 'integer':
                    r = _value.toString().to_int();
                    break;
                default:
                    r = _value.toString();
                    break;

            }

            console.log(_typefield + " ==> " + _value);
            return r;
        },
        _value_pg_to_field: function (_typefield, _value) {
            var r = null;
            _value = _value.toString();
//console.log(_typefield+"  "+_value);
            switch (_typefield) {
                case 'date':
                    r = _value.pg_to_date();
                    break;
                case 'checkbox':
                    r = _value.pg_to_boolean();
                    break;
                case 'integer':
                    r = _value.to_int();
                    break;
                default:
                    r = _value.toString();
                    break;

            }
            return r;
        },
        _set_values_onload: function () {
            var t = this;
            var name;
            var value;
//console.log(_data);
            /*
             try{
             t._data.id = t._data[t.name_id_field];
             console.log(t._data.id);
             }catch(e){
             console.log('No existe un indice segun el nombre configurado '+e);
             t._data.id = '';
             }
             */

            for (var i = 0; i < t._wdijit.length; i++) {
                var wi = t._wdijit[i];
                name = wi.get("name");
                if (name) {
                    value = t._data[name];

                    if (value) {
console.log("(Field) "+name+" => "+value+" /// "+wi.get('data-dbfieldtype'));

                        if (wi.get('data-dbfieldtype') == "checkbox") {
console.log("Es checkbox");
                            wi.set("checked", value);
                        } else {
console.log("NO Es checkbox");
                            wi.set("value", t._value_pg_to_field(wi.get('data-dbfieldtype'), value));
                        }


                    } else {
                        console.log('No hay valor para el nombre: ' + name);
                        try {
                            wi.reset();
                        } catch (e) {
                            console.warn('El widget del campo ' + name + ' no tiene la propiedad o funcion reset');
                            console.warn(e);
                        }
                    }

                } else {
                    console.log('El widget no tiene la propiedad: ' + name);
                }
            }

// TODO // esta seccion no ha sido probada
            for (var i = 0; i < t._wdojo.length; i++) {
                var wo = t._wdojo[i];
                name = wo.name;
                if (name) {
                    value = t._data[name];

                    if (value) {
                        wo.value = value;
                    } else {
                        console.log('No hay valor para el nombre: ' + name);
                        wo.reset();
                    }

                } else {
                    console.log('El elemento no tiene la propiedad: ' + name);
                }
            }

        },
        _reset_fields: function () {
            var t = this;
            var name;
            var value;

            for (var i = 0; i < t._wdijit.length; i++) {
                try {
                    t._wdijit[i].reset();
                } catch (e) {
                    console.warn(e);
                }
            }

// TODO // esta seccion no ha sido probada
            for (var i = 0; i < t._wdojo.length; i++) {
                try {
                    t._wdojo[i].reset();
                } catch (e) {
                    console.warn(e);
                }
            }

        },
        _connect_dijit_onchanged: function (_w) {
            var t = this;

            if (_w.get('name')) {

                _w.on('changed', function (v) {

                    t._data[this.get('name')] = v;
                    t.changed = true;
                    t.emit('onChange', {});
                });

            } else {
                console.error('El widget ' + _w + ' no tiene la propiedad name.');
            }



        },
        _connect_dojo_onchanged: function (_input) {
            var t = this;

            if (_input.name) {

                dojo.connect(_input, 'onchange', function (v) {
                    t._data[this.name] = this.value;
                    t.changed = true;
                    t.emit('onChange', {});
                });

            } else {
                console.error('El elemento ' + _input + ' no tiene la propiedad name.');
            }



        },
        _post: function (_data, _query_type) {
            var t = this;

//console.log('Cantidad de Wi '+t._wdijit.length);
//console.log('Cantidad de Wo '+t._wdojo.length);

            if (_data) {
                _data.query_type = _query_type;
                _data.isvalid = t._isvalid;
                _data.name_id_field = t.name_id_field;
                console.log(_data);
                _2.post(t.url, {
                    data: _data,
                    handleAs: 'json'
                }).then(
                        function (response) {
                           // console.log(response);
                            switch (_query_type) {
                                case 'load':
                                    t._data = response[0];
                                    t._set_values_onload();
                                    t.changed = false;
                                    t.emit('onLoad', {data: t._data});
                                    break;
                                case 'save':
                                    //console.log(response);
                                    t.emit('onSave', {data: response});
                                    break;
                                case 'delete':
                                    console.log(response);
                                    t.emit('onDelete', {data: response});
                                    break;
/////// De aqui hacia abajo es la nueva version /////////////////
                                case 'select':
                                    t._data = response[0];
                                    t._set_values_onload();
                                    t.changed = false;
                                    t.emit('onSelect', {data: t._data});
                                    break;
                                case 'insert':
                                    //console.log(response);
                                    t.emit('onInsert', {data: response});
                                    break;
                                case 'update':
                                    //console.log(response);
                                    t.emit('onUpdate', {data: response});
                                    break;
                                case 'delete':
                                    console.log(response);
                                    t.emit('onDelete', {data: response});
                                    break;


                            }



                        },
                        function (e) {
                            // Display the error returned
                            console.log(e);
                            t.emit('onError', {error: e});
                            alert(e);
                        }
                );
            } else {
                console.log('El Id ' + t.id + ' no es válido.');
            }
        },
/*
// Este método trae los datos usando Post segun el Id del registro.
        load_tuple: function (idrow) {
            console.log('load_tuple ' + idrow);
            this._data = [];
            this._data[this.name_id_field] = idrow;
            this._post(this._data, 'load');
            return this;
        },
// Envia los datos al servidor para ser guardados.
        save_tuple: function () {
            var v = this.values();
            if (this._isvalid) {
                console.log('is valid save_tuple');
//console.log('No están definidos aun los campos a ser usados.');
                this._post(v, 'save');
            } else {
                console.log('Hay campos no validos');
            }
            return this;
        },

        new_tuple: function () {
            console.log('no usar  new_tuple');
            this._data = [];
            this._reset_fields();
            return this;
        },
        reset_tuple: function () {
            console.log('no usar  reset_tuple');
            this._reset_fields();
            return this;
        },*/
        clear: function () {
            console.log('reset');
            this._reset_fields();
            return this;
        },
        select: function (idrow) {
            console.log('select_tuple ' + idrow);
            this._data = [];
            this._data[this.name_id_field] = idrow;
            this._post(this._data, 'select');
            return this;
        },
        insert: function () {
            var v = this.values();
            if (this._isvalid) {
                console.log('is valid save_tuple');
//console.log('No están definidos aun los campos a ser usados.');
                this._post(v, 'insert');
            } else {
                console.log('Hay campos no validos');
            }
            return this;
        },
        new: function () {
	this.insert();
            return this;
        },
        update: function () {
            var v = this.values();
            if (this._isvalid) {
                console.log('is valid save_tuple');
//console.log('No están definidos aun los campos a ser usados.');
                this._post(v, 'update');
            } else {
                console.log('Hay campos no validos');
            }
            return this;
        },
        delete: function () {
            console.log('delete');
var _data = {};		
_data[this.name_id_field] = this._data[this.name_id_field];
            this._post(_data, 'delete');
            return this;
        }


    });


});
