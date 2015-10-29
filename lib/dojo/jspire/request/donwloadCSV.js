define("jspire/request/downloadCSV", ["dojo/_base/declare", 'dojo/request', 'dojo/query', "dojo/dom-attr", "dojo/Evented"], function (_1, _2, _3, _4, _5) {



    return _1([_5], {
        changed: false,
        name_id_field: Math.random(),
        _data: [],
        url: "download_file.csv",
        _isvalid: false,
        _post: function (_data, _query_type) {
            var t = this;

            console.log('Cantidad de Wi ' + t._wdijit.length);
            console.log('Cantidad de Wo ' + t._wdojo.length);

            if (_data) {
                _data.query_type = _query_type;
                _data.isvalid = t._isvalid;
                console.log(_data);
                _2.post(t.url, {
                    data: _data,
                    handleAs: 'json'
                }).then(
                        function (response) {
                            console.log(response);
                            switch (_query_type) {
                                case 'load':
                                    t._data = response[0];
                                    t._set_values_onload();
                                    t.changed = false;
                                    t.emit('onLoad', {data: t._data});
                                    break;
                                case 'save':
                                    console.log(response);
                                    t.emit('onSave', {data: response});
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
                        }
                );
            } else {
                console.log('El Id ' + t.id + ' no es válido.');
            }
        },
// Este método trae los datos usando Post segun el Id del registro.
        load_tuple: function (idrow) {
            console.log('load_tuple ' + idrow);
            this._data.id = idrow;
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
// Elimina el registro segun el Id del registro cargado.
        delete_tuple: function () {
            console.log('delete_tuple');
            this._data.id = idrow;
            this._post(this._data, 'delete');
            return this;
        },
        new_tuple: function () {
            console.log('new_tuple');
            this._data = [];
            this._set_values_onload();
            return this;
        },
        reset_tuple: function () {
            console.log('reset_tuple');
            this.new_tuple();
            return this;
        }



    });


});
