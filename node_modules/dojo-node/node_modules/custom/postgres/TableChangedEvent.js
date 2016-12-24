/*
// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "custom/postgres/oms"], function(lang, OMS){
  lang.extend(OMS, {

udc_check_ts_tv: function(){
var t = this;
console.log('udc_check_ts_tv');
var interv = setInterval(function(){
this.query("SELECT table_name, ts FROM sys_table_ts;", []).then(function(result){
	console.log(result);
	//t.emit("result", result);
});
}, 1500);

return true;
}              
        
        
  });
});
*/
