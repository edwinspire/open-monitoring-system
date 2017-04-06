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
	"dojo/node!mssql", 
	"dojo/node!nodemailer",
	"api/config", 
	"api/scheduled_tasks/scheduled_tasks", 
	"dojo/promise/all",
	"dojo/date/stamp",
	"dojo/date",
	"api/scheduled_tasks/run_ping"
	], function(request, on, locale, array, crypto, path, fs, pathToRegexp, pG, compression, mssql, nodeMailer, Config, ScheduledTasks, all, stamp, Dojodate){

		console.log("Inicia scheduled_tasks");

		process.on('uncaughtException', function (error) {
			console.log(error.stack);
			console.dir(error);
		});

		var STasks = new ScheduledTasks({user: process.env.PG_USER, pwd: process.env.PG_PWD, host: process.env.PG_HOST, db: process.env.PG_DB});

		STasks.get_config_from_db().then(function(){

			setInterval(function(){
				STasks.getTaskList().then(function(result){

					array.forEach(result.rows, function(task){
						//console.log(task);

						if(STasks[task.function_name]){


							if(task.next_run){

								STasks[task.function_name]().then(function(){
									console.log();
								});									

							}else if(!task.next_run && Dojodate.difference(new Date(), task.task_start, 'second') < 0){


								STasks[task.function_name]().then(function(){
									console.log();
								});	

							}else{
								console.log("No hizo nada");
							}


							if(task.config.interval && task.config.interval.minutes){

							}


						}else{

							STasks.taskNoFound(task.idtask).then(function(){
								//console.log(task);
								//console.log(Object.prototype.toString.call(task.task_start), task.task_start.toString(),;
								
								console.dir('No existe la funcion '+task.function_name); 
							});

						}

					});

				});
			}, 5000);

		});






//process.exit();


});







