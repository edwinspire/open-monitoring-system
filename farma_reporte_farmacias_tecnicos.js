/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */
require(["dojo/ready", 'dojo/on', 'dojo/dom-style', 'oams/grid_structures/view_accounts_oams_assigned'], function(ready, on, domStyle, gsView){
     ready(function(){

dijit.byId('idTitulo1').set('label', 'REPORTE FARMACIAS - TECNICOS');
var mh = dijit.byId('id_mh');
var g1 = dijit.byId('id_gridx_event_monitor');



            var stvm = new gsView();

            var sg1 = stvm.structure;

sg1.priority.r.class = function (cell) {
                        return color_class_priority(cell.data());
                    }

sg1.priority.w.class = function (cell) {
                        return color_class_priority(cell.data());
                    }


function color_class_priority (n) {
            var b;
            try {
                b = 'levelbg' + n;
            } catch (error) {
                b = '';
            }
//console.log(b);
            return b;
        }

//console.log(sg1);

            g1.Url = "oams_php_query/report_view_accounts_oams_assigned.php";
            g1.set("structure", [{field: "unique_id", name: "#", width: '35px'},
                sg1.account.r, sg1.enabled.r, sg1.account_name.r, sg1.address.r, sg1.contact_name.r
            ]);

/*
mh.on("sse_onchanged_table", function(e){
   // console.log(e);
//console.log("vamos "+e.table_name);
    if(e.table_name.indexOf("events") == 0){
            g1.load({});
    }
    
});
*/



setTimeout(function(){
            g1.load({});
}, 2000);






         

     });
});
