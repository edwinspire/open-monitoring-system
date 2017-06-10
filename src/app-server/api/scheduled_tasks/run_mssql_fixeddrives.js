// Dojo 1.7+ (AMD)
"dojo/promise/all"
require(["dojo/_base/lang", "api/scheduled_tasks/scheduled_tasks",   "dojo/Deferred", "dojo/_base/array", "dojo/promise/all", "dojo/on",  "dojo/node!mssql", "dojo/date"], function(lang, Octopus, Deferred, array, all, on, mssql, dojoDate){
	lang.extend(Octopus, {
/////////////////////////////////////////
run_mssql_fixeddrives: function(task){

	var deferred = new Deferred();
	var t = this;
	var name_event = 'run_mssql_fixeddrives'+(new Date()).getTime()+ Math.random().toString().replace('.', '_');
	var devicesProcceced = 0;

	t.getNetworkDevices().then(function(devices){

		var totalDevices = devices.rows.length;

		console.log('TOTAL DE EQUIPOS:  '+totalDevices);

		var signal = t.on(name_event, function(r){

			devicesProcceced ++;

			array.forEach(r.result, function(event, i){

				if(r.valid){
					console.log(event);
					t.send_event_pg(event, []).then(function(result){
				//deferred.resolve(param.ip);
			}, function(err){
				console.log(err);
				//deferred.resolve(err);    			
			});
				}
			});



			if(devicesProcceced == totalDevices){
				console.log('run_mssql_fixeddrives Completado');
				signal.remove();
				deferred.resolve(true);
			}
		});

		array.forEach(devices.rows, function(device, i){

			if(device.ip && device.ip.length > 0){
				var param = device;
				param.parameters = task.task_parameters;
				t._run_mssql_fixeddrives_check(param, i).then(function(result){
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
_run_mssql_fixeddrives_check: function(param){
	
	var deferred = new Deferred();
	var t = this;
	var srtquery = "EXEC master..xp_fixeddrives;";

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

	if(error){
		deferred.reject([error]);
	}else{


		if(result.length > 0){

			var ResultEvents = [];

			array.forEach(result, function(item, i){



				if(item.drive && param.parameters[item.drive]){

					var driveMin = param.parameters[item.drive];
					var Megas = item["MB libres"] || item["MB free"];

					var r = {idequipment: param.idequipment, source: t.textToMD5(item.drive), ideventtype: param.parameters.ideventtype_over_min, description: '', valid: true};

					if(Megas  && Megas<=driveMin){
						r.ideventtype = param.parameters.ideventtype_under_min;
					}
					r.details = {drive: item.drive, MB: Megas};
					ResultEvents.push(r);
				}



			});

			deferred.resolve(ResultEvents); 

		}else{
			deferred.reject(0);
		}
	}  	
}).catch(err => {
	deferred.resolve([{idequipment: param.idequipment, ideventtype: param.parameters.ideventtype_on_no_connect, details: err}]);  
})

mssql.on('error', err => {
	//console.log(err);
	deferred.resolve([{idequipment: param.idequipment, ideventtype: param.parameters.ideventtype_on_no_connect, details: err}]);  
});

return deferred.promise;
}




});
});

