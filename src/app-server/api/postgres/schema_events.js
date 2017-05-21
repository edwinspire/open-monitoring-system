// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms", "dojo/_base/array"], function(lang, OMS, array){
	lang.extend(OMS, {
/////////////////////////////////////////

schema_events: function(table, req, res){

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
schema_events_view_datas_details_isopen: function(req, res, params){

	var t = this;
	var post = req.body;
	var qp;
	var w = {};

	switch(params.action){
		case 'r':
		//var w = {tschema_tname: post.tschema_tname};
		qp = t.Select('events.view_datas_details_isopen', []).orderBy(' dateevent DESC ').build();
		t.response_query(res, qp.query, qp.param);
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
