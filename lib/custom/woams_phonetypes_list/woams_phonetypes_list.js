define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!woams_phonetypes_list/woams_phonetypes_list.html',
    "dojo/store/JsonRest",
    'dijit/form/FilteringSelect'
], function (declare, _Widget, _Templated, templateString, JSONRest) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        _tempValue: 0,
        postCreate: function () {
            var t = this;

            var rs1 = new dojo.store.JsonRest({
                target: "oams_php_query/phonetypes_list_selection.php",
                idProperty: "idphonetype"
            });

            t.FS.store = rs1;

// Agregamos esta funcion de esta forma para evitar un mal funcionamiento cuando el filteringselect es una celda de un Gridx.
// Una vez cargados los datos se setea y se conecta el evento Change.
            t.FS.postLoad = function () {

                t.set('value', t._tempValue);

                t.FS.on('Change', function (e) {
                    t.emit('Change', {});
                });

            }

        },
        validate: function () {
            return this.FS.validate();
        },
        _getValueAttr: function () {
            return this.FS.get('value');
        },
        reset: function () {
            this.FS.reset();
        },
        _setValueAttr: function (v) {
            this.FS.set('value', String(v));
            this._tempValue = v;
        },
        displayedValue: function () {
            return this.FS.get('displayedValue');
        }



    });
});
