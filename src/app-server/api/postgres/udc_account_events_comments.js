// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms",  "dojo/node!pg", "dojo/_base/array"], function(lang, OMS, pg, array){
	lang.extend(OMS, {
/////////////////////////////////////////

udc_account_events_comments: function(req, res){

	var t = this;

	if(req.body.UdcTable){

		var post = req.body;
		var qp;

		switch(post.UdcAction){
			case 'select_rows':
			var w = {};
			w["idevent"] = post.idevent;
			//w["isopen"] = true;

			qp = t.Select('event_comments', []).whereAnd([w]).orderBy(' ideventcomment ').build();
			t.response_query(req, res, qp.query, qp.param);
			break;
			case 'selectxxxx':
			var w = {};
			w["idevent"] = post.idevent;
			//w["isopen"] = true;

			qp = t.Select('view_events_isopen', []).whereAnd([w]).orderBy(' dateevent ').build();
			t.response_query(req, res, qp.query, qp.param);
			break;
			/*
			case 'update':
			var w = {};
			w[post.UdcRowFingerPrint] = post.UdcRowFingerPrintValue;
			w[post.UdcIdProperty] = post[post.UdcIdProperty];

			qp = t.Update(post.UdcTable, post, []).whereAnd([w], ["UdcAction", "UdcRowFingerPrint", "UdcRowFingerPrintValue", "UdcTable", "UdcIdProperty"]).build();
			t.response_update(req, res, qp.query, qp.param);
			break;	*/
			case 'insert':
			var w = {};
			//w[post.UdcRowFingerPrint] = post.UdcRowFingerPrintValue;
			//w[post.UdcIdProperty] = post[post.UdcIdProperty];

			qp = t.Insert('event_comments', post, []).build();
			t.response_insert(req, res, qp.query, qp.param);
			break;		
			default:
			res.status(500).json({success: false, data: "Intentando una accion invalida "+post.UdcAction, req: post});
	//return false;
	break;

}



}else{
	res.status(500).json({success: false, data: "No ha definido una tabla a buscar"});
}


}              


});
});
