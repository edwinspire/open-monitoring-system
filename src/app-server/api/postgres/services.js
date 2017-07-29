// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms", "dojo/_base/array", "api/postgres/service_event_receiver"], function(lang, OMS, array){
	lang.extend(OMS, {
/////////////////////////////////////////

service_htttp: function(req, res, params){
/*
	var t = this;
	var post = req.body;
	var qp;
	var w = {};

	switch(params.action){
		case 'w':
		//console.log(post);
		if(post.idequipment && post.validator && post.list_events){
			t.response_query(res, "SELECT events.fun_receiver_json($1::BIGINT, $2::TEXT, $3::JSON);", [post.idequipment, post.validator, post.list_events]);
		}else{
			res.status(500).json({success: false, data: "Los datos enviados no estan completos o no son validos", params: params});
		}	

		break;		
		default:
		res.status(400).json({success: false, data: "No ha definido una accion a realizar correcta.", params: params});
		break;
	}
	*/

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
					r.Message = result.Message;
					r.Return = result.Return;
					console.log(r);
					clientio.emit('wssreturn', r);

				}, function(error){
					r.Message = error;
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