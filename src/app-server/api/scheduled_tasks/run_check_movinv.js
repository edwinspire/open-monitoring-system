// Dojo 1.7+ (AMD)
"dojo/promise/all"
require(["dojo/_base/lang", "api/scheduled_tasks/scheduled_tasks",   "dojo/Deferred", "dojo/_base/array", "dojo/promise/all", "dojo/on", "dojo/node!mssql"], function(lang, Octopus, Deferred, array, all, on, mssql){
	lang.extend(Octopus, {
/////////////////////////////////////////
run_check_movinv: function(task){
	
	var deferred = new Deferred();
	var t = this;
    var name_event = 'run_check_movinv'+(new Date()).getTime()+ Math.random().toString().replace('.', '_');
    var movProcesados = 0;
    var idsMovimientos = [];

    console.log(task);

    t.query(`
      SELECT * FROM secondary.interfaces_eta_rm_matriz WHERE enmatriz = false AND empresa = $1::TEXT ORDER BY datetimefile DESC LIMIT 5;
      `, [task.task_parameters.empresa]).then(function(result){

console.log(result);

        var totalMov = devices.rows.length;

        var signal = t.on(name_event, function(movimiento_revisado){

            movProcesados ++;

            if(movProcesados == totalMov){
                signal.remove();

// Una vez terminado debemos hacer el update a la tabla con el id para ponerlo como ENMATRIZ.

                deferred.resolve(true);
            }else{

            }
        });


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
    if(result.rows.length > 0){

        array.forEach(result.rows, function(regmov){
            t._run_check_movinv_connect_matriz(cnxmatriz, regmov, name_event);
        });
    }

}).catch(function(err) {

    console.log(err);
    deferred.resolve(false);
});



}, function(fail){
    deferred.reject(fail);
});



      return deferred.promise;
  },
  _run_check_movinv_connect_matriz: function(cnxmatriz, movsap, name_event){

   var srtquery = "SELECT  top(1) tbl_maestromovinvent.Serie_Factura FROM tbl_maestromovinvent  INNER JOIN tbl_movinvent  ON tbl_maestromovinvent.Serie_Factura = tbl_movinvent.Serie_Factura WHERE tbl_maestromovinvent.FechaRegistro = '"+movsap.cpudt+" "+movsap.cputm+"' AND  tbl_movinvent.cantidad = "+movsap.menge+" AND  tbl_maestromovinvent.UserId = '"+movsap.usnam+"' AND   tbl_maestromovinvent.numero_doc_inv = '"+movsap.mblnr+"' and tbl_maestromovinvent.Oficina = (SELECT top (1) o.oficina FROM dbo.Oficina o WHERE o.ofi_codigo_interno_empresa = '"+movsap.werks+"' AND o.Compania = tbl_maestromovinvent.Compania) AND  codigo_producto = '"+movsap.matnr+"';";

   new mssql.Request(cnxmatriz)
   .query(srtquery).then(function(recordset) {

        console.log(recordset);
        var Filas = recordset.length;
        if(Filas > 0){

        }
        t.emit(name_event, recordset);

    }).catch(function(err) {
        console.log(err);
        t.emit(name_event, err);
    });

}




});
});