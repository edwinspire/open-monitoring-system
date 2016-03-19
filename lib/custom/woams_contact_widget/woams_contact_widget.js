define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!woams_contact_widget/woams_contact_widget.php', "dojo/ready", "dojo/on", "titlebar/titlebar" 
], function (declare, _Widget, _Templated, templateString, ready, on) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        postCreate: function () {

var t = this;

// Deben estar todos los widgets creados y listos antes de proceder
 ready(function(){
/*
t.grid_email.ConfirmDialogNew.on('Click', function(){
t.grid_email.bind_fields_new_tuple(t.woams_contact_new_email.id, '.woams_contact_new_email');
console.log('Probando bind_fields');
});
*/

t.udc_contact.bind_fields(t.ContainerForm, '.udc_contact_widget');

t.udc_contact.on('onselect', function(e){
//console.log(t.idcontact_new_phone);
t.TBar.set("label", t.lastname_input.get('value')+' '+t.firtsname_input.get('value'));
t.idcontact_label.innerHTML = e.data.idcontact;
t.grid_phones.form_set_value('idcontact', e.data.idcontact);
t.grid_email.form_set_value('idcontact', e.data.idcontact);
});




});



        },
        select: function (_idcontact) {
// idcontact es lo mismo que idcontacto solo que lamado desde la tabla accounts
            console.log("woams_contact_widget " + _idcontact);
            this.udc_contact.select(_idcontact);
         this.grid_phones.select({idcontact: _idcontact});
         this.grid_email.select({idcontact: _idcontact});
//this.EventsComments.load(_idcontact);
        },
        resize: function (s) {
          this.TC1.resize(s);
//this.GridPhones.resize(s);
//	this.C2.resize();
        },
update: function(){
this.udc_contact.update();
}




















    });
});
