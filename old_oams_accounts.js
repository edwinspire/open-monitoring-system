/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */
require(["dojo/ready", 'dojo/on', 'dojo/dom-style','oams/grid_structures/view_accounts'], function(ready, on, domStyle, sgaccounts){
     ready(function(){

var bc = dijit.byId('BContainer');
var mh = dijit.byId('idMenuHeader');
var g1 = dijit.byId('gridx_account_view');
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



//g1.load();




         

     });
});
