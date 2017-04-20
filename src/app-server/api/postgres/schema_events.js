// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms", "dojo/_base/array"], function(lang, OMS, array){
	lang.extend(OMS, {
/////////////////////////////////////////

schema_events: function(table, req, res){

	var t = this;

	if(table){

		var post = req.body;
		var qp;

		switch(post.UdcAction){
			case 'select_rows':

			qp = t.Select(table, []).orderBy(' dateevent DESC').build();
			t.response_query(res, qp.query, qp.param);
			break;

			default:
			res.status(500).json({success: false, data: "Intentando una accion invalida "+post.UdcAction, req: post});
			break;

		}

	}else{
		res.status(500).json({success: false, data: "No ha definido una tabla a buscar"});
	}


}              


});
});
