// Dojo 1.7+ (AMD)
"dojo/promise/all"
require(["dojo/_base/lang", "api/scheduled_tasks/scheduled_tasks", "api/PromiseAll",  "dojo/Deferred", "dojo/_base/array", "dojo/promise/all", "dojo/on",  "dojo/node!mssql", "dojo/date"], function(lang, Octopus, PromiseAll, Deferred, array, all, on, mssql, dojoDate){
	lang.extend(Octopus, {
/////////////////////////////////////////
run_mssql_dbMaster_files: function(task){

	var deferred = new Deferred();
	var t = this;
	var name_event = 'run_mssql_dbMaster_files'+(new Date()).getTime()+ Math.random().toString().replace('.', '_');
		var p = PromiseAll();
	var devicesProcceced = 0;

	t.getNetworkDevices().then(function(devices){

		var totalDevices = devices.rows.length;

		var signal = t.on(name_event, function(r){

			var a = [];
			array.forEach(r.result, function(event, i){
				if(r.valid){
					a.push(t.send_event_pg(event, []));
				}
			});

			if(a.length > 0){
				p.run(a).then(function(result){
					devicesProcceced++;
					if(devicesProcceced == totalDevices){
						signal.remove();
						deferred.resolve({});
					}
				});

			}else{
				devicesProcceced++;
			}

		});

		array.forEach(devices.rows, function(device, i){

			if(device.ip && device.ip.length > 0){
				var param = device;
				param.parameters = task.task_parameters;
				t._run_mssql_dbMaster_files_check(param, i).then(function(result){
					t.emit(name_event, {result: result, valid: true});
				}, function(error){
					t.emit(name_event, {result: error, valid: false});
				});
			}else{
				t.emit(name_event, {result: 'IP Invalid', valid: false});
			}

		});


	});

	return deferred.promise;
},
_run_mssql_dbMaster_files_check: function(param){
	
	var deferred = new Deferred();
	var t = this;
	var srtquery = `with fs
as
(
    select database_id, type, size * 8.0 / 1024 size
    from sys.master_files
)

select 
    name, state, state_desc, 
    (select sum(size) from fs where type = 0 and fs.database_id = db.database_id) DataFileSizeMB,
    (select sum(size) from fs where type = 1 and fs.database_id = db.database_id) LogFileSizeMB
from sys.databases db`;

	var config = {
		user: param.username,
		password: param.pwd,
		server: param.ip, 
		database: 'msdb',
    //requestTimeout: 30000,
    //connectionTimeout: 30000//,
    //options: {
      // encrypt: true
  //}
}

mssql.connect(config).then((cnx) => {

	return new mssql.Request(cnx).query(srtquery)
}).then((result, error)  => {

	if(error){
		deferred.resolve([{idequipment: param.idequipment, ideventtype: param.parameters.ideventtype_on_no_connect, details: {Error: error, Task: 'run_mssql_dbMaster_files'}}]);  
	}else{

	var ResultEvents = [];

		if(result.length > 0){


/*
ONLINE
La base de datos está disponible para su acceso. El grupo de archivos principal está en línea, aunque la fase de deshacer de la recuperación puede no haberse completado.

OFFLINE
La base de datos no está disponible. Una base de datos pasa a estar sin conexión por la acción explícita del usuario y permanece sin conexión hasta que el usuario toma otra acción. Por ejemplo, la base de datos puede dejarse sin conexión para mover un archivo a un nuevo disco. La base de datos se vuelve a poner en línea una vez completado el traslado.

RESTORING
Uno o varios archivos del grupo de archivos principal se está restaurando, o uno o varios archivos secundarios se están restaurando sin conexión. La base de datos no está disponible.

RECOVERING
Se está recuperando la base de datos. El proceso de recuperación es un estado transitorio, la base de datos se pone automáticamente en línea si la recuperación tiene éxito. Si la recuperación no tiene éxito, la base de datos pasa a ser sospechosa. La base de datos no está disponible.

RECOVERY PENDING
SQL Server ha encontrado un error relacionado con un recurso durante la recuperación. La base de datos no está dañada pero pueden faltar archivos o bien limitaciones de recursos del sistema pueden estar impidiendo que se inicie. La base de datos no está disponible. Se necesita una acción adicional por parte del usuario para resolver el error y permitir que se complete el proceso de recuperación.

SUSPECT
Como mínimo un grupo de archivos principal es sospechoso y puede estar dañado. La base de datos no se puede recuperar durante el inicio de SQL Server. La base de datos no está disponible. Se requiere una acción adicional por parte del usuario para resolver el problema.

EMERGENCY
El usuario ha cambiado la base de datos y ha establecido el estado en EMERGENCY. La base de datos está en modo de usuario único y se puede reparar o restaurar. La base de datos está marcada como READ_ONLY, el registro está deshabilitado y el acceso está limitado a miembros de la función fija de servidor sysadmin. EMERGENCY se utiliza principalmente para solucionar problemas. Por ejemplo, una base de datos marcada como sospechosa se puede establecer en el estado EMERGENCY. Esto puede permitir al administrador del sistema acceso de sólo lectura a la base de datos. Sólo los miembros de la función fija de servidor sysadmin pueden establecer una base de datos en el estado EMERGENCY.
*/

/*
TODO Implementar
			array.forEach(result, function(item, i){

				if(item.drive && param.parameters[item.drive]){

					var driveMin = param.parameters[item.drive];
					var Megas = item["MB libres"] || item["MB free"];

					var r = {idequipment: param.idequipment, source: t.textToMD5(item.drive), ideventtype: param.parameters.ideventtype_over_min, description: '', valid: true};

					if(Megas  && Megas<=driveMin){
						r.ideventtype = param.parameters.ideventtype_under_min;
					}
					r.details = {};
					r.details[item.drive] = Megas;
					ResultEvents.push(r);
				}

			});
			*/

			deferred.resolve(ResultEvents); 

		}else{
			deferred.resolve(ResultEvents);
		}
	}  	
}).catch(err => {
	deferred.resolve([{idequipment: param.idequipment, ideventtype: param.parameters.ideventtype_on_no_connect, details: {Error: err, Task: 'run_mssql_dbMaster_files'}}]);  
})


mssql.on('error', err => {
	deferred.resolve([{idequipment: param.idequipment, ideventtype: param.parameters.ideventtype_on_no_connect, details: {Error: err, Task: 'run_mssql_dbMaster_files'}}]);  
});

return deferred.promise;
}




});
});

