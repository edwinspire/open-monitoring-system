// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/scheduled_tasks/scheduled_tasks",   "dojo/Deferred", "dojo/_base/array"], function(lang, Octopus, Deferred, array){
	lang.extend(Octopus, {
/////////////////////////////////////////
run_ping: function(task){
	//var host = task.ip || '';
	var deferred = new Deferred();
	var t = this;

	t.getNetworkDevices().then(function(devices){

				array.forEach(devices.rows, function(device){

console.log(device);

				});

	});

	return deferred.promise;
}




});
});

