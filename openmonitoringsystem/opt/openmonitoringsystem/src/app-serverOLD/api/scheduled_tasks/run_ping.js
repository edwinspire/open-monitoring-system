// Dojo 1.7+ (AMD)
"dojo/promise/all"
require(["dojo/_base/lang", "api/scheduled_tasks/scheduled_tasks",   "dojo/Deferred", "dojo/_base/array", "dojo/promise/all", "dojo/on"], function(lang, Octopus, Deferred, array, all, on){
	lang.extend(Octopus, {
/////////////////////////////////////////
run_ping: function(task){
	
	var deferred = new Deferred();
	var t = this;
	var name_event = 'run_ping'+(new Date()).getTime()+ Math.random().toString().replace('.', '_');
	var devicesProcceced = 0;

	t.getNetworkDevices().then(function(devices){
		
		var totalDevices = devices.rows.length;

		var signal = t.on(name_event, function(){
			
			devicesProcceced ++;

			if(devicesProcceced == totalDevices){
				signal.remove();
				deferred.resolve(true);
			}
		});

		array.forEach(devices.rows, function(device, i){
			
			var param = device;
			param.parameters = task.task_parameters;
			t.ping(param).then(function(pingresp){
				t.emit(name_event, {});
			}, function(error){
				t.emit(name_event, error);
			});
		});


	});

	return deferred.promise;
}




});
});

