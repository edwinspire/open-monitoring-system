/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */
require(["dojo/ready",
], function (ready) {
    ready(function () {
        // logic that requires that Dojo is fully initialized should go here

     //   dijit.byId('idTitulo1').set('label', 'MONITOR DE EVENTOS');
     //   var mh = dijit.byId('id_mh');
        var g1 = dijit.byId('tabla_datos');
   //     g1.create_grid(3);
//g1.startup();
//g1.resize();
g1.select();

//console.log(dijit.byId('xxx123'));

setInterval(function(){ g1.select(); }, 15000);
//setTimeout(g1.select(), 15000);


        /*
         dijit.byId('idTitulo2').set('label', 'EXTENSIONES DE ASISTENCIA');
         dijit.byId('idTitulo3').set('label', 'TECNICOS DE REDES');
         dijit.byId('idTitulo4').set('label', 'TECNICOS ASIGNADOS');
         */


    });
});
