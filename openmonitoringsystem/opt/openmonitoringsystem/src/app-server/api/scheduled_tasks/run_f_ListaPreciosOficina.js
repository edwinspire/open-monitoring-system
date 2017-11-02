// Dojo 1.7+ (AMD)
"dojo/promise/all"
require(["dojo/_base/lang", "api/scheduled_tasks/scheduled_tasks",   "dojo/Deferred", "dojo/_base/array", "dojo/promise/all", "dojo/on",  "dojo/node!mssql", "dojo/date"], function(lang, Octopus, Deferred, array, all, on, mssql, DojoDate){
	lang.extend(Octopus, {
/////////////////////////////////////////
run_f_ListaPreciosOficina: function(task){

	var deferred = new Deferred();
	var t = this;
	var name_event = 'run_f_ListaPreciosOficina'+(new Date()).getTime()+ Math.random().toString().replace('.', '_');
	var devicesProcceced = 0;

	t.getNetworkDevices().then(function(devices){

		var totalDevices = devices.rows.length;

		var signal = t.on(name_event, function(r){

			devicesProcceced ++;

			if(r.valid){
				//console.log(r);
				t.query("SELECT secondary.fun_update_lista_precios_oficinas($1::integer, $2::text, $3::text, $4::integer, $5::text, $6::INET);",
					[r.return.idaccount, r.return.lp_p, r.return.lp_a, r.return.prod, 'PROV', r.return.ip]).then(function(result){
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
				t._run_f_ListaPreciosOficina_check(param, i).then(function(result){
					t.emit(name_event, {valid: true, return: result});
				}, function(error){
					t.emit(name_event, {valid: false, return: error});
				});
			}else{
				t.emit(name_event, "IP empty");
			}

		});


	});

	return deferred.promise;
},
_run_f_ListaPreciosOficina_check: function(param){

	var oficina = param.account;
	var deferred = new Deferred();
	var t = this;
	var srtquery = `
	USE EasyGestionEmpresarial;
	DECLARE @lp_principal nvarchar(max);
	DECLARE @lp_activa nvarchar(max);
	DECLARE @productos nvarchar(max);
	DECLARE @oficina nvarchar(max);

	SET @oficina = '${oficina}';

	SET @lp_principal = (SELECT TOP(1) lista_principal FROM oficina with(nolock) WHERE oficina = (@oficina));
	SET @lp_activa = (SELECT TOP(1) lista_precio from pv_lista_precio_oficina WHERE oficina = (@oficina) AND estado = 'activo');
	SET @productos = (SELECT COUNT(*) FROM tbl_precios_sucursales with(nolock) WHERE sucursal = @lp_activa);

	SELECT @lp_principal as lp_p, @lp_activa as lp_a, @productos as prod;
	`;

	var config = {
		user: param.username,
		password: param.pwd,
		server: param.ip, 
		database: 'msdb',
		connectionTimeout: 90000,
		requestTimeout: 60000,
		pool: {
			max: 500,
			min: 0,
			idleTimeoutMillis: 30000
		}
	}

	mssql.connect(config).then((cnx) => {

		return new mssql.Request(cnx).query(srtquery)
	}).then((result, error)  => {
		
		if(error){
			deferred.resolve(error);  
		}else{
			
			if(result.length > 0){

				var r = result[0];
				r.ip = param.ip;
				r.idaccount = param.idaccount;

				deferred.resolve(r);

			}else{
				deferred.reject({});
			} 
		}  	
	}).catch(err => {
		console.log(err, param);
		deferred.reject(err);  
	})

	mssql.on('error', err => {
	//console.log(err, param);
	deferred.reject(err);  
});

	return deferred.promise;
}




});
});

