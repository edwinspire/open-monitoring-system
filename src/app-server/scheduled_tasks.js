require(["dojo/request",
	"dojo/on", 
	"dojo/date/locale",
	"dojo/_base/array", 
	"dojo/node!crypto",
	"dojo/node!path", 
	"dojo/node!fs", 
	"dojo/node!path-to-regexp", 
	"dojo/node!pg", 
	"dojo/node!compression", 
	"api/config", 
	"dojo/node!log",
	"api/scheduled_tasks/scheduled_tasks", 
	"dojo/promise/all",
	"dojo/date/stamp",
	"dojo/date",
	"api/scheduled_tasks/run_ping",
	"api/scheduled_tasks/run_check_movinv_sin_materiales",
	"api/scheduled_tasks/run_check_articulos_sin_marca",
	"api/scheduled_tasks/run_mssql_uptime",
	"api/scheduled_tasks/run_check_movinv", 
	"api/scheduled_tasks/run_mssql_CURRENT_TIMESTAMP",
	"api/scheduled_tasks/run_mssql_fixeddrives",
	"api/scheduled_tasks/run_mssql_sp_help_job",
	"api/scheduled_tasks/run_f_ListaPreciosOficina",
	"api/scheduled_tasks/run_check_carga_vxmp",
	"api/scheduled_tasks/run_resumen_carga_mov_inv",
	"api/scheduled_tasks/run_resumen_facturacion_electronica"
	], function(request, on, locale, array, crypto, path, fs, pathToRegexp, pG, compression, Config, LogSystem, ScheduledTasks, all, stamp, Dojodate){

		var Log = new LogSystem('debug', fs.createWriteStream('scheduled_tasks_'+(new Date()).toLocaleDateString()+'.log'));
		Log.debug("Inicia scheduled_tasks");

		process.on('uncaughtException', function (error) {
			Log.error(error.stack);
		});

		var STasks = new ScheduledTasks({user: process.env.PG_USER, pwd: process.env.PG_PWD, host: process.env.PG_HOST, db: process.env.PG_DB});

		STasks.get_config_from_db().then(function(){

			setInterval(function(){
				STasks.getTaskList().then(function(result){
					Log.debug('Obtiene la lista de tareas');
					array.forEach(result.rows, function(task){
						Log.debug(task);

						if(STasks[task.function_name]){


							if(task.next_run){

								STasks.startTask(task).then(function(x){

									STasks.endTask(task).then(function(){
										Log.debug('* Ha terminado la tarea '+task.function_name);
									}, function(error){
										Log.error(error);
									});

								});							

							}else if(!task.next_run && Dojodate.difference(new Date(), task.task_start, 'second') < 0){

								STasks.startTask(task).then(function(x){

									STasks.endTask(task).then(function(){
										Log.debug('** Ha terminado la tarea '+task.function_name);
									}, function(error){
										Log.error(error);
									});

								});


							}else{
								Log.notice("No hizo nada");
							}

						}else{

							STasks.taskNoFound(task.idtask).then(function(){
								Log.notice('No existe la funcion '+task.function_name); 
							});

						}

					});

				});
			}, 2000);

		});



	});







