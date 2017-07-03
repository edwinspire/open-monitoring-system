// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms", "dojo/_base/array"], function(lang, OMS, array){
	lang.extend(OMS, {
/////////////////////////////////////////

schema_secondary_view_mov_inv_eta_pendientesxxxxxx: function(table, req, res){

	var t = this;

	if(table){

		var post = req.body;
		var qp;

		switch(post.__action){
			case 'select_rows':

			qp = t.Select(table, []).orderBy(' dateevent DESC').build();
			t.response_query(res, qp.query, qp.param);
			break;

			default:
			res.status(500).json({success: false, data: "Intentando una accion invalida "+post.__action, req: post});
			break;

		}

	}else{
		res.status(500).json({success: false, data: "No ha definido una tabla a buscar"});
	}


}  ,
schema_secondary_view_mov_inv_sin_cargar_eta: function(req, res, params){

	var t = this;
	var post = req.body;
	var qp;
	var w = {};

	switch(params.action){
		case 'r':
		qp = t.Select('secondary.view_mov_inv_sin_cargar_eta', []).build();
		t.response_query(res, qp.query, qp.param);
		break;	
	default:
	res.status(400).json({success: false, data: "No ha definido una accion a realizar correcta.", params: params});
	break;
}

}  ,
schema_secondary_view_mov_inv_sin_cargar_rm: function(req, res, params){

	var t = this;
	var post = req.body;
	var qp;
	var w = {};

	switch(params.action){
		case 'r':
		qp = t.Select('secondary.view_mov_inv_sin_cargar_rm', []).build();
		t.response_query(res, qp.query, qp.param);
		break;
	default:
	res.status(400).json({success: false, data: "No ha definido una accion a realizar correcta.", params: params});
	break;
}

},
schema_secondary_view_mov_inv_duplicados_eta: function(req, res, params){

	var t = this;
	var post = req.body;
	var qp;
	var w = {};

	switch(params.action){
		case 'r':
		qp = t.Select('secondary.view_mov_inv_duplicados_eta', []).build();
		t.response_query(res, qp.query, qp.param);
		break;
	default:
	res.status(400).json({success: false, data: "No ha definido una accion a realizar correcta.", params: params});
	break;
}

},
schema_secondary_view_mov_inv_duplicados_rm: function(req, res, params){

	var t = this;
	var post = req.body;
	var qp;
	var w = {};

	switch(params.action){
		case 'r':
		qp = t.Select('secondary.view_mov_inv_duplicados_rm', []).build();
		t.response_query(res, qp.query, qp.param);
		break;
	default:
	res.status(400).json({success: false, data: "No ha definido una accion a realizar correcta.", params: params});
	break;
}

}








});
});
