// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms",  "dojo/node!pg", "dojo/_base/array"], function(lang, OMS, pg, array){
	lang.extend(OMS, {
/////////////////////////////////////////

udc_table_accounts: function(req, res){

	var t = this;

	if(req.body.UdcTable){

		var post = req.body;
		var qp;

		switch(post.UdcAction){
			case 'select':
			var w = {};
			w[post.uDCidProperty] = post[post.uDCidProperty];
			if(w[post.uDCidProperty] > 0){
				qp = t.Select(post.UdcTable, []).whereAnd([w]).build();
				t.response_query(res, qp.query, qp.param);
			}else{
				res.status(500).json({success: false, data: "ID no ha sido ingresado ", req: post});	
			}
			break;
			case 'insert':
			var w = {};
			qp = t.Insert(post.UdcTable, post, []).build();
			t.response_insert(res, qp.query, qp.param);
			break;	
			case 'update':
			var w = {};
			w[post.uDCidProperty] = post[post.uDCidProperty];

			qp = t.Update(post.UdcTable, post, []).whereAnd([w], ["UdcAction", "UdcRowFingerPrint", "UdcRowFingerPrintValue", "UdcTable", "UdcIdProperty"]).build();
			t.response_update(res, qp.query, qp.param);
			break;	
			default:
			res.status(500).json({success: false, data: "Intentando una accion invalida "+req.body.UdcAction, req: post});
			break;

		}


	}else{
		res.status(500).json({success: false, data: "No ha definido una tabla a buscar"});
	}


}              


});
});
