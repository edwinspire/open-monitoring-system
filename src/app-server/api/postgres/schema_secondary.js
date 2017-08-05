// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms", "dojo/_base/array", "dojo/date"], function(lang, OMS, array, DojoDate){
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

},
schema_secondary_view_docvxmp: function(req, res, params){

	var t = this;
	var post = req.body;
	var qp;
	var dias_atras = 30;
	var iddivision = 6;

	if(post.dias_atras && post.dias_atras > 0){
		dias_atras = post.dias_atras;
	}

	if(post.iddivision && post.iddivision > 0){
		iddivision = post.iddivision;
	}

	var fecha_atras = DojoDate.add(new Date(), "day", dias_atras*(-1)).toLocaleString();

	switch(params.action){
		case 'r':
		t.response_query(res, "SELECT * FROM secondary.view_docvxmp WHERE iddivision = $1::BIGINT AND datetimefile>= $2::timestamp with time zone ORDER BY num_documento, datetimefile, account_name;", [iddivision, fecha_atras]);
		break;	
		default:
		res.status(400).json({success: false, data: "No ha definido una accion a realizar correcta.", params: params});
		break;
	}

},
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
schema_secondary_view_mov_inv_sin_cargar_cr: function(req, res, params){

	var t = this;
	var post = req.body;
	var qp;
	var w = {};

	switch(params.action){
		case 'r':
		qp = t.Select('secondary.view_mov_inv_sin_cargar_cr', []).build();
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

},
schema_secondary_view_lista_precios_oficinas: function(req, res, params){

	var t = this;

	var post = req.body;
	var qp;
	//	var list_promo = ['335','018','332','117','284','070','252','287','305','011','031','256','279','069','118','234','483','359','017','309','480','955','464','226','262','086','375','282','051','278','081','137','132','181','373','378','115','044','225','237','303','360','174','396','202','391','224','004','525','162','376','166','250','090','101','321','889','334','111','421','413','411','039','452','395','944','061','578','517','404','511','886','424','454','887','531','540','900','558','417','573','893','570','895','553','459','430','401','943','495','136','405','499','562','423','539','389','213','295','199','206','037','161','387','314','228','063','203','516','236','549','146','400','361','892','164','140','156','255','021','283','280'];
	//var list_promo = ['585','926','110','028','416','435','347','269','306','381','547','189','059','348','571','409','463','367','114','556','029','453','175','530','346','371','076','113','193','139','077','336','891','487','372','554','402','890','080','190','501','438','420','307','386','038','121','340','455','130','265','182','200','512','470','352','564','485','398','390','369','456','408','345','949','320','330','344','385','377','576','431','410','426','446','126','248','158','310','898','412','103','211','308','064','468','565','535','473','119','513','496','537','384','354','382','436','429','467','434','351','509','500','266','477','062','490','541','050','538','079','486','927','526','948','567','048','153','078','353','888','425','102','383','108'];
	var list_promo = ['566','897','521','563','554'];
	
	var list_promo2 = ['450','592','899','394','448','393','195','559','124','343','645','291','002','185','075','551','125','337','187','328','479','149','276','106','107','060','319','155','312','247','407','494','492','561','415','552','152','154','331','397','341','176','536','009','217'];
	var list_promo3 = ['110','926','347','306','381','547','348','571','409','463','371','438','420','386','038','121','288','340','455','408','345','949','320','330','344','385','377','576','410','431','426','446','158','898','412','119','513','586','537','384','354','382','436','429','467','434','351','509','490','541','538','621','486','589','016','927','526','624','367','948','567','048','888'];
	var list_promo4 = ['157','298','043','207','392','350','355','380','229','033','034','045','042','088','219','896','569','472','581','493','197'];
	var list_promo = ['566','897','521','563','554'];

	switch(params.action){
		case 'r':

		var w = {};

		switch(post.Selection){
			case 'eco':
			q = "SELECT * FROM secondary.view_lista_precios_oficinas  WHERE iddivision = 1 AND account_name ILIKE  'ECO%' ORDER BY account";
			t.response_query(res, q, []);
			break;
			case 'medi':
			q = "SELECT * FROM secondary.view_lista_precios_oficinas  WHERE iddivision = 1 AND account_name ILIKE  'MEDI%' ORDER BY account";
			t.response_query(res, q, []);
			break;
			case 'pnatural':
			q = "SELECT * FROM secondary.view_lista_precios_oficinas  WHERE account_name ILIKE  '%PUNTO%' ORDER BY account";
			t.response_query(res, q, []);
			break;			
			case 'promo_medi':
			q = "SELECT * FROM secondary.view_lista_precios_oficinas  WHERE iddivision = 1 AND  account = ANY($1::text[]) AND account_name ILIKE  'MEDI%' ORDER BY account";
			//q = "SELECT * FROM secondary.view_lista_precios_oficinas  WHERE iddivision = 1 AND account_name ILIKE  'MEDI%' ORDER BY account";
			t.response_query(res, q, [list_promo]);
			break;
			case 'promo_eco':
			q = "SELECT * FROM secondary.view_lista_precios_oficinas  WHERE iddivision = 1 AND  account = ANY($1::text[]) AND account_name ILIKE  'ECO%' ORDER BY account";
			t.response_query(res, q, [list_promo4]);
			break;
			default:
			res.status(500).json({success: false, data: "Intentando una accion invalida "+post.UdcAction, req: post});
			break;
		}




		break;
		default:
		res.status(500).json({success: false, data: "Intentando una accion invalida "+post.UdcAction, req: post});
	//return false;
	break;

}


}              









});
});
