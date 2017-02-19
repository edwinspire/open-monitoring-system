// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms",  "dojo/node!pg", "dojo/_base/array"], function(lang, OMS, pg, array){
	lang.extend(OMS, {
/////////////////////////////////////////

udc_table_events_details: function(req, res){

	var t = this;

	if(req.body.UdcTable){

		var post = req.body;
		var qp;

		switch(post.UdcAction){
			case 'select_rows':

			qp = t.Select('view_events_isopen', []).orderBy(' dateevent DESC').build();
			t.response_query(req, res, qp.query, qp.param);
			break;
			// case 'select':
			// var w = {};
			// w["idevent"] = post.idevent;
			// //w["isopen"] = true;

			// qp = t.Select('view_events_isopen', []).whereAnd([w]).orderBy(' dateevent ').build();
			// t.response_query(req, res, qp.query, qp.param);
			// break;	
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
