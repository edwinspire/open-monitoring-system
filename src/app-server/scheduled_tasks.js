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
	"api/scheduled_tasks/run_mssql_sp_help_job"
	], function(request, on, locale, array, crypto, path, fs, pathToRegexp, pG, compression, Config, ScheduledTasks, all, stamp, Dojodate){

		console.log("Inicia scheduled_tasks");

		process.on('uncaughtException', function (error) {
			console.log(error.stack);
			console.dir(error);
		});


console.log('Obtiene la lista de tareas');
		var STasks = new ScheduledTasks({user: process.env.PG_USER, pwd: process.env.PG_PWD, host: process.env.PG_HOST, db: process.env.PG_DB});

		STasks.get_config_from_db().then(function(){

			setInterval(function(){
				STasks.getTaskList().then(function(result){

					array.forEach(result.rows, function(task){
						console.log(task);

						if(STasks[task.function_name]){


							if(task.next_run){

								STasks.startTask(task).then(function(x){

									//console.log(x);
									STasks.endTask(task).then(function(){
										console.log('Ha terminado la tarea');
									}, function(error){
										console.log(error);
									});

								});							

							}else if(!task.next_run && Dojodate.difference(new Date(), task.task_start, 'second') < 0){

								STasks.startTask(task).then(function(x){

										//console.log(x);
										STasks.endTask(task).then(function(){
											console.log('Ha terminado la tarea');
										}, function(error){
											console.log(error);
										});

									});


							}else{
								console.log("No hizo nada");
							}

						}else{

							STasks.taskNoFound(task.idtask).then(function(){
								console.dir('No existe la funcion '+task.function_name); 
							});

						}

					});

				});
			}, 5000);

		});

//process.exit();


});







