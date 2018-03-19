// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/octopus/octopus",   "dojo/node!ping", "dojo/Deferred"], function(lang, Octopus, Ping, Deferred){
	lang.extend(Octopus, {
/////////////////////////////////////////
_ping: function(host){
	var deferred = new Deferred();
	var t = this;

	if(host){

		try{
			Ping.promise.probe(host).then(function(isAlive){
				deferred.resolve(isAlive);
			});
		}catch(error){
			deferred.reject(error);
		}

	}else{
		deferred.reject('Invalid Host '+host);
	}	

	return deferred.promise;
},
ping: function(task){
	var host = task.ip || '';
	var deferred = new Deferred();
	var t = this;

	t._ping(host).then(function(isAlive){

		var event = {idequipment: task.idequipment, ideventtype: task.parameters.ideventtype_online, description: task.ip, details: {ip: task.ip, roundtriptime: parseInt(isAlive.avg)}};

		if(task.parameters && task.parameters.max_threshold_roundtriptime && event.roundtriptime >= task.parameters.max_threshold_roundtriptime){
			event.ideventtype = task.parameters.ideventtype_over_threshold;
		}

		if(!isAlive.alive){
			event.ideventtype = task.parameters.ideventtype_offline;
		}

		t.send_event_pg(event, []).then(function(result){
			var ReturnData = {pg: result, ping: isAlive};
			deferred.resolve(ReturnData);
		});
	}, function(error){
		deferred.reject(error);
	});

	return deferred.promise;
}




});
});

