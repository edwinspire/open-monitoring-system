// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms", "dojo/_base/array"], function(lang, OMS, array){
	lang.extend(OMS, {
/////////////////////////////////////////

service_objects_view_equipment_config: function(req, res, params){

	var t = this;
	var post = req.body;
	var qp;

	switch(params.action){
		case 'r':
		if(post.idequipment && post.validator && post.file_name){
			t.response_query(res, "SELECT COALESCE((SELECT config FROM public.view_equipment_config WHERE (report_validator = $1::TEXT AND idequipment = $2::BIGINT) AND file_name = $3::TEXT LIMIT 1), (SELECT config FROM public.view_equipment_config WHERE EXISTS(SELECT * FROM equipments WHERE report_validator = $1::TEXT AND idequipment = $2::BIGINT) AND idequipment = 0 AND file_name = $3::TEXT), '{}') as object;", [post.validator, post.idequipment, post.file_name]);
		}else{
			res.status(500).json({success: false, data: "Los datos enviados no estan completos o no son validos", params: params});
		}		
		break;
		case 'uvvvvvvvvvvvv':
		qp = t.Update('gui.column_propertiesxxxxx', post, ["hash_num"]).whereAnd([params.onupdate], []).build();
		t.response_update(res, qp.query, qp.param);
		break;		
		default:
		console.log('No esta bien', params);
		res.status(400).json({success: false, data: "No ha definido una accion a realizar correcta.", params: params});
		break;
	}
},
service_events_receiver: function(req, res, params){

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
		case 'u':
		qp = t.Update('gui.column_propertiesxxxxx', post, ["hash_num"]).whereAnd([params.onupdate], []).build();
		t.response_update(res, qp.query, qp.param);
		break;		
		default:
		res.status(400).json({success: false, data: "No ha definido una accion a realizar correcta.", params: params});
		break;
	}

}               


});
});