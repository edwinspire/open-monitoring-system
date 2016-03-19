/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */
require(["dojo/ready", 'dojo/on', 'dojo/dom-style', 'oams/grid_structures/view_events_monitor'], function(ready, on, domStyle, gsViewMonitor){
     ready(function(){

dijit.byId('idTitulo1').set('label', 'DIVISIONES');
var mh = dijit.byId('id_mh');
var g1 = dijit.byId('id_gridx_divisions');

        dijit.byId('narea').on("sse_onchanged_table", function (e) {
            //  console.log(e);
            if (e.table_name == "divisions") {
                g1.select();
            }

        });


        g1.on("onclicknew", function (e) {
            ////   console.log(e);
            if (e.table_name == "divisions") {
                g1.select();
            }

        });

        g1.on("onupdate", function (e) {
		g1.select();
        });


setTimeout(function(){
g1.select();
window.notification_area({message: 'Notificacion de prueba'});
}, 2000);






         

     });
});
