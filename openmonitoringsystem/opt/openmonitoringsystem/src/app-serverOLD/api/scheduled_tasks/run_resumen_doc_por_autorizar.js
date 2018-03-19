// Dojo 1.7+ (AMD)
"dojo/promise/all"
require(["dojo/_base/lang", "api/scheduled_tasks/scheduled_tasks",   "dojo/Deferred", "dojo/_base/array", "dojo/date/locale", "dojo/date", "dojo/node!mssql"], function(lang, Octopus, Deferred, array, dateLocale, DojoDate, mssql){
	lang.extend(Octopus, {
/////////////////////////////////////////
run_resumen_doc_por_autorizar: function(task){

    var deferred = new Deferred();
    var t = this;
    t._run_resumen_doc_por_autorizar(task.task_parameters).then(function(){
        deferred.resolve(true);
    }, function(){
        deferred.resolve(true);
    });

    return deferred.promise;
},
_run_resumen_doc_por_autorizar: function(param){
    var t = this;
    var deferred = new Deferred(); 

    var srtquery = `
    USE EasyGestionEmpresarial;
    SELECT  Convert(char(8), fecha_factura, 112) as fecha, count(*) as pendientes
    FROM EasyGestionEmpresarial..tbl_maestrofact m with (nolock)  
    WHERE convert(varchar,fecha_factura,111)>='2017/01/01' 
    and tipopedido='B' 
    and numero_aut_factura ='9999999990' 
    and estatus='A' 
    and mf_estado_envio <>'OK' 
    GROUP BY Convert(char(8), fecha_factura, 112) ORDER BY fecha;
    `;

    var config = {
        user: param.user,
        password: param.pwd,
        server: param.ip, 
        database: 'msdb',
        connectionTimeout: 90000,
        requestTimeout: 90000
    //options: {
      // encrypt: true
  //}
}

mssql.connect(config).then((cnx) => {

    new mssql.Request(cnx)
    .query(srtquery).then(function(recordset) {

        //console.log(recordset);
          var priority = 99;
          var eventtype = param.ideventtype_on_restore;
          priority = 10;
          var descr = "<b>PENDIENTES:</b></br>";

        if(recordset.length >= 0){

          try{

if(recordset.length){
            
            array.forEach(recordset, function(item, i){
                descr = descr+"<b>"+item.fecha+"</b>:  "+item.pendientes+"</br>";
                if(i > 0){
                    priority = 1;
                    eventtype = param.ideventtype_on_alarm;
                }
            }); 
}else{
  descr = "Todos autorizados.";
}

            var event = {dateevent: new Date(), idaccount: 0, ideventtype: eventtype, source: t.textToMD5(param.ip), description: descr, details: {iddivision: param.iddivision}, priority: priority};
//console.log("Empieza el envio", event);
            t.send_event_pg(event, []).then(function(result){

//console.log("Enviado", result);
                deferred.resolve(true);

            }, function(err){
                console.log(err);
                deferred.resolve(true);
            });

        }catch(error){
            console.trace(error);
            deferred.resolve(error);
        }

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