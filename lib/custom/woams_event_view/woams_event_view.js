define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!woams_event_view/woams_event_view.html',
    "oams/request/dbTuple",
    'dojo/dom-class',
    'woams_eventtypes_list/woams_eventtypes_list',
    'woams_account_list/woams_account_list',
    'w_editable_div/w_editable_div',
    'w_common_datetime/w_common_datetime'
], function (declare, _Widget, _Templated, templateString, dbT, domClass) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        _tuple_wev: new dbT(),
        _IdEvent: 0,
        postCreate: function () {
            var t = this;
            t._tuple_wev.url = '/oams_php_query/event_tuple.php';
            t._tuple_wev.name_id_field = 'idevent';
            t._tuple_wev.bind_fields('woams_event_view_bind', t.domNode);
            t.set('disabledfields', true);

        },
        load_form: function (_idevent) {
            var t = this;
            t._tuple_wev.load_tuple(_idevent);

        },
        new_to_account: function (_v) {
            var t = this;
            t.reset();
            t.set('disabledfields', false);
            if (_v > 0) {
                console.log('Nuevo evento para el idaccount ' + _v);
                t.Account.set('value', _v);
                t.Account.set('disabled', true);
            }
        },
        save_form: function () {
            console.log('save_form');
            this._tuple_wev.save_tuple();
        },
        delete_form: function () {
            console.log('delete_form');
            this._tuple_wev.delete_tuple();
        },
        reset_form: function () {
            console.log('reset_form');
            this._tuple_wev.reset_tuple();
        },
        reset: function () {
            var t = this;
            t._IdEvent = 0;
            t.ID.innerHTML = '# ' + t._IdEvent;
            t.Account.reset();
            t.Fecha.now();
            t.Code.reset();
            t.ZU.reset();
            t.Priority.reset();
            t.Description.reset();
            t.ET.reset();
            t.set('disabledfields', false);
            domClass.remove(t.Wcontainer);
            t.emit('onloadevent', {idevent: t._IdEvent});
        },
        _setDisabledfieldsAttr: function (_d) {
            var t = this;
            t.Fecha.set('disabled', _d);
            t.Account.set('disabled', _d);
            t.ET.set('disabled', _d);
            t.Code.set('disabled', _d);
            t.ZU.set('disabled', _d);
            t.Priority.set('disabled', _d);
            t.Description.set('disabled', _d);
        }



    });
});
