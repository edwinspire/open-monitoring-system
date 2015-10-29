/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */
require(["dojo/ready", 'dojo/on', 'dojo/dom-style',], function(ready, on, domStyle){
     ready(function(){

var bc = dijit.byId('BContainer');
var mh = dijit.byId('idMenuHeader');
var g1 = dijit.byId('gridx_account_view');
var a1 = dijit.byId('id_account_widget');

mh.on("sse_onchanged_table", function(e){
 ////   console.log(e);
    if(e.table_name == "accounts"){
g1.load();
    }
    
});

g1.on('onitemclick', function(e){
//console.log(e.idcontact);
a1.load(e.idcontact);
});
         
      
 
         

     });
});
