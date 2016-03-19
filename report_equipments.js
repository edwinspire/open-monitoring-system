/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */
require(["dojo/ready",
], function (ready) {
    ready(function () {
        // logic that requires that Dojo is fully initialized should go here

        dijit.byId('idTitulo1').set('label', 'EQUIPOS');
        var mh = dijit.byId('id_mh');
        var g1 = dijit.byId('wequipments');
       g1.create_grid_view_equipments();
//g1.startup();
//g1.resize();

        mh.on("sse_onchanged_table", function (e) {
            // console.log(e);
   //         if (e.table_name == "events") {
     //           g1.load();
       //     }

        });

        /*
         dijit.byId('idTitulo2').set('label', 'EXTENSIONES DE ASISTENCIA');
         dijit.byId('idTitulo3').set('label', 'TECNICOS DE REDES');
         dijit.byId('idTitulo4').set('label', 'TECNICOS ASIGNADOS');
         */


    });
});
