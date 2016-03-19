define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!woams_account_widget/woams_account_widget.php',
    'oams/grid_structures/view_account_contacts',
    'oams/grid_structures/view_account_users',
    'oams/grid_structures/equipments',
    'oams/grid_structures/network_devices',
    'dijit/ConfirmTooltipDialog',
    'dijit/popup',
    "oams/request/dbTuple",
    'oams/grid_structures/view_contact_groups_they_belong',
    'woams_contact_form/woams_contact_form',
    'woams_equipments_gridx/woams_equipments_gridx',
    'woams_account_form/woams_account_form',
    'woams_events_comments/woams_events_comments',
    "woams_common_gridx/woams_common_gridx",
    "woams_contact_widget/woams_contact_widget",
    "woams_divisions_list/woams_divisions_list"
], function (declare, _Widget, _Templated, templateString, gsContacts, gsUsers, gsEquipments, gsNetworkDevices, CTtD, popup, dbT, gsContactsGroups) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
	 _tuple_equipment: new dbT(),
         _tuple_network_device: new dbT(),
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
            
/*--  --*/
		t._tuple_network_device = new dbT();
            t._tuple_network_device.url = 'oams_php_query/account_network_device.php';
            t._tuple_network_device.name_id_field = 'idaccount';
            t._tuple_network_device.bind_fields('woams_account_network_device_tuple', t.CttdNewNetworkDevice.domNode);
            t._tuple_network_device.on("onInsert", function (d) {
                popup.close(t.CttdNewNetworkDevice);
 		t.GridAccountNetworkDevices.load({idaccount: t.AccountForm.idaccount.get("value")});
            });


//*****************************************//

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
t._set_map(e.data.idcontact);
            });

            t.AccountForm.on('onsave', function (e) {
 t.T1.set("label", e.data.last_name + " " + e.data.first_name);
//t._set_map(e.data.geox, e.data.geoy);
t._set_map(e.data.idcontact);

            });

            t.AccountForm.on('ondelete', function () {
//t.T1.set("label", t.AccountForm._tuple._data.last_name+" "+t.AccountForm._tuple._data.first_name);
            });


//*********************************************//

            t.new_equipment.on('Click', function () {
t._tuple_equipment.clear();
t.new_equipment_idaccount.set('value', t.AccountForm.idaccount.get("value"));
//alert(t.AccountForm.idaccount.get("value"));
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

//************************************************//

            t.delete_equipment_selection.on('Click', function () {
                popup.open({
                    popup: t.CttdDeleteEquipments,
                    around: t.delete_equipment_selection.domNode
                });
            });

t.CttdDeleteEquipments.on('Execute', function(e){
 t.GridAccountEquipments.send_selected_ids('delete_selection');
});

t.CttdDeleteEquipments.on('Cancel', function(e){
 popup.close(t.CttdDeleteEquipments);
});


//
////*********************************************//

            t.new_network_device.on('Click', function () {
t._tuple_network_device.clear();
t.new_network_device_idaccount.set('value', t.AccountForm.idaccount.get("value"));
                popup.open({
                    popup: t.CttdNewNetworkDevice,
                    around: t.new_network_device.domNode
                });
            });

t.CttdNewNetworkDevice.on('Execute', function(e){
 t._tuple_network_device.insert();
});

t.CttdNewNetworkDevice.on('Cancel', function(e){
 popup.close(t.CttdNewNetworkDevice);
});

//************************************************//

            t.delete_network_device_selection.on('Click', function () {
                popup.open({
                    popup: t.CttdDeleteNetworkDevice,
                    around: t.delete_network_device_selection.domNode
                });
            });

t.CttdDeleteNetworkDevice.on('Execute', function(e){
 t.GridAccountNetworkDevices.send_selected_ids('delete_selection');

});

t.CttdDeleteNetworkDevice.on('Cancel', function(e){
 popup.close(t.CttdDeleteNetworkDevice);
});


//*******************************************************//
            var stcontacts = new gsContacts();
            var sg1 = stcontacts.structure;

            var stusers = new gsUsers();
            var sg2 = stusers.structure;


            var steq = new gsEquipments();
            var sg3 = steq.structure;

            var stneq = new gsNetworkDevices();
            var sg4 = stneq.structure;

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
                sg3.code_ref.w, sg3.description.w, sg3.equipment.w, sg3.mark.w, sg3.model.w, sg3.serial_number.w, sg3.note.w
            ], true);


            t.GridAccountEquipments.on('onsendselectedids', function (e) {
              // console.warn(e);
		popup.close(t.CttdDeleteEquipments);
		t.GridAccountEquipments.load({idaccount: t.AccountForm.idaccount.get("value")});
            });

            t.GridAccountEquipments.on('onupdaterowonserver', function (e) {
           //    console.warn(e);
		t.GridAccountEquipments.load({idaccount: t.AccountForm.idaccount.get("value")});
            });


//*********************************//
            t.GridAccountNetworkDevices.Url = "oams_php_query/account_network_device.php";
            t.GridAccountNetworkDevices.set("autoupdaterow", true);
		t.GridAccountNetworkDevices.set("idnamefield", 'idequipment');
            t.GridAccountNetworkDevices.set("structure", [{field: "unique_id", name: "#", width: '35px'},
                sg4.code_ref.w, sg4.description.w, sg4.equipment.w, sg4.mark.w, sg4.model.w, sg4.serial_number.w, sg4.ip.w, sg4.mac.w, sg4.username.w, sg4.pwd.w, sg4.monitored.w, sg4.note.w
            ], true);


            t.GridAccountNetworkDevices.on('onsendselectedids', function (e) {
              // console.warn(e);
		popup.close(t.CttdDeleteNetworkDevice);
		t.GridAccountNetworkDevices.load({idaccount: t.AccountForm.idaccount.get("value")});
            });

            t.GridAccountNetworkDevices.on('onupdaterowonserver', function (e) {
           //    console.warn(e);
		t.GridAccountNetworkDevices.load({idaccount: t.AccountForm.idaccount.get("value")});
            });




            t.GridAccountContacts.on('onitemclick', function (e) {
               // console.warn(e);
                t.AccountContactsx.load(e.item.idcontact);
            });



            t.GridAccountUsers.on('onitemclick', function (e) {
              //  console.warn(e);
                t.AccountUser.load(e.item.idcontact);
            });


///*** ***///
            var stcg = new gsContactsGroups();
            var sg4 = stcg.structure;

      t.GridGroups.set("autoupdaterow", true);
		t.GridGroups.set("idnamefield", 'idcontact');
            t.GridGroups.Url = "oams_php_query/view_contact_groups.php";
            t.GridGroups.set("structure", [{field: "unique_id", name: "#", width: '35px'},
                sg4.ismember.w, sg4.name.r, sg4.description.r
            ]);

t.GridGroups.on('onupdaterowonserver', function(e){
//t.load(this._idcontact); //TODO
});


        },
        load: function (_idaccount) {
// idaccount es lo mismo que idcontacto solo que lamado desde la tabla accounts
       //     console.log("woams_account_widget " + _idaccount);
            this.AccountForm.load_form(_idaccount);
		this._set_map(_idaccount);
            this.GridGroups.load({idcontact: _idaccount});
            this.GridAccountContacts.load({idaccount: _idaccount});
            this.GridAccountUsers.load({idaccount: _idaccount});
            this.GridAccountEquipments.load({idaccount: _idaccount});
            this.GridAccountNetworkDevices.load({idaccount: _idaccount});
        //    this.EventsComments.load(_idaccount);
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
iframemap = '<iframe  src="oams_map.php?idcontact='+idaccount+'&maptype=1"  frameBorder="0" frameborder="0"  seamless="seamless"></iframe> ';
}
//console.warn(iframemap);
t.ContainerMap.set("content", iframemap);
}
	



















    });
});
