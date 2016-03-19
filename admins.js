/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */
require(["dojo/ready", 'dojo/on', 'dojo/dom-style', 'oams/grid_structures/view_admins',], function (ready, on, domStyle, sgcontacts) {
    ready(function () {

dijit.byId('idTitle').set("label", "Colaboradores");
        var bc = dijit.byId('BContainer');
        var mh = dijit.byId('idMenuHeader');
        var g1 = dijit.byId('gridx_account_view');
        var a1 = dijit.byId('id_account_widget');

      var stcontacts = new sgcontacts();
            var sg1 = stcontacts.structure;

            g1.Url = "/oams_php_query/admins_view_grid.php";
            g1.set("structure", [{field: "unique_id", name: "#", width: '35px'},
                sg1.enabled.r, sg1.admin_name.r, sg1.identification.r
            ]);

   //     g1.create_grid(0);

        mh.on("sse_onchanged_table", function (e) {
            ////   console.log(e);
            if (e.table_name == "accounts" || e.table_name == "contacts") {
                g1.load();
            }

        });

        g1.on('onitemclick', function (e) {
//console.log(e.idcontact);
//console.warn(e);
            a1.load(e.item.idcontact);
        });





    });
});
