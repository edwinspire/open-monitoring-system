// Dojo 1.7+ (AMD)
"dojo/promise/all"
require(["dojo/_base/lang", "api/scheduled_tasks/scheduled_tasks",   "dojo/Deferred", "dojo/_base/array", "dojo/promise/all", "dojo/on", "dojo/node!mssql"], function(lang, Octopus, Deferred, array, all, on, mssql){
	lang.extend(Octopus, {
/////////////////////////////////////////
run_resumen_facturacion_electronica: function(task){
	
	var deferred = new Deferred();
	var t = this;
    t._run_resumen_facturacion_electronica(task.task_parameters).then(function(){
        deferred.resolve(true);
    }, function(){
        deferred.resolve(true);
    });

    return deferred.promise;
},
_run_resumen_facturacion_electronica: function(param){
    var t = this;
    var deferred = new Deferred(); 

    var srtquery = `USE facturacionelectronica; 

SELECT (SELECT Count(*) 
        FROM   pv_xmlfacturacionelectronica (nolock) 
        WHERE  serie_factura NOT IN (SELECT den_serie_factura 
                                     FROM   ge_tmp_documentosenviados (nolock) 
                                     WHERE  den_tipo_documento IN ( 
                                            '01', '04', '06' )) 
       )                                                        AS pendientes, 
       Cast((SELECT TOP(1) dpr_fecha_proceso 
             FROM   gen_tmp_documentosprocesados 
             ORDER  BY dpr_fecha_proceso DESC) AS DATETIME2)    AS 
       ultimo_procesado, 
       (SELECT Count(*) 
        FROM   gen_tmp_documentosprocesados 
        WHERE  dpr_estado_proceso = 'En Proceso')               AS en_proceso, 
       CONVERT(VARCHAR, (SELECT TOP (1) glp_fecha_inicio 
                         FROM   gen_log_controlprocesos 
                         WHERE  glp_estado = 'QueryOn' 
                         ORDER  BY glp_fecha_inicio DESC), 120) AS queryon, 
       Cast((SELECT TOP(1) den_fecha_envio 
             FROM   ge_tmp_documentosenviados 
             ORDER  BY den_fecha_envio DESC) AS DATETIME2)      AS 
       ultimo_enviado; `;

    var config = {
        user: param.user,
        password: param.pwd,
        server: param.ip, 
        database: 'msdb',
        connectionTimeout: 90000,
        requestTimeout: 60000
    //options: {
      // encrypt: true
  //}
}

mssql.connect(config).then((cnx) => {

    new mssql.Request(cnx)
    .query(srtquery).then(function(recordset) {

        if(recordset.length > 0){

            var res = recordset[0];
            var descr = "<b>Pendientes: </b>"+res.pendientes+"</br><b>Ultimo procesado: </b>"+res.ultimo_procesado+"</br><b>En Proceso: </b>"+res.en_proceso+"</br><b>Ultimo Enviado: </b>"+res.ultimo_enviado+"</br><b>QueryOn: </b>"+res.queryon;
            var event = {idaccount: 0, ideventtype: param.ideventtype_on_alarm, source: t.textToMD5(param.ip), description: descr, details: {iddivision: param.iddivision}, priority: 2};

            t.send_event_pg(event, []).then(function(result){

                deferred.resolve(true);

            }, function(err){
                console.log(err);
                deferred.resolve(true);
            });
        }else{
         deferred.resolve(true);
     }


 }).catch(function(err) {
    console.trace(err);
    deferred.resolve(true);
});

}).catch(err => {
 console.trace(err);
 deferred.resolve(true);
})

return deferred.promise;
}




});
});