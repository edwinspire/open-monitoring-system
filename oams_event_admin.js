/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */
require(["dojo/ready", 'dojo/on', 'dojo/dom-style',], function(ready, on, domStyle){
     ready(function(){

dijit.byId('idTitulo1').set('label', 'ADMINISTRADOR DE EVENTOS');
var mh = dijit.byId('id_mh');
var g1 = dijit.byId('id_gridx_event_monitor');
g1.create_grid(2);
//g1.startup();
//g1.resize();

mh.on("sse_onchanged_table", function(e){
   // console.log(e);
//console.log("vamos "+e.table_name);
    if(e.table_name.indexOf("events") == 0){
g1.load();
    }
    
});

 
         

     });
});
