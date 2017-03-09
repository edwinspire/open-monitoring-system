require(["dojo/request",
	"dojo/on", 
	"dojo/_base/array", 
	"dojo/node!crypto",
	"dojo/node!path", 
	"dojo/node!fs", 
	"dojo/node!path-to-regexp", 
	"dojo/node!pg", 
	"dojo/node!compression", 
	"dojo/node!mssql", 
	"dojo/node!nodemailer",
	"api/postgres/oms", 
	"dojox/encoding/digests/MD5", 
	"dstore/Memory",
	"api/config", 
  "api/octopus/octopus", 
  "api/octopus/ping", 
	"dojo/promise/all"
	], function(request, on, array, crypto, path, fs, pathToRegexp, pG, compression, mssql, nodeMailer, pgOMS, MD5, Memory, Config, Octopus, all){

console.log("Inicia Octopus");



var oc = new Octopus();
Run();

setTimeout(function(){
Run();
}, 300000);



function Run(){
oc.getNetworkDevices().then(function(devices){
console.log(devices.rows);

array.forEach(devices.rows, function(device){
oc.ping(device.ip);
});




});

}
//process.exit();


});







