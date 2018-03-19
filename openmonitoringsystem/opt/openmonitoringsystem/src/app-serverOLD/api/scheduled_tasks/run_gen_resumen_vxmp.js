// Dojo 1.7+ (AMD)
"dojo/promise/all"
require(["dojo/_base/lang", "api/scheduled_tasks/scheduled_tasks",   "dojo/Deferred", "dojo/_base/array", "dojo/promise/all", "dojo/on",  "dojo/node!mssql", "dojo/date"], function(lang, Octopus, Deferred, array, all, on, mssql, DojoDate){
	lang.extend(Octopus, {
/////////////////////////////////////////
run_gen_resumen_vxmp: function(task){

	var deferred = new Deferred();
	var t = this;
	return t.query('SELECT secondary.fun_gen_resumen_vxmp();', []);
}



});
});

