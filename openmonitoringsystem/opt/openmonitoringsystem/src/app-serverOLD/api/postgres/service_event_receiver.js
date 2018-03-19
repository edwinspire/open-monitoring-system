// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms", "dojo/_base/array", "dojo/Deferred"], function(lang, OMS, array, Deferred){
	lang.extend(OMS, {
/////////////////////////////////////////
service_event_receiver: function(DeviceKey, events){
	var deferred = new Deferred();

	this.query("SELECT services.fun_event_receiver($1::TEXT, $2::JSON);", [DeviceKey, JSON.stringify(events)]).then(function(results){

		var r = {Return: [], Message: ''};
		try{
			if(results.rows.length > 0 && results.rows[0].fun_receiver_json){
				r.Return = results.rows[0].fun_receiver_json;
			}
		}catch(error){
			console.trace(error);
		}
		
		deferred.resolve(r);
				///////////
			}, function(error){
				console.trace(error);
				deferred.reject(error);
			});

	return deferred.promise;
}  



});
});