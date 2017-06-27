// Dojo 1.7+ (AMD)
"dojo/promise/all"
require(["dojo/_base/lang", "api/scheduled_tasks/scheduled_tasks",   "dojo/Deferred", "dojo/_base/array", "dojo/promise/all", "dojo/on",  "dojo/node!mssql", "dojo/date"], function(lang, Octopus, Deferred, array, all, on, mssql, dojoDate){
	lang.extend(Octopus, {
/////////////////////////////////////////
run_mssql_CURRENT_TIMESTAMP: function(task){

	var deferred = new Deferred();
	var t = this;
	var name_event = 'run_mssql_CURRENT_TIMESTAMP'+(new Date()).getTime()+ Math.random().toString().replace('.', '_');
	var devicesProcceced = 0;

	t.getNetworkDevices().then(function(devices){

		var totalDevices = devices.rows.length;

		var signal = t.on(name_event, function(r){

			devicesProcceced ++;

			if(r.valid){
				t.send_event_pg(r.result, []).then(function(result){
				//deferred.resolve(param.ip);
			}, function(err){
//				console.log(err);
});
			}

			if(devicesProcceced == totalDevices){
				signal.remove();
				deferred.resolve(true);
			}
		});

		array.forEach(devices.rows, function(device, i){

			if(device.ip && device.ip.length > 0){
				var param = device;
				param.parameters = task.task_parameters;
				t._run_mssql_CURRENT_TIMESTAMP_check(param, i).then(function(result){
					t.emit(name_event, {result: result, valid: true});
				}, function(error){
					//console.log(error);
					t.emit(name_event, {result: error, valid: false});
				});
			}else{
				t.emit(name_event, "IP empty");
			}

		});


	});

	return deferred.promise;
},
_run_mssql_CURRENT_TIMESTAMP_check: function(param){
	
	var deferred = new Deferred();
	var t = this;
	var srtquery = "SELECT GETUTCDATE() as tsz;";

	var config = {
		user: param.username,
		password: param.pwd,
		server: param.ip, 
		database: 'msdb',
		connectionTimeout: 30000,
		requestTimeout: 30000
    //options: {
      // encrypt: true
  //}
}

mssql.connect(config).then((cnx) => {

	return new mssql.Request(cnx).query(srtquery)
}).then((result, error)  => {
	
	if(error){
		deferred.resolve([{idequipment: param.idequipment, ideventtype: param.parameters.ideventtype_on_no_connect, details: {Error: error, Task: 'run_mssql_CURRENT_TIMESTAMP'}}]);  
	}else{
		var ideventtype = param.parameters.ideventtype_under_threshold;
		if(result.length > 0){

			if(Math.abs(dojoDate.difference(new Date(), result[0].dt, 'seconds')) > param.parameters.max_threshold_seconds){
				ideventtype = param.parameters.ideventtype_on_threshold;
			}
			var details = result[0];
			details['ip'] = param.ip;
			var r = {idequipment: param.idequipment, ideventtype: ideventtype, description: '', details: details};
			deferred.resolve(r);

		}else{
			deferred.reject(0);
		} 
	}  	
}).catch(err => {
	deferred.resolve([{idequipment: param.idequipment, ideventtype: param.parameters.ideventtype_on_no_connect, details: {Error: err, Task: 'run_mssql_CURRENT_TIMESTAMP'}}]);  
})

mssql.on('error', err => {
	console.log(err);
	deferred.resolve([{idequipment: param.idequipment, ideventtype: param.parameters.ideventtype_on_no_connect, details: {Error: err, Task: 'run_mssql_CURRENT_TIMESTAMP'}}]);  
});


return deferred.promise;
}




});
});

