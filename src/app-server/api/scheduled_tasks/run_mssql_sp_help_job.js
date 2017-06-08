// Dojo 1.7+ (AMD)
"dojo/promise/all"
require(["dojo/_base/lang", "api/scheduled_tasks/scheduled_tasks",   "dojo/Deferred", "dojo/_base/array", "dojo/promise/all", "dojo/on",  "dojo/node!mssql", "dojo/date"], function(lang, Octopus, Deferred, array, all, on, mssql, dojoDate){
	lang.extend(Octopus, {
/////////////////////////////////////////
run_mssql_sp_help_job: function(task){

	var deferred = new Deferred();
	var t = this;
	var name_event = 'run_mssql_sp_help_job'+(new Date()).getTime()+ Math.random().toString().replace('.', '_');
	var devicesProcceced = 0;

	t.getNetworkDevices().then(function(devices){

		var totalDevices = devices.rows.length;

		console.log('TOTAL DE EQUIPOS:  '+totalDevices);

		var signal = t.on(name_event, function(r){

			devicesProcceced ++;

array.forEach(r.result, function(event, i){

		if(event.valid){
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
			console.log('run_mssql_sp_help_job Completado');
			signal.remove();
			deferred.resolve(true);
		}
	});

		array.forEach(devices.rows, function(device, i){

			if(device.ip && device.ip.length > 0){
				var param = device;
				param.parameters = task.task_parameters;
				t._run_mssql_sp_help_job_check(param, i).then(function(result){
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
_run_mssql_sp_help_job_check: function(param){
	
	var deferred = new Deferred();
	var t = this;
	var srtquery = "EXEC dbo.sp_help_job; SELECT sj.job_id, (SELECT TOP(1) RIGHT('000000' + CONVERT(VARCHAR(6),run_duration),6 ) FROM sysjobhistory WHERE job_id = sj.job_id AND step_id = 1 ORDER BY  instance_id DESC) as run_duration FROM sysjobs sj;";

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

console.log(result);

	if(error){
		deferred.reject(error);
	}else{


		if(result.length > 0){

			var ResultEvents = [];

			array.forEach(result, function(item, i){

				var r = {idequipment: param.idequipment, ideventtype: param.parameters.ideventtype_over_min, description: '', valid: true};
var details = {
    //originating_server: 'FAXXXSRV',
    name: 'JOB_PV_ControlFechaServidor',
    enabled: 1,
    description: 'No description available.',
    start_step_id: 1,
    date_created: 2016-05-30T12:38:44.240Z,
    date_modified: 2016-05-30T12:38:44.240Z,
    last_run_date: 20170606,
    last_run_time: 235959,
    last_run_outcome: 1,
    next_run_date: 20170607,
    next_run_time: 235959,
    current_execution_status: 4,
    current_execution_step: '0 (unknown)',
    current_retry_attempt: 0,
    };

				/*if(item.drive && param.parameters[item.drive]){

					var driveMin = param.parameters[item.drive];
					var Megas = item["MB libres"] || item["MB free"];

					if(Megas  && Megas<=driveMin){
						r.ideventtype = param.parameters.ideventtype_under_min;
					}
					r.details = {drive: item.drive, MB: Megas};
					ResultEvents.push(r);
				}*/



			});

			deferred.resolve(ResultEvents); 

		}else{
			deferred.reject(0);
		}
	}  	
}).catch(err => {
	deferred.resolve({idequipment: param.idequipment, ideventtype: param.parameters.ideventtype_on_no_connect, details: err});  
})

mssql.on('error', err => {
	//console.log(err);
	deferred.reject(err);  
});

return deferred.promise;
}




});
});

