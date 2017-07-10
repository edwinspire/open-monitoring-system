// Dojo 1.7+ (AMD)
"dojo/promise/all"
require(["dojo/_base/lang", "api/scheduled_tasks/scheduled_tasks",   "dojo/Deferred", "dojo/_base/array", "dojo/promise/all", "dojo/on",  "dojo/node!mssql", "dojo/date"], function(lang, Octopus, Deferred, array, all, on, mssql, DojoDate){
	lang.extend(Octopus, {
/////////////////////////////////////////
run_check_carga_vxmp: function(task){

	var deferred = new Deferred();
	var t = this;
	var name_event = 'run_check_carga_vxmp'+(new Date()).getTime()+ Math.random().toString().replace('.', '_');
	var devicesProcceced = 0;

	t.query('SELECT idaccount, account_name, account, identification,  ip, username, pwd  FROM view_account_network_devices WHERE iddivision IN (6, 7) AND enabled = true order by account;', []).then(function(devices){

		var totalDevices = devices.rows.length;

		var signal = t.on(name_event, function(r){

			devicesProcceced ++;

			if(r.valid){

				t.query("SELECT secondary.fun_insert_ventasxmp($1::bigint, $2::json);", [r.result.idaccount, JSON.stringify(r.result.datas)]).then(function(result){
					//console.log(result);
				}, function(err){
					console.log(err);
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
				t._run_check_carga_vxmp_check(param).then(function(result){
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
_run_check_carga_vxmp_check: function(param){
	
	var deferred = new Deferred();
	var t = this;
	var dias_atras = DojoDate.add(new Date(), "day", -30).toLocaleString();


	var srtquery = `
	SELECT  * FROM [ITE_Log].[log].[tbl_CargaVentasMediosPagos] WHERE cvmp_fecha_registro >= '${dias_atras}';
	`;

	var config = {
		user: param.username,
		password: param.pwd,
		server: param.ip, 
		database: 'msdb',
		connectionTimeout: 90000,
		requestTimeout: 60000
    //options: {
      // encrypt: true
  //}
}

mssql.connect(config).then((cnx) => {

	return new mssql.Request(cnx).query(srtquery)
}).then((result, error)  => {

	if(error){
		deferred.reject({idaccount: param.idaccount, datas: error});  
	}else{

		deferred.resolve({idaccount: param.idaccount, datas: result});  
	} 

}).catch(err => {
	//console.log(err, param);
	deferred.reject({idaccount: param.idaccount, datas: err});  
})

mssql.on('error', err => {
	//console.log(err, param);
	deferred.reject({idaccount: param.idaccount, datas: err});  
});

return deferred.promise;
}




});
});

