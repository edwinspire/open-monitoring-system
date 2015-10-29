define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!w_common_datetime/w_common_datetime.html',
    'jspire/form/DateTextBox',
    'dijit/form/TimeTextBox',
    'dijit/form/DateTextBox'
], function (declare, _Widget, _Templated, templateString, jsDTb) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        postCreate: function () {
            var t = this;
            jsDTb.addGetDateFunction(t.Fecha);
            t.now();
//
        },
        _setValueAttr: function (_v) {
            this.Fecha.set('value', _v);
            this.Hora.set('value', _v);
        },
        _getValueAttr: function () {
//console.warn('Obteniendo fecha');
            var r = this.Fecha._getDate() + 'T' + this.Hora.value.toLocaleTimeString();
//console.log(r);
            return new Date(Date(r));
        },
        reset: function (_now) {
            if (_now) {
                this.now();
            } else {
                this.Fecha.reset();
                this.Hora.reset();
            }
        },
        _setDisabledAttr: function (_d) {
            var t = this;
            t.Fecha.set('disabled', _d);
            t.Hora.set('disabled', _d);
        },
        now: function () {
            this.set('value', new Date());
        },
        validate: function () {
            if (this.Fecha.validate() && this.Hora.validate()) {
                return true;
            } else {
                return false;
            }

        }




    });
});
