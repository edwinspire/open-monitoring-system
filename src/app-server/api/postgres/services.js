// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms", "dojo/_base/array", "api/postgres/service_event_receiver", "api/postgres/service_eta_interfaces_txt", "api/postgres/service_eta_resultado_validacion_txt_interfaces"], function(lang, OMS, array){
	lang.extend(OMS, {
/////////////////////////////////////////

service_htttp: function(req, res, params){

//t.response_query(res, "SELECT * FROM public.view_accounts WHERE iddivision = $1::BIGINT", [iddivision]);

},
service_ws: function(clientio, message){

	var r = {Service: "", Return: [], Message: "", DeviceKey: message.DeviceKey};
	var t = this;
	if(message.Request){

		array.forEach(message.Request, function(service, i){

			var s = "service_"+service.Service;

			if(t[s]){

				t[s](message.DeviceKey, service.Datas).then(function(result){

					r.Service = service.Service;
					r.Return = result;
					
					clientio.emit('wssreturn', r);

				}, function(error){
					r.Message = error;
					r.Service = service.Service;
					console.log(r);
					clientio.emit('wssreturn', r);
				}).catch(function () {
					console.log("Promise Rejected");
				});

			}else{
				r.Message = service.Service+' service no found.';			
				clientio.emit('wssreturn', r);
			}

		});

	}else{
		r.Message = 'Request no found.';			
		clientio.emit('wssreturn', r);
	}


}  



});
});