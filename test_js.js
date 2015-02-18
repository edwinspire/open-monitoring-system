/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */
require(["dojo/ready",
"dojo/query", "dojo/_base/array", "jspire/request/uHTTPDataSource"], function(ready, query, array, ds){
     ready(function(){
         // logic that requires that Dojo is fully initialized should go here


var dt = dojo.byId('test');
var dtx = dijit.byId('sd');

var data = new ds();
data.url_load = "test_js.json";

data.name_document('db1');


dojo.connect(data, 'onLoad', function(){
console.log('Cargado');
})

setTimeout(function(){
data.load(1);
}, 5000);



     });
});
