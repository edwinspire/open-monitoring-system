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
    var orden = "DESC"
    var limit = task.task_parameters.registros || 1000;
    
    if(task.task_parameters.orden_asc){
        orden = "ASC"
    }

    console.log(task, limit, orden);

    t.query(`
        SELECT idreginterfacesmatriz, cpudt, cputm, menge, mblnr, matnr, werks FROM secondary.view_movinv_sap WHERE enmatriz = false AND bukrs = $1::TEXT ORDER BY datetimefile ${orden} LIMIT ${limit};
        `, [task.task_parameters.empresa]).then(function(result){

        //console.log(result.rows);

        var totalMov = result.rows.length;

        var signal = t.on(name_event, function(movimiento_revisado){

            movProcesados ++;

            //console.log(movimiento_revisado);
            if(movimiento_revisado.Serie_Factura){
                idsMovimientos.push(movimiento_revisado.idmov);
               // console.log(movProcesados +' de '+ totalMov+' > '+movimiento_revisado.idmov);
           }

           

           if(movProcesados == totalMov){
            signal.remove();
            
            console.log('Hace el update a '+ idsMovimientos.length);

            t.query(`
              UPDATE secondary.interfaces_eta_rm_matriz SET enmatriz = true, enmatriz_revisado = now() WHERE enmatriz = false AND idreginterfacesmatriz = ANY($1::BIGINT[]);
              `, [idsMovimientos]).then(function(result){
                console.log(result);
// Una vez terminado debemos hacer el update a la tabla con el id para ponerlo como ENMATRIZ.
deferred.resolve(true);

}, function(fail){
    console.log(fail);
    deferred.reject(fail);
});

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
        var t = this;
        var srtquery = "USE EasyGestionEmpresarial; SELECT  top(1) tbl_maestromovinvent.Serie_Factura FROM tbl_maestromovinvent  INNER JOIN tbl_movinvent  ON tbl_maestromovinvent.Serie_Factura = tbl_movinvent.Serie_Factura WHERE tbl_maestromovinvent.FechaRegistro = '"+movsap.cpudt+" "+movsap.cputm+"' AND  tbl_movinvent.cantidad = "+movsap.menge+" AND  tbl_maestromovinvent.numero_doc_inv = '"+movsap.mblnr+"' and tbl_maestromovinvent.Oficina = (SELECT top (1) o.oficina FROM dbo.Oficina o WHERE o.ofi_codigo_interno_empresa = '"+movsap.werks+"' AND o.Compania = tbl_maestromovinvent.Compania) AND  codigo_producto = '"+Number(movsap.matnr)+"';";
   //console.log(srtquery);

   new mssql.Request(cnxmatriz)
   .query(srtquery).then(function(recordset) {

    //console.log(recordset);

    if(recordset.length > 0){
        var serie = recordset[0];
        serie.idmov = movsap.idreginterfacesmatriz;

        t.emit(name_event, serie);
    }else{
        t.emit(name_event, {Serie_Factura: false, idmov: movsap.idreginterfacesmatriz});
    }

}).catch(function(err) {
    console.log(err);
    t.emit(name_event, err);
});

}




});
});