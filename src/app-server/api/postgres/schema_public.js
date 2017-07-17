// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms", "dojo/_base/array"], function(lang, OMS, array){
	lang.extend(OMS, {
/////////////////////////////////////////

schema_public: function(table, req, res){

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


},
schema_public_view_accounts: function(req, res, params){

	var t = this;
	var post = req.body;
	var qp;
	var iddivision = -1;

	if(post.iddivision && post.iddivision >= 0){
		iddivision = post.iddivision;
	}

	switch(params.action){
		case 'r':
		t.response_query(res, "SELECT * FROM public.view_accounts WHERE iddivision = $1::BIGINT", [iddivision]);
		break;	
		default:
		res.status(400).json({success: false, data: "No ha definido una accion a realizar correcta.", params: params});
		break;
	}

},
schema_public_view_admins: function(req, res, params){

	var t = this;
	var post = req.body;
	var qp;
	var iddivision = -1;

	if(post.iddivision && post.iddivision >= 0){
		iddivision = post.iddivision;
	}

	var fecha_atras = DojoDate.add(new Date(), "day", dias_atras*(-1)).toLocaleString();

	switch(params.action){
		case 'r':
		t.response_query(res, "SELECT * FROM public.view_accounts WHERE iddivision = $1::BIGINT", [iddivision]);
		break;	
		default:
		res.status(400).json({success: false, data: "No ha definido una accion a realizar correcta.", params: params});
		break;
	}

},
schema_public_divisions: function(req, res, params){

	var t = this;
	var post = req.body;
	var qp;
	var iddivision = -1;

	if(post.iddivision && post.iddivision >= 0){
		iddivision = post.iddivision;
	}

	switch(params.action){
		case 'rs': // read select
		t.response_query(res, "SELECT iddivision as id, name FROM public.divisions;", []);
		break;	
		default:
		res.status(400).json({success: false, data: "No ha definido una accion a realizar correcta.", params: params});
		break;
	}

}











});
});