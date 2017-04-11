// Dojo 1.7+ (AMD)
"dojo/promise/all"
require(["dojo/_base/lang", "api/scheduled_tasks/scheduled_tasks",   "dojo/Deferred", "dojo/_base/array", "dojo/promise/all", "dojo/on", "dojo/node!mssql"], function(lang, Octopus, Deferred, array, all, on, mssql){
	lang.extend(Octopus, {
/////////////////////////////////////////
run_check_articulos_sin_marca: function(task){
	
	var deferred = new Deferred();
	var t = this;
	console.log(task);

	mssql.connect({
		user: task.task_parameters.mssql.user,
		password: task.task_parameters.mssql.pwd,
    server: task.task_parameters.mssql.ip, // You can use 'localhost\\instance' to connect to named instance 
    database: 'msdb',
    requestTimeout: 300000,
    options: {
        encrypt: true // Use this if you're on Windows Azure 
    }
}).then(function(cnxmatriz) {
    // Query 
    var msSQLConnection = this;    

    var srtquery = `
    SELECT codigo  FROM [EasyGestionEmpresarial].[dbo].[tbl_articulos] WHERE marca = '' OR marca is null;
    `;

    new mssql.Request(cnxmatriz)
    .query(srtquery).then(function(recordset) {

    	//console.log(recordset);
    	var Filas = recordset.length;

    	if(Filas > 0){


    		var Message = `
    		<div> <b>${Filas}</b> producto(s) sin marca</div>
    		<table style="border: 1px solid black; border-collapse: collapse;">
    		<tr>
    		<th style="border: 1px solid black; border-collapse: collapse;">CODIGO</th>
    		</tr>
    		`;


    		array.forEach(recordset, function(mov){
    			var codigo = mov.codigo;
    			Message = Message+`
    			<tr>
    			<td style="border: 1px solid black; border-collapse: collapse;">${codigo}</td>
    			</tr>`;

    		});

    		Message = Message+`
    		</table>
    		`;

    		t.send_event_pg({idaccount: task.task_parameters.idaccount, ideventtype: 139, description: Message}, []).then(function(result){
    			deferred.resolve(true);
    		});

    	}else{
    		deferred.resolve(true);
    	}

    }).catch(function(err) {

    	console.log(err);
    	deferred.resolve(false);
    });


}).catch(function(err) {

	console.log(err);
	deferred.resolve(false);
});

return deferred.promise;
}




});
});