define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!woams_admin_widget/woams_admin_widget.html',
    'oams/grid_structures/phones',
    'oams/grid_structures/emails',
    'oams/grid_structures/view_accounts_oams_assigned',
    'woams_contact_form/woams_contact_form'
], function (declare, _Widget, _Templated, templateString, sgphones, sgemail, sgwaasigneg) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        postCreate: function () {
            var t = this;
            t.T1.set("label", "Abonado");
            t.Menu.on("onsave", function () {
                t.ContactForm.save_form();
            });
            t.Menu.on("onnew", function () {
                t.ContactForm.reset_form();
            });
            t.Menu.on("ondelete", function () {
                t.ContactForm.delete_form();
            });

            t.ContactForm.on('onload', function (e) {
                t.T1.set("label", e.data.last_name + " " + e.data.first_name);
//console.warn(d);
            });


            t.ContactForm.on('onsave', function () {
//t.T1.set("label", t.ContactForm._tuple._data.last_name+" "+t.ContactForm._tuple._data.first_name);


            });

            t.ContactForm.on('ondelete', function () {
//t.T1.set("label", t.ContactForm._tuple._data.last_name+" "+t.ContactForm._tuple._data.first_name);
            });


            var stphones = new sgphones();
            var sg1 = stphones.structure;
            var stemail = new sgemail();
            var sg2 = stemail.structure;
            var staccounts = new sgwaasigneg();
            var sg3 = staccounts.structure;

            t.GridPhones.Url = "oams_php_query/contact_phones_grid.php";
            t.GridPhones.set("structure", [{field: "unique_id", name: "#", width: '35px'},
                sg1.enabled.r, sg1.number.r, sg1.ext.r, sg1.note.r
            ]);

            t.GridEmail.Url = "oams_php_query/contact_email_grid.php";
            t.GridEmail.set("structure", [{field: "unique_id", name: "#", width: '35px'},
                sg2.email.r, sg2.note.r
            ]);

            t.GridAccountAsigned.Url = "oams_php_query/view_accounts_oams_assigned.php";
            t.GridAccountAsigned.set("structure", [{field: "unique_id", name: "#", width: '35px'},
                sg3.account.r, sg3.account_name.r, sg3.address.r
            ]);





        },
        load: function (_idcontact) {
// idcontact es lo mismo que idcontacto solo que lamado desde la tabla accounts
            console.log("woams_admin_widget " + _idcontact);
            this.ContactForm.load_form(_idcontact);
            this.GridPhones.load({idcontact: _idcontact});
            this.GridEmail.load({idcontact: _idcontact});
            this.GridAccountAsigned.load({idcontact: _idcontact});
		this._set_map(_idcontact);
        },
        resize: function (s) {
            this.TC1.resize();
//	this.C2.resize();
        },
_set_map: function(_idcontact){

var iframemap = '';

if(_idcontact){
iframemap = '<iframe  src="oams_map.php?idcontact='+_idcontact+'&maptype=2"  frameBorder="0" frameborder="0"  seamless="seamless"></iframe> ';
}
console.warn(iframemap);
this.ContainerMap.set("content", iframemap);

}






















    });
});
