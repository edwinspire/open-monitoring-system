/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */
require(["dojo/ready",
"dojo/query", "dojo/_base/array", "jspire/request/uHTTPDataSource"], function(ready, query, array, ds){
     ready(function(){
         // logic that requires that Dojo is fully initialized should go here


var data = new ds();
data.url = "test_js.json";
data.load(0);
dojo.connect(data, 'onLoad', function(){
console.log('Cargado');
})

console.log(data.data_);
setTimeout(function(){
console.log(data.data_);
}, 2000);



     });
});
