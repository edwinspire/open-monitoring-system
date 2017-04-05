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
	"dojo/node!ftp",
	"api/postgres/oms", 
	"dojox/encoding/digests/MD5", 
	"dstore/Memory",
	"api/config", 
	"api/octopus/octopus", 
	"api/octopus/ping", 
	"dojo/promise/all",
	"dojo/request/node"
	], function(request, on, locale, array, crypto, path, fs, pathToRegexp, pG, compression, mssql, nodeMailer, ClientFTP, pgOMS, MD5, Memory, Config, Octopus, all, nodeRequest){

		console.log("Inicia Octopus");

		process.on('uncaughtException', function (error) {
			console.log(error.stack);
			console.dir(error);
		});

		var oc = new Octopus({user: process.env.PG_USER, pwd: process.env.PG_PWD, host: process.env.PG_HOST, db: process.env.PG_DB});

		oc.get_dgrid_fullstructure().then(function(){
			Run();	
		});



		setInterval(function(){
			Run();
		}, 1000*600);



		function Run(){
			oc.getTask().then(function(task){

				array.forEach(task.rows, function(taskdevice){

					taskdevice.parameters = taskdevice.parameters || taskdevice.default_parameters;

					switch(taskdevice.function_name){
						case 'ping':
						if(taskdevice.ip){
							oc.ping(taskdevice).then(function(e){
								console.log(e.pg.command, taskdevice.ip);
							});
						}
						break;
					}



				});


			});

		}
//process.exit();


});







