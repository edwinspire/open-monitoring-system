// Dojo 1.7+ (AMD)
"dojo/promise/all"
require(["dojo/_base/lang", "api/scheduled_tasks/scheduled_tasks",   "dojo/Deferred", "dojo/_base/array", "api/PromiseAll", "dojo/on",  "dojo/node!mssql", "dojo/date"], function(lang, Octopus, Deferred, array, PromiseAll, on, mssql, dojoDate){
	lang.extend(Octopus, {
/////////////////////////////////////////
run_mssql_sp_help_job: function(task){

	var deferred = new Deferred();
	var t = this;
	var name_event = 'run_mssql_sp_help_job'+(new Date()).getTime()+ Math.random().toString().replace('.', '_');
	var devicesProcceced = 0;
	var p = PromiseAll();

	t.getNetworkDevices().then(function(devices){

		var totalDevices = devices.rows.length;

		console.log('TOTAL DE EQUIPOS:  '+totalDevices);

		var signal = t.on(name_event, function(r){
			devicesProcceced++;
			var a = [];
			array.forEach(r.result, function(event, i){
				if(r.valid){
					a.push(t.send_event_pg(event, []));
				}
			});

//console.log(a.length);
console.log(devicesProcceced+' de '+totalDevices+' > '+a.length);
			p.run(a).then(function(result){
				console.log('-- '+devicesProcceced+' de '+totalDevices+' > '+a.length);
				if(devicesProcceced == totalDevices){
					console.log(a.length+' .... run_mssql_sp_help_job Completado ', signal, deferred);
					signal.remove();
					console.log('Elimina la señal');
					deferred.resolve({});
				}
			});
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
	var srtquery = "EXEC dbo.sp_help_job;";

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

				var ideventtype = 0;
				var last_run_outcome_label = "";	
				
				var last_run_datetime_string = item.last_run_date+" "+item.last_run_time;
				if(last_run_datetime_string.length != 15){
					last_run_datetime_string = "19900101 000000";
				}
				var last_run_datetime_array = last_run_datetime_string.match(/(\d\d\d\d)(\d\d)(\d\d)\s+(\d\d)(\d\d)(\d\d)/);
				last_run_datetime = last_run_datetime_array[1]+"-"+last_run_datetime_array[2]+"-"+last_run_datetime_array[3]+"T"+last_run_datetime_array[4]+":"+last_run_datetime_array[5]+":"+last_run_datetime_array[6];


				var	next_run_datetime_string = item.next_run_date+" "+item.next_run_time;
				if(next_run_datetime_string.length != 15){
					next_run_datetime_string = "19900101 000000";
				}
				var next_run_datetime_array = next_run_datetime_string.match(/(\d\d\d\d)(\d\d)(\d\d)\s+(\d\d)(\d\d)(\d\d)/);
				next_run_datetime = next_run_datetime_array[1]+"-"+next_run_datetime_array[2]+"-"+next_run_datetime_array[3]+"T"+next_run_datetime_array[4]+":"+next_run_datetime_array[5]+":"+next_run_datetime_array[6];


				switch(item.last_run_outcome){
					case 0:
					last_run_outcome_label = "Failed";	
					ideventtype = param.parameters.ideventtype_on_failed;
					break;
					case 1:
					last_run_outcome_label = "Succeeded";	
					ideventtype = param.parameters.ideventtype_on_succeeded;
					break;
					case 0:
					last_run_outcome_label = "Canceled";	
					ideventtype = param.parameters.ideventtype_on_canceled;
					break;
					default:
					last_run_outcome_label = "Unknown";	
					ideventtype = param.parameters.ideventtype_on_unknown;
					break;
				}			

				var details = {
					originating_server: item.originating_server,
					name: item.name,
					enabled: item.enabled,
					description: item.description,
					start_step_id: item.start_step_id,
					date_created: item.date_created,
					date_modified: item.date_modified,
					last_run_datetime: last_run_datetime,
					//last_run_date: item.last_run_date,
					//last_run_time: item.last_run_time,
					next_run_datetime: next_run_datetime,
					last_run_outcome: item.last_run_outcome,
					last_run_outcome_label: last_run_outcome_label,
					current_execution_status: item.current_execution_status,
					current_execution_step: item.current_execution_step,
					current_retry_attempt: item.current_retry_attempt,
				};

				var r = {dateevent: last_run_datetime, idequipment: param.idequipment, ideventtype: ideventtype, description: item.name, source: t.textToMD5(item.name), details: details};

				ResultEvents.push(r);


				var current_execution_status_label;

				switch(item.current_execution_status){
					case 1:
					current_execution_status_label = "Executing";	
					ideventtype = param.parameters.ideventtype_on_Executing;
					break;
					case 2:
					current_execution_status_label = "Waiting For Thread";	
					ideventtype = param.parameters.ideventtype_on_Waiting_Thread;
					break;
					case 3:
					current_execution_status_label = "Between Retries";	
					ideventtype = param.parameters.ideventtype_on_Between_Retries;
					break;
					case 4:
					current_execution_status_label = "Idle";	
					ideventtype = param.parameters.ideventtype_on_Idle;
					break;
					case 5:
					current_execution_status_label = "Suspended";	
					ideventtype = param.parameters.ideventtype_on_Suspended;
					break;
					case 6:
					current_execution_status_label = "Obsolete";	
					ideventtype = param.parameters.ideventtype_on_Obsolete;
					break;
					case 7:
					current_execution_status_label = "PerformingCompletionActions";	
					ideventtype = param.parameters.ideventtype_on_PerformingCompletionActions;
					break;
					default:
					current_execution_status_label = "Unknown";	
					ideventtype = param.parameters.ideventtype_on_unknown_status;
					break;
				}	

				var details2 = {
					originating_server: item.originating_server,
					name: item.name,
					enabled: item.enabled,
					description: item.description,
					start_step_id: item.start_step_id,
					date_created: item.date_created,
					date_modified: item.date_modified,
					last_run_datetime: last_run_datetime,
					//last_run_date: item.last_run_date,
					//last_run_time: item.last_run_time,
					next_run_datetime: next_run_datetime,
					current_execution_status: item.current_execution_status,
					current_execution_status_label: current_execution_status_label,
					current_execution_step: item.current_execution_step,
					current_retry_attempt: item.current_retry_attempt,
				};

				var r2 = {idequipment: param.idequipment, ideventtype: param.parameters.ideventtype_over_min, description: item.name, source: t.textToMD5(item.name), details: details2};

				ResultEvents.push(r2);

			});

deferred.resolve(ResultEvents); 

}else{
	deferred.reject([]);
}
}  	
}).catch(err => {
	//console.log(err);
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

