// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms", "dojo/_base/array", "dojo/store/Memory", "dojo/Deferred"], function(lang, OMS, array, Memory, Deferred){
	lang.extend(OMS, {
/////////////////////////////////////////
_schema_gui_properties_store: new Memory(),

_schema_gui_properties: function(_table){
	var t = this;

	var deferred = new Deferred();

	if(t._schema_gui_properties_store && t._schema_gui_properties_store.data.length > 0){

		deferred.resolve(t._schema_gui_properties_store.query({tschema_tname: _table}));

	}else{
		var q = 'SELECT * FROM gui.view_table_view_columns_properties;';
		t.query(q, []).then(function(result){

			t._schema_gui_properties_store = new Memory({data: result.rows, idProperty: 'tschema_tname'});
			deferred.resolve(t._schema_gui_properties_store.query({tschema_tname: _table}));

		});

	}

	return deferred.promise;
},

_schema_gui_properties_fromdb: function(){
	var t = this;

	var deferred = new Deferred();
	var q = 'SELECT * FROM gui.view_table_view_columns_properties;';
	t.query(q, []).then(function(result){

		t._schema_gui_properties_store = new Memory({data: result.rows, idProperty: 'tschema_tname'});
		deferred.resolve(true);

	}, function(err){
		deferred.reject(err);
	});
	return deferred.promise;
},

schema_gui_tvproperties: function(req, res, params){
	var t = this;
	if(params.action == 'r'){
	//console.dir(t._schema_gui_properties_store.data);
	res.status(200).json(t._schema_gui_properties_store.query({tschema_tname: req.body.tschema_tname}));
}else{
	res.status(500).json({success: false, data: 'No ha ingresado una accion valida', params: params});
}
},

schema_gui_tables_view_properties: function(req, res, params){

	var t = this;

	switch(params.action){
		case 'r':
		qp = t.Select('gui.tables_view_properties', []).orderBy(' tschema_tname DESC').build();
		t.response_query(res, qp.query, qp.param);
		break;
		default:
		res.status(500).json({success: false, data: "No ha definido una accion a realizar correcta.", params: params});
		break;
	}

},
schema_gui_view_columns_properties: function(req, res, params){

	var t = this;
	var post = req.body;
	var qp;
	var w = {};

	switch(params.action){
		case 'r':
		var w = {tschema_tname: post.tschema_tname};
		qp = t.Select('gui.view_columns_properties', []).whereAnd([w]).orderBy(' column_position ').build();
		t.response_query(res, qp.query, qp.param);
		break;
		case 'u':
		if(post.__idProperty){
			w[post.__idProperty] = post[post.__idProperty];
		// Falta un control para fingerprint
		qp = t.Update('gui.column_properties', post, ["hash_num"]).whereAnd([w], []).build();
		t.response_update(res, qp.query, qp.param);
	}else{
		res.status(400).json({success: false, data: "No ha enviado el parametro __idProperty.", params: params});
	}
	break;		
	default:
	res.status(400).json({success: false, data: "No ha definido una accion a realizar correcta.", params: params});
	break;
}

}             


});
});
