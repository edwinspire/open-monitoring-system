/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */
require(["dojo/ready", 'dojo/on', 'dojo/dom-style'], function(ready, on, domStyle){
     ready(function(){

dijit.byId('idTitulo1').set('label', 'MONITOR DE EVENTOS');
var g1 = dijit.byId('grid_view_monitor');


g1.select();

setTimeout(function(){
g1.select();
}, 3000);       

     });
});
