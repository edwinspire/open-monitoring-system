define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!woams_contact_form/woams_contact_form.html',
    'dojo/request',
    "oams/request/dbTuple",
    'woams_identificationtypes_list/woams_identificationtypes_list',
    'dijit/form/DateTextBox',
    'dijit/form/CheckBox',
    'dijit/form/TextBox',
    'dijit/form/Textarea',
    'dijit/layout/ContentPane',
    'w_common_basic_menubar/w_common_basic_menubar',
    'w_common_titlebar/w_common_titlebar',
    'woams_phones_gridx/woams_phones_gridx',
    'dijit/layout/BorderContainer',
    'woams_groups_gridx/woams_groups_gridx'
], function (declare, _Widget, _Templated, templateString, request, dbT) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        _tuple: null,
        postCreate: function () {
            var t = this;
		t._tuple = new dbT();
            t._tuple.url = '/oams_php_query/contact_tuple.php';
            t._tuple.name_id_field = 'idcontact';
            t._tuple.bind_fields('woams_contact_form_widget', t.domNode);
            t._tuple.on("onSelect", function (d) {
                t.emit("onload", d);
            });


            t._tuple.on("onSave", function (d) {
//console.log("Cargado los datos en el form");
//t.load_form(d.idcontact);
                t.emit("onsave", d);
            });

            t._tuple.on("onDelete", function (d) {
//console.log("Cargado los datos en el form");
                t.reset_form();
                t.emit("ondelete", d);
            });

        },
        load_form: function (_idcontact) {
// idaccount es lo mismo que idcontacto solo que lamado desde la tabla accounts
//console.log("woam_contact_form load id "+_idcontact);
            var t = this;
            t._tuple.select(_idcontact);

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
            this._tuple.reset_tuple();
//t._tuple.load_tuple();
        },
        resize: function (s) {
//this.BC1.resize({h: '40%'});
        },
        table_changed: function (_tables) {

        }




    });
});
