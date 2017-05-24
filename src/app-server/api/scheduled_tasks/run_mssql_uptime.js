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

		var signal = t.on(name_event, function(){
			
			devicesProcceced ++;

			console.log(devicesProcceced +' de ' +totalDevices);

			if(devicesProcceced == totalDevices){
				signal.remove();
				deferred.resolve(true);
			}
		});

		array.forEach(devices.rows, function(device, i){
			
			var param = device;
			param.parameters = task.task_parameters;
			t._run_mssql_uptime_check(param).then(function(result){
				console.log(result);
				t.emit(name_event, {});
			}, function(error){
				console.log(error);
				t.emit(name_event, {});
			});
		});


	});

	return deferred.promise;
},
_run_mssql_uptime_check: function(param){
	
	var deferred = new Deferred();
	var t = this;

	mssql.connect({
		user: param.username,
		password: param.pwd,
    server: param.ip, // You can use 'localhost\\instance' to connect to named instance 
    database: 'msdb',
    //requestTimeout: 3000,
    options: {
        encrypt: true // Use this if you're on Windows Azure 
    }
}).then(function(cnxmatriz) {
    // Query   

    var srtquery = `
    SELECT DATEDIFF(MINUTE, login_time, CURRENT_TIMESTAMP) AS 'Uptime_in_minutes' FROM sys.sysprocesses WHERE spid = 1;
    `;

    new mssql.Request(cnxmatriz)
    .query(srtquery).then(function(recordset) {

    	//console.log(recordset);
    	var Filas = recordset.length;
    	var ideventtype = param.parameters.ideventtype_under_threshold;
    	if(Filas > 0){

    		if(recordset[0].Uptime_in_minutes > param.parameters.max_threshold_uptime){
    			ideventtype = param.parameters.ideventtype_on_threshold;
    		}

    		t.send_event_pg({idaccount: param.idaccount, ideventtype: ideventtype, description: '', details: recordset[0]}, []).then(function(result){
    			deferred.resolve(true);
    		}, function(err){
    			console.log(err);
    			deferred.resolve(false);    			
    		});

    	}else{
    		deferred.resolve(true);
    	}   	

    }).catch(function(err) {

    	console.log(err);
    	deferred.resolve(false);
    });


}).catch(function(err) {

	//console.trace(err);
	deferred.resolve(err, true);
});

return deferred.promise;
}




});
});

