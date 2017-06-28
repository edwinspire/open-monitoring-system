// Dojo 1.7+ (AMD)
"dojo/promise/all"
require(["dojo/_base/lang", "api/scheduled_tasks/scheduled_tasks",   "dojo/Deferred", "dojo/_base/array", "dojo/promise/all", "dojo/on",  "dojo/node!mssql", "dojo/date"], function(lang, Octopus, Deferred, array, all, on, mssql, DojoDate){
	lang.extend(Octopus, {
/////////////////////////////////////////
run_mssql_uptime: function(task){

	var deferred = new Deferred();
	var t = this;
	var name_event = 'run_mssql_uptime'+(new Date()).getTime()+ Math.random().toString().replace('.', '_');
	var devicesProcceced = 0;

	t.getNetworkDevices().then(function(devices){

		var totalDevices = devices.rows.length;

		var signal = t.on(name_event, function(r){

			devicesProcceced ++;

			if(r.valid){
				t.send_event_pg(r.result, []).then(function(result){
				}, function(err){
				//console.log(err);
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
		connectionTimeout: 60000,
		requestTimeout: 60000
    //options: {
      // encrypt: true
  //}
}

mssql.connect(config).then((cnx) => {

	return new mssql.Request(cnx).query(srtquery)
}).then((result, error)  => {

	if(error){
		deferred.resolve({idequipment: param.idequipment, ideventtype: param.parameters.ideventtype_on_no_connect, details: {Error: error, Task: 'run_mssql_uptime'}});  
	}else{
		var ideventtype = param.parameters.ideventtype_under_threshold;
		if(result.length > 0){

			if(result[0].uptime > param.parameters.max_threshold_uptime){
				ideventtype = param.parameters.ideventtype_on_threshold;
			}

			var dateStart = DojoDate.add(new Date(), "hour", result[0].uptime*-1);
			var details = result[0];
			details['ip'] = param.ip;

			var r = {idequipment: param.idequipment, ideventtype: ideventtype, description: +DojoDate.difference(dateStart, new Date(), "day")+' horas.', details: details};
			deferred.resolve(r);

		}else{
			deferred.reject({});
		} 
	}  	
}).catch(err => {
	//console.log(err, param);
	deferred.resolve({idequipment: param.idequipment, ideventtype: param.parameters.ideventtype_on_no_connect, details: {Error: err, Task: 'run_mssql_uptime'}});  
})

mssql.on('error', err => {
	//console.log(err, param);
	deferred.resolve({idequipment: param.idequipment, ideventtype: param.parameters.ideventtype_on_no_connect, details: {Error: err, Task: 'run_mssql_uptime'}});  
});

return deferred.promise;
}




});
});

