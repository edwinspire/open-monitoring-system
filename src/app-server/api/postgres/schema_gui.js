// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms", "dojo/_base/array"], function(lang, OMS, array){
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
        //console.dir(table);
        t.query(q, []).then(function(result){

          //console.trace(result);
          t._schema_gui_properties_store = new Memory({data: result.rows, idProperty: 'tschema_tname'});
          deferred.resolve(t._schema_gui_properties_store.query({tschema_tname: _table}));

        });

      }

      return deferred.promise;
    },


schema_gui: function(table, req, res){

	var t = this;

	if(table){

		var post = req.body;
		var qp;

		switch(post.UdcAction){
			case 'select_rows':
			qp = t.Select(table, []).orderBy(' tschema_tname DESC').build();
			t.response_query(res, qp.query, qp.param);
			break;

			case 'select_rows':
			qp = t.Select(table, []).orderBy(' tschema_tname DESC').build();
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
