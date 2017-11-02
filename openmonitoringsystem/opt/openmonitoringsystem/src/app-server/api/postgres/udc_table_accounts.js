// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms",  "dojo/node!pg", "dojo/_base/array"], function(lang, OMS, pg, array){
	lang.extend(OMS, {
/////////////////////////////////////////

udc_table_accounts: function(req, res){

	var t = this;

	if(req.body.__affected_table){

		var post = req.body;
		var qp;

		switch(post.__action){
			case 'select':
			var w = {};
			w[post.__idProperty] = post[post.__idProperty];
			if(w[post.__idProperty] > 0){
				qp = t.Select(post.__affected_table, []).whereAnd([w]).build();
				t.response_query(res, qp.query, qp.param);
			}else{
				res.status(500).json({success: false, data: "ID no ha sido ingresado ", req: post});	
			}
			break;
			case 'insert':
			var w = {};
			qp = t.Insert(post.__affected_table, post, []).build();
			t.response_insert(res, qp.query, qp.param);
			break;	
			case 'update':
			//TODO: Falta agregar un control aqui para el fingerprint
			var w = {};
			w[post.__idProperty] = post[post.__idProperty];

			qp = t.Update(post.__affected_table, post, []).whereAnd([w], ["__action", "UdcRowFingerPrint", "UdcRowFingerPrintValue", "__affected_table", "__idProperty"]).build();
			t.response_update(res, qp.query, qp.param);
			break;	
			default:
			res.status(500).json({success: false, data: "Intentando una accion invalida "+req.body.__action, req: post});
			break;

		}


	}else{
		res.status(500).json({success: false, data: "No ha definido una tabla a buscar"});
	}


}              


});
});
