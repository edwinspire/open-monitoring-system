// Dojo 1.7+ (AMD)
"dojo/promise/all"
require(["dojo/_base/lang", "api/scheduled_tasks/scheduled_tasks",   "dojo/Deferred", "dojo/_base/array", "dojo/promise/all", "dojo/on", "dojo/node!mssql"], function(lang, Octopus, Deferred, array, all, on, mssql){
	lang.extend(Octopus, {
/////////////////////////////////////////
run_check_movinv_sin_materiales: function(task){
	
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
    SELECT Compania, Sucursal, Oficina, tipo_mov, num_mov, codigo_producto, fecha_mov, cantidad  FROM [EasyGestionEmpresarial].[dbo].[tbl_movinvent] WHERE codigo_producto NOT IN (SELECT [codigo] FROM [EasyGestionEmpresarial].[dbo].[tbl_articulos]);
    `;

    new mssql.Request(cnxmatriz)
    .query(srtquery).then(function(recordset) {

    	console.log(recordset);
var ideventtype = task.task_parameters.ideventtype_on_alarm;
var materiales = [];
var det = {};

if(recordset.length > 0){

/*
    		var Message = `
    		<table style="border: 1px solid black; border-collapse: collapse;">
    		<tr>
    		<th style="border: 1px solid black; border-collapse: collapse;">OFICINA</th>
    		<th style="border: 1px solid black; border-collapse: collapse;">NUM MOV</th> 
    		<th style="border: 1px solid black; border-collapse: collapse;">TIPO MOV</th>
    		<th style="border: 1px solid black; border-collapse: collapse;">CODIGO</th>
    		<th style="border: 1px solid black; border-collapse: collapse;">FECHA</th>
    		<th style="border: 1px solid black; border-collapse: collapse;">CANT</th>
    		</tr>
    		`;


    		array.forEach(recordset, function(mov){
    			var Compania = mov.Compania;
    			var num_mov = mov.num_mov;
    			var Oficina = mov.Oficina;
    			var tipo_mov = mov.tipo_mov;
    			var codigo_producto = mov.codigo_producto;
    			var fecha_mov = mov.fecha_mov;
    			var cantidad = mov.cantidad;
    			Message = Message+`
    			<tr>
    			<td style="border: 1px solid black; border-collapse: collapse;">${Oficina}</td>
    			<td style="border: 1px solid black; border-collapse: collapse;">${num_mov}</td>
    			<td style="border: 1px solid black; border-collapse: collapse;">${tipo_mov}</td>
    			<td style="border: 1px solid black; border-collapse: collapse;">${codigo_producto}</td>
    			<td style="border: 1px solid black; border-collapse: collapse;">${fecha_mov}</td>
    			<td style="border: 1px solid black; border-collapse: collapse;">${cantidad}</td>
    			</tr>`;

    		});

    		Message = Message+`
    		</table>
    		`;
            */

            array.forEach(recordset, function(mov){

                if(array.indexOf(materiales, mov.codigo_producto) < 0){
                    materiales.push(mov.codigo_producto);
                }

det[] = {}

            });



        }else{
         // deferred.resolve(true);
         ideventtype = task.task_parameters.ideventtype_on_restore;
     }


     t.send_event_pg({idaccount: task.task_parameters.idaccount, ideventtype: ideventtype, description: '<b>Listado: </b>'+materiales.toString(), details: JSON.stringify(recordset)}, []).then(function(result){

            //t.send_event_pg({idaccount: task.task_parameters.idaccount, ideventtype: 136, description: Message}, []).then(function(result){
                deferred.resolve(true);
            });      

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