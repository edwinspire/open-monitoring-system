// Dojo 1.7+ (AMD)
"dojo/promise/all"
require(["dojo/_base/lang", "api/scheduled_tasks/scheduled_tasks",   "dojo/Deferred", "dojo/_base/array", "dojo/promise/all", "dojo/on", "dojo/node!mssql"], function(lang, Octopus, Deferred, array, all, on, mssql){
	lang.extend(Octopus, {
/////////////////////////////////////////
run_resumen_carga_mov_inv: function(task){
	
	var deferred = new Deferred();
	var t = this;

    if(task.task_parameters.ideventtype_on_alarm && task.task_parameters.ideventtype_on_restore){
       t.query(`SELECT secondary.fun_gen_resume_mov_inv($1::bigint, $2::bigint);`, [task.task_parameters.ideventtype_on_alarm, task.task_parameters.ideventtype_on_restore]).then(function(result){
        deferred.resolve(true);
    }, function(error){
        console.log(error);
        deferred.resolve(true);
    });

   }else{
    deferred.resolve(true);
}



return deferred.promise;
}




});
});