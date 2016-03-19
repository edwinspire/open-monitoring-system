/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */
require(["dojo/ready", 'dojo/on', 'dojo/dom-style','oams/grid_structures/view_accounts'], function(ready, on, domStyle, sgaccounts){
     ready(function(){

var account_tab_container = dijit.byId('TabContainerAccount');

var g1 = dijit.byId('grid_view_accounts');
var udc_account_basic = dijit.byId("uDC_Account_Basic_Form");
var account_label_name = dojo.byId('account_name_label');
var account_lastname = dijit.byId('account_lastname_input');
var account_firtsname = dijit.byId('account_firtsname_input');
var idcontact_input = dijit.byId('account_input_idcontact');
var account_idcontact_label = dojo.byId('account_idcontact_label');

var account_map = dijit.byId("account_map");

var grid_account_groups = dijit.byId("account_groups_view");

var grid_view_account_contacts = dijit.byId('grid_view_account_contacts');
var contact_widget = dijit.byId('contact_widget');

var grid_view_account_users = dijit.byId('grid_view_account_users');
var user_widget = dijit.byId('user_widget');

var grid_account_equipments = dijit.byId('grid_account_equipments');
var grid_account_network_devices = dijit.byId('grid_account_network_devices');

        dijit.byId('narea').on("sse_onchanged_table", function (e) {
            
id = idcontact_input.get('value');
switch(e.table_name){
case "accounts":
g1.select();
break;
case "equipments":
grid_account_equipments.select({idaccount: id});
break;
case "network_devices":
grid_account_network_devices.select({idaccount: id});
break;
case "account_contacts":
grid_view_account_contacts.select({idaccount: id});
break;
case "account_users":
grid_view_account_users.select({idaccount: id});
break;

}

        });


// Carga la informacion segun el tab
function loadTab(_id, _idaccount){
switch(_id){
case 'account_tab_map':
var iframemap = '';
if(_idaccount){
iframemap = '<iframe  src="oams_map.php?idcontact='+_idaccount+'&maptype=1"  frameBorder="0" frameborder="0"  seamless="seamless"></iframe> ';
}
account_map.set("content", iframemap);
break;
case 'account_tab_groups':
grid_account_groups.select({idaccount: _idaccount});
break;
case 'account_tab_contacts':
grid_view_account_contacts.select({idaccount: _idaccount});
break;
case 'account_tab_users':
grid_view_account_users.select({idaccount: _idaccount});
break;
case 'account_tab_equipments':
grid_account_equipments.select({idaccount: _idaccount});
grid_account_network_devices.select({idaccount: _idaccount});
break;
}
}

g1.on('onitemclick', function(e){
//console.log(e);
udc_account_basic.select(e.item.idcontact);
});

grid_view_account_contacts.on('onitemclick', function(e){
//console.log(e);
contact_widget.select(e.item.idcontact);
});

grid_view_account_users.on('onitemclick', function(e){
//console.log(e);
user_widget.select(e.item.idcontact);
});


dijit.byId('account_save_button').on('Click', function(){
console.log('Ha presionado el boton guardar');
udc_account_basic.update();
contact_widget.update();
user_widget.update();
});


idcontact_input.on('Change', function(e){
account_label_name.innerHTML = account_lastname.get('value')+' '+account_firtsname.get('value');
account_idcontact_label.innerHTML = e;
loadTab(account_tab_container.selectedChildWidget.id, e);
});
	
account_tab_container.watch("selectedChildWidget", function(name, oval, nval){
 //   console.log("selected child changed from ", oval, " to ", nval);
//console.log(' Esta es el id '+nval.id);
loadTab(nval.id, idcontact_input.get('value'));
});







g1.select();




/*
var bc = dijit.byId('BContainer');
var mh = dijit.byId('idMenuHeader');

var a1 = dijit.byId('id_account_widget');

dijit.byId("T1").set("label", "ABONADOS");

      var staccounts = new sgaccounts();
            var sg1 = staccounts.structure;

            g1.Url = "/oams_php_query/accounts_view_list.php";
            g1.set("structure", [{field: "unique_id", name: "#", width: '35px'},
                sg1.enabled.r, sg1.account.r, sg1.account_name.r, sg1.address.r
            ]);


g1.on('onitemclick', function(e){
//console.log(e);
a1.load(e.item.idcontact);
});
         
     
mh.on("sse_onchanged_table", function(e){
//   console.log(e);
    if(e.table_name == "accounts"){
g1.load();
    }
    
}); 

*/

//g1.load();




         

     });
});
