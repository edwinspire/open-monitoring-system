// Dojo 1.7+ (AMD)
"dojo/promise/all"
require(["dojo/_base/lang", "api/scheduled_tasks/scheduled_tasks",   "dojo/Deferred", "dojo/_base/array", "dojo/promise/all", "dojo/on",  "dojo/node!mssql"], function(lang, Octopus, Deferred, array, all, on, mssql){
	lang.extend(Octopus, {
/////////////////////////////////////////
run_mssql_uptime: function(task){

	var deferred = new Deferred();
	var t = this;
	var name_event = 'run_mssql_uptime'+(new Date()).getTime()+ Math.random().toString().replace('.', '_');
	var devicesProcceced = 0;

	t.getNetworkDevices().then(function(devices){

		var totalDevices = devices.rows.length;

		console.log('TOTAL DE EQUIPOS:  '+totalDevices);

		var signal = t.on(name_event, function(r){

			devicesProcceced ++;

			//console.log(devicesProcceced +' de ' +totalDevices, r);

			if(r.valid){
				t.send_event_pg(r.result, []).then(function(result){
				//deferred.resolve(param.ip);
			}, function(err){
				console.log(err);
				//deferred.resolve(err);    			
			});
			}

			if(devicesProcceced == totalDevices){
				console.log('run_mssql_uptime Completado');
				signal.remove();
				deferred.resolve(true);
			}
		});

		array.forEach(devices.rows, function(device, i){

			if(device.ip && device.ip.length > 0){
				var param = device;
				param.parameters = task.task_parameters;
				t._run_mssql_uptime_check(param, i).then(function(result){
					t.emit(name_event, {result: result, valid: true});
				}, function(error){
					t.emit(name_event, {result: error, valid: false});
				});
			}else{
				t.emit(name_event, "IP empty");
			}

		});


	});

	return deferred.promise;
},
_run_mssql_uptime_check: function(param){
	
	var deferred = new Deferred();
	var t = this;
	var srtquery = "SELECT DATEDIFF(MINUTE, login_time, CURRENT_TIMESTAMP) AS 'uptime' FROM sys.sysprocesses WHERE spid = 1;";

	var config = {
		user: param.username,
		password: param.pwd,
		server: param.ip, 
		database: 'msdb',
    //requestTimeout: 3000,
    options: {
      // encrypt: true
  }
}

mssql.connect(config).then((cnx) => {

	return new mssql.Request(cnx).query(srtquery)
}).then((result, error)  => {
	//console.dir(result, error);
	if(error){
		deferred.reject(error);
	}else{
		var ideventtype = param.parameters.ideventtype_under_threshold;
		if(result.length > 0){

			if(result[0].uptime > param.parameters.max_threshold_uptime){
				ideventtype = param.parameters.ideventtype_on_threshold;
			}

			var r = {idequipment: param.idequipment, ideventtype: ideventtype, description: '', details: result[0]};
			deferred.resolve(r);

		}else{
			deferred.reject(0);
		} 
	}  	
}).catch(err => {
	deferred.resolve({idequipment: param.idequipment, ideventtype: param.parameters.ideventtype_on_no_connect, details: err});  
})

mssql.on('error', err => {
deferred.resolve({idequipment: param.idequipment, ideventtype: param.parameters.ideventtype_on_no_connect, details: err});  
});

return deferred.promise;
}




});
});

