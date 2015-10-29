define("jspire/request/uHTTPDataSource", ["dojo/_base/declare", 'dojo/request', 'dojo/query'], function (_1, _2, _3) {

    var r = function () {

    };
    r.id = null;
    r.change = false,
            r.prototype = {
                _data: [],
                url_load: "/uxsql/default_query.uxsl",
                url_save: "/uxsql/default_query.uxsl",
                url_delete: "/uxsql/default_query.uxsl",
                _wdijit: [],
                _wdojo: [],
                name_document: function (_name) {
                    var t = this;

                    var f = _3("[data-bind-data]='" + _name + "'");

                    f.forEach(function (node) {

                        var d = dijit.byId(node.id);

                        if (d) {
                            t._wdijit.push(d);
                            t._connect_dijit_onchanged(d);
                        } else {

                            d = node;

                            if (d) {
                                t._wdojo.push(d);
                                t._connect_dojo_onchanged(d);
                            }
                        }

                    });


//console.log(t._wdijit);
//console.log(t._wdojo);

                },
                _set_values_onload: function (_data) {
                    var t = this;
                    var name;
                    var value;
                    for (var i = 0; i < t._wdijit.length; i++) {
                        name = t._wdijit[i].get("name");
                        if (name) {
                            value = _data[name];

                            if (value) {
                                t._wdijit[i].set("value", value);
                            } else {
                                console.log('No hay valor para el nombre: ' + name);
                            }

                        } else {
                            console.log('El widget no tiene la propiedad: ' + name);
                        }
                    }


                    for (var i = 0; i < t._wdojo.length; i++) {
                        name = t._wdojo[i].name;
                        if (name) {
                            value = _data[name];

                            if (value) {
                                t._wdojo[i].value = value;
                            } else {
                                console.log('No hay valor para el nombre: ' + name);
                            }

                        } else {
                            console.log('El elemento no tiene la propiedad: ' + name);
                        }
                    }

                },
                _connect_dijit_onchanged: function (_w) {
                    var t = this;

//	console.log(_w);

                    if (_w.get('name')) {

                        _w.on('Change', function (v) {

                            t._data[this.get('name')] = v;
                            t.change = true;
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
                            t.change = true;
                        });

                    } else {
                        console.error('El elemento ' + _input + ' no tiene la propiedad name.');
                    }



                },
                _post: function (_url, _data, _name_event) {
                    var t = this;
                    if (t.id) {

                        _2.post(_url, {
                            data: _data,
                            handleAs: 'json'
                        }).then(
                                function (response) {
                                    t._data = response;
                                    //console.log(t._data);

                                    switch (_name_event) {
                                        case 'onLoad':
                                            t._set_values_onload(response);
                                            t.change = false;
                                            t.emit('onLoad', response);
                                            break;
                                        case 'onSave':
                                            t.emit('onSave', response);
                                            break;
                                        case 'onDelete':
                                            t.emit('onDelete', response);
                                            break;
                                    }



                                },
                                function (error) {
                                    // Display the error returned
                                    console.log(error);
                                }
                        );
                    } else {
                        console.log('El Id ' + t.id + ' no es válido.');
                    }
                },
// Este método trae los datos usando Post segun el Id del registro.
                load: function (idrow) {
                    this.id = idrow;
                    this._post(this.url_load, {id: this.id}, 'onLoad');
                },
// Envia los datos al servidor para ser guardados.
                save: function () {
                    console.log('No están definidos aun los campos a ser usados.');
                    this._post(this.url_save, {id: this._data}, 'onSave');
                },
// Elimina el registro segun el Id del registro cargado.
                delete: function () {
                    this._post(this.url_delete, {id: this.id}, 'onDelete');
                }

            };

    return r;
});
