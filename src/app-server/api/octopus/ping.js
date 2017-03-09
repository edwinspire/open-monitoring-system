// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms",  "api/octopus/octopus",   "dojo/node!net-ping"], function(lang, OMS, Octopus, Ping){
  lang.extend(Octopus, {
/////////////////////////////////////////

ping: function(host){

var t = this;

var session = Ping.createSession ();

session.pingHost (host, function (error, target) {
    if (error)
        console.log (target + ": " + error.toString ());
    else
        console.log (target + ": Alive");
});


}              
        
        
  });
});
