define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!woams_account_widget/woams_account_widget.html',
    'oams/grid_structures/view_account_contacts',
    'oams/grid_structures/view_account_users',
    'oams/grid_structures/equipments',
    'dijit/ConfirmTooltipDialog',
    'dijit/popup',
    "oams/request/dbTuple",
"dojo/dom-attr",
    'dojo/dom-style',
    'woams_contact_form/woams_contact_form',
    'woams_equipments_gridx/woams_equipments_gridx',
    'woams_account_form/woams_account_form',
    'woams_events_comments/woams_events_comments',
    "woams_common_gridx/woams_common_gridx",
    "woams_contact_widget/woams_contact_widget"
], function (declare, _Widget, _Templated, templateString, gsContacts, gsUsers, gsEquipments, CTtD, popup, dbT, domStyle, domAttr) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
	 _tuple_equipment: new dbT(),
	 _tuple_new_account: new dbT(),
        postCreate: function () {
            var t = this;

/*--  --*/
		t._tuple_equipment = new dbT();
            t._tuple_equipment.url = 'oams_php_query/account_equipments.php';
            t._tuple_equipment.name_id_field = 'idaccount';
            t._tuple_equipment.bind_fields('woams_account_equipment_tuple', t.CttdNewEquipment.domNode);
            t._tuple_equipment.on("onInsert", function (d) {
                popup.close(t.CttdNewEquipment);
 		t.GridAccountEquipments.load({idaccount: t.AccountForm.idaccount.get("value")});
            });

/*--  --*/
		t._tuple_new_account = new dbT();
            t._tuple_new_account.url = 'oams_php_query/account_tuple.php';
            t._tuple_new_account.name_id_field = 'idaccount';
            t._tuple_new_account.bind_fields('woams_account_widget_new_account', t.CttdNewAccount.domNode);
            t._tuple_new_account.on("onInsert", function (d) {
                popup.close(t.CttdNewAccount);
 		//t.GridAccountEquipments.load({idaccount: t.AccountForm.idaccount.get("value")});
            });



            t.T1.set("label", "Abonado");
            t.Menu.on("onsave", function () {
                t.AccountForm.save_form();
            });
            t.Menu.on("onnew", function () {

                popup.open({
                    popup: t.CttdNewAccount,
                    around: t.Menu.new.domNode
                });
               // t.AccountForm.reset_form();
            });

t.CttdNewAccount.on('Cancel', function(e){
 popup.close(t.CttdNewAccount);
});

t.CttdNewAccount.on('Execute', function(e){
    t._tuple_new_account.insert();
});


            t.Menu.on("ondelete", function () {
                t.AccountForm.delete_form();
            });

            t.AccountForm.on('onload', function (e) {
 t.T1.set("label", e.data.last_name + " " + e.data.first_name);         
//  t._set_map(e.data.geox, e.data.geoy); 
t._set_map(e.data.idcontact);
/* t.ContainerMap.set("content", '<iframe  data-dojo-attach-point="AccountMap" src="oams_map.php?idaccount='+e.data.idcontact+'"  frameBorder="0" frameborder="0"  seamless="seamless"></iframe> '); */
            });

            t.AccountForm.on('onsave', function (e) {
 t.T1.set("label", e.data.last_name + " " + e.data.first_name);
//t._set_map(e.data.geox, e.data.geoy);
t._set_map(e.data.idcontact);

            });

            t.AccountForm.on('ondelete', function () {
//t.T1.set("label", t.AccountForm._tuple._data.last_name+" "+t.AccountForm._tuple._data.first_name);
            });


            t.new_equipment.on('Click', function () {
t._tuple_equipment.clear();
t.idaccount.set('value', t.AccountForm.idaccount.get("value"));
                popup.open({
                    popup: t.CttdNewEquipment,
                    around: t.new_equipment.domNode
                });
            });

t.CttdNewEquipment.on('Execute', function(e){
 t._tuple_equipment.insert();
});

t.CttdNewEquipment.on('Cancel', function(e){
 popup.close(t.CttdNewEquipment);
});


            t.delete_selection.on('Click', function () {
                popup.open({
                    popup: t.CttdDeleteEquipments,
                    around: t.delete_selection.domNode
                });
            });

t.CttdDeleteEquipments.on('Execute', function(e){
 t.GridAccountEquipments.send_selected_ids('delete_selection');
});

t.CttdDeleteEquipments.on('Cancel', function(e){
 popup.close(t.CttdDeleteEquipments);
});


            var stcontacts = new gsContacts();
            var sg1 = stcontacts.structure;

            var stusers = new gsUsers();
            var sg2 = stusers.structure;


            var steq = new gsEquipments();
            var sg3 = steq.structure;

            t.GridAccountContacts.Url = "oams_php_query/account_contacts_grid.php";
            t.GridAccountContacts.set("structure", [{field: "unique_id", name: "#", width: '35px'},
                sg1.contact_name.r, sg1.identification.r, sg1.appointment.r
            ]);

            t.GridAccountUsers.Url = "oams_php_query/account_users_grid.php";
            t.GridAccountUsers.set("structure", [{field: "unique_id", name: "#", width: '35px'},
                sg2.user_name.r, sg2.identification.r, sg2.appointment.r, sg2.account_user.r, sg2.account_pwd.r
            ]);

            t.GridAccountEquipments.Url = "oams_php_query/account_equipments.php";
            t.GridAccountEquipments.set("autoupdaterow", true);
		t.GridAccountEquipments.set("idnamefield", 'idequipment');
            t.GridAccountEquipments.set("structure", [{field: "unique_id", name: "#", width: '35px'},
                sg3.code_ref.w, sg3.description.w, sg3.equipment.w, sg3.mark.r, sg3.model.w, sg3.serial_number.w 
            ]);


            t.GridAccountEquipments.on('onsendselectedids', function (e) {
              // console.warn(e);
		popup.close(t.CttdDeleteEquipments);
		t.GridAccountEquipments.load({idaccount: t.AccountForm.idaccount.get("value")});
            });

            t.GridAccountEquipments.on('onupdaterowonserver', function (e) {
           //    console.warn(e);
		t.GridAccountEquipments.load({idaccount: t.AccountForm.idaccount.get("value")});
            });


            t.GridAccountContacts.on('onitemclick', function (e) {
               // console.warn(e);
                t.AccountContactsx.load(e.item.idcontact);
            });



            t.GridAccountUsers.on('onitemclick', function (e) {
              //  console.warn(e);
                t.AccountUser.load(e.item.idcontact);
            });



        },
        load: function (_idaccount) {
// idaccount es lo mismo que idcontacto solo que lamado desde la tabla accounts
            console.log("woams_account_widget " + _idaccount);
            this.AccountForm.load_form(_idaccount);
            this.GridAccountContacts.load({idaccount: _idaccount});
            this.GridAccountUsers.load({idaccount: _idaccount});
            this.GridAccountEquipments.load({idaccount: _idaccount});
            this.EventsComments.load(_idaccount);
		this._set_map(_idaccount);
        },
        resize: function (s) {
            this.TC1.resize();
            this.C2.resize();
            this.EventsComments.resize();
        },
	_set_map: function(idaccount){
var t = this;
var iframemap = '';

if(idaccount){
iframemap = '<iframe  src="oams_map.php?idaccount='+idaccount+'"  frameBorder="0" frameborder="0"  seamless="seamless"></iframe> ';
/*
var iframemap = '<iframe seamless="seamless" frameborder="0" src="http://www.openstreetmap.org/export/embed.html?bbox='+y+'%2C'+x+'%2C'+y+'%2C'+x+'&amp;layer=mapnik&amp;marker='+x+'%2C'+y+'"></iframe><small><a style="float: right; z-index: 9999;" href="http://www.openstreetmap.org/?mlat='+x+'&amp;mlon='+y+'#map=16/'+x+'/'+y+'">Ver en mapa externo</a></small>';
*/

}
console.warn(iframemap);
t.ContainerMap.set("content", iframemap);

/*
<iframe width="425" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="http://www.openstreetmap.org/export/embed.html?bbox='+y+'%2C'+x+'%2C'+y+'%2C'+x+'&amp;layer=mapnik&amp;marker='+x+'%2C'+y+'" style="border: 1px solid black"></iframe><br/><small><a href="http://www.openstreetmap.org/?mlat='+x+'&amp;mlon='+y+'#map=16/'+x+'/'+y+'">View Larger Map</a></small>
*/



/*
    t.ContainerMap.set("content", '<iframe class="woams_iframe_map" style="width: 100%; height; 100%;" data-dojo-attach-point="AccountMap" src="http://www.openstreetmap.org/?mlat='+x+'&mlon='+y+'#map=17/'+x+'/'+y+'"  frameBorder="0" frameborder="0"  seamless="seamless"></iframe> ');
*/
}
	



















    });
});
