define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!woams_account_form/woams_account_form.html',
    'dojo/request',
    "oams/request/dbTuple",
"dojo/dom-attr",
    'woams_account_states_list/woams_account_states_list',
    'woams_contacts_list/woams_contacts_list',
    'woams_account_types_list/woams_account_types_list',
    'woams_contact_form/woams_contact_form',
    'jspire/String',
    'dijit/TitlePane',
    'dijit/form/ValidationTextBox'
], function (declare, _Widget, _Templated, templateString, request, dbT, domAttr) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        _tuple: new dbT(),
        postCreate: function () {
            var t = this;

t.OpenStreetMaps.on('Click', function(){
 window.open("http://www.openstreetmap.org/?mlat="+t.Geox.get('value')+"&mlon="+t.Geoy.get('value')+"#map=19/"+t.Geox.get('value')+"/"+t.Geoy.get('value'),'_blank');
});
//domAttr.set(t.AccountMap, "src", "oams_map.php?idaccount="+0);
		t._tuple = new dbT();
            t._tuple.url = '/oams_php_query/account_tuple.php';
            t._tuple.name_id_field = 'idcontact';
            t._tuple.bind_fields('woams_account_form_widget', t.domNode);
            t._tuple.on("onLoad", function (d) {

                t.emit("onload", d);
            });

            t._tuple.on("onSave", function (d) {
                t.emit("onsave", t._tuple._data);
            });

            t._tuple.on("onDelete", function (d) {
//console.log("Cargado los datos en el form");
                t.reset_form();
                t.emit("ondelete", d);
            });

        },
        load_form: function (_idaccount) {
// idaccount es lo mismo que idcontacto solo que lamado desde la tabla accounts

            var t = this;
            t._tuple.select(_idaccount);

        },
        save_form: function () {
            console.log('save_form');
            this._tuple.update();
        },
        delete_form: function () {
            console.log('delete_form');
            this._tuple.delete();
        },
        reset_form: function () {
            console.log('reset_form');
            this._tuple.reset();
        },
        resize: function (s) {
//this.BC1.resize({h: '40%'});
//console.log("Cambiando de tamaño");
        },
        table_changed: function (_tables) {

        }











    });
});
