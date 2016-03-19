define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!woams_phones_gridx/woams_phones_gridx.html',
    'oams/grid_structures/phones'
], function (declare, _Widget, _Templated, templateString, sgphones) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
	_idcontact: null,
        postCreate: function () {
            var t = this;

            t.dialog_delete_selection.dijitOwner(t.delete_reg, 'Click').on('onok', function () {
// Aqui hacemos el borrado de los registros
            });

            var stphones = new sgphones();
            var sg1 = stphones.structure;

            t.GridX.Url = "oams_php_query/contact_phones_grid.php";
            t.GridX.set("structure", [{field: "unique_id", name: "#", width: '35px'},
                sg1.enabled.r, sg1.number.r, sg1.ext.r, sg1.note.r
            ]);



        },
resize: function(r){
var t = this;
t.GridX.resize(r);
},
load: function(idcontact){
this._idcontact = idcontact;
this.GridX.load({idcontact: this._idcontact});
}





    });
});
