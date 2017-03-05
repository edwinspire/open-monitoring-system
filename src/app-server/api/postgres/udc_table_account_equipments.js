// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms",  "dojo/node!pg", "dojo/_base/array"], function(lang, OMS, pg, array){
	lang.extend(OMS, {
/////////////////////////////////////////

udc_table_account_equipments: function(req, res){

	var t = this;

	if(req.body.UdcTable){

		var post = req.body;
		var qp;

		switch(post.UdcAction){
			case 'select_rows':
			var w = {};
			w["idaccount"] = post.idaccount;

			qp = t.Select(post.UdcTable, []).whereAnd([w]).build();
			t.response_query(res, qp.query, qp.param);
			break;
			case 'update':
			var w = {};
			w[post.UdcRowFingerPrint] = post.UdcRowFingerPrintValue;
			w[post.UdcIdProperty] = post[post.UdcIdProperty];

			qp = t.Update(post.UdcTable, post, []).whereAnd([w], ["UdcAction", "UdcRowFingerPrint", "UdcRowFingerPrintValue", "UdcTable", "UdcIdProperty"]).build();
			t.response_update(res, qp.query, qp.param);
			break;	
			case 'insert':
			var w = {};
			w[post.UdcRowFingerPrint] = post.UdcRowFingerPrintValue;
			w[post.UdcIdProperty] = post[post.UdcIdProperty];

			qp = t.Insert(post.UdcTable, post, []).build();
			t.response_insert(res, qp.query, qp.param);
			break;			
			default:
			res.status(500).json({success: false, data: "Intentando una accion invalida "+post.UdcAction, req: post});=
			break;

		}



	}else{
		res.status(500).json({success: false, data: "No ha definido una tabla a buscar"});
	}


}              


});
});
