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

    console.log(task.task_parameters.empresa, limit, orden);

    t.query(`
        SELECT idreginterfacesmatriz, cpudt, cputm, menge, mblnr, matnr, werks FROM secondary.view_movinv_sap WHERE (enmatriz = false OR isvalid = false) AND bukrs = $1::TEXT ORDER BY datetimefile ${orden} LIMIT ${limit};
        `, [task.task_parameters.empresa]).then(function(result){

            var totalMov = result.rows.length;

            var signal = t.on(name_event, function(movimiento_revisado){

                movProcesados ++;

                if(movimiento_revisado.Serie_Factura){
                    idsMovimientos.push(movimiento_revisado.idmov);
                }

                if(movProcesados == totalMov){
                    signal.remove();

                    t.query(`
                      UPDATE secondary.interfaces_eta_rm_matriz SET enmatriz = true, enmatriz_revisado = now(), isvalid = true WHERE idreginterfacesmatriz = ANY($1::BIGINT[]);
                      `, [idsMovimientos]).then(function(result){

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
        var srtquery = "USE EasyGestionEmpresarial; SELECT tbl_maestromovinvent.Serie_Factura FROM tbl_maestromovinvent  INNER JOIN tbl_movinvent  ON tbl_maestromovinvent.Serie_Factura = tbl_movinvent.Serie_Factura WHERE tbl_maestromovinvent.FechaRegistro = '"+movsap.cpudt+" "+movsap.cputm+"' AND  tbl_movinvent.cantidad = "+movsap.menge+" AND  tbl_maestromovinvent.numero_doc_inv = '"+movsap.mblnr+"' and tbl_maestromovinvent.Oficina = (SELECT top (1) o.oficina FROM dbo.Oficina o WHERE o.ofi_codigo_interno_empresa = '"+movsap.werks+"' AND o.Compania = tbl_maestromovinvent.Compania) AND  codigo_producto = '"+Number(movsap.matnr)+"';";

        new mssql.Request(cnxmatriz)
        .query(srtquery).then(function(recordset) {

          if(recordset.length == 1){

            var serie = recordset[0];
            serie.idmov = movsap.idreginterfacesmatriz;
            t.emit(name_event, serie);

        }else if(recordset.length > 1){

            var rmov = {Serie_Factura: []};

            array.forEach(recordset, function(m){
                rmov.Serie_Factura.push(m.Serie_Factura);
            });

            t.query(`
                UPDATE secondary.interfaces_eta_rm_matriz SET enmatriz = true, enmatriz_revisado = now(), isvalid = false, observations = $1::JSONB WHERE idreginterfacesmatriz = $2::BIGINT;
                `, [rmov, movsap.idreginterfacesmatriz]).then(function(result){
                    t.emit(name_event, {Serie_Factura: false, idmov: movsap.idreginterfacesmatriz});
                }, function(fail){
                    console.log(fail);
                    t.emit(name_event, {Serie_Factura: false, idmov: movsap.idreginterfacesmatriz});
                });

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