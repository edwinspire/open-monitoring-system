// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms",  "dojo/store/Memory", "dojo/Deferred"], function(lang, OMS, Memory, Deferred){
  lang.extend(OMS, {

    _gui_view_table_view_columns_properties: new Memory(),

    gui_view_table_view_columns_properties: function(_table){
      var t = this;

      var deferred = new Deferred();

      if(t._gui_view_table_view_columns_properties && t._gui_view_table_view_columns_properties.data.length > 0){

        deferred.resolve(t._gui_view_table_view_columns_properties.query({tschema_tname: _table}));

      }else{
        var q = 'SELECT * FROM gui.view_table_view_columns_properties;';
        //console.dir(table);
        t.query(q, []).then(function(result){

          //console.trace(result);
          t._gui_view_table_view_columns_properties = new Memory({data: result.rows, idProperty: 'tschema_tname'});
          deferred.resolve(t._gui_view_table_view_columns_properties.query({tschema_tname: _table}));

        });

      }

      return deferred.promise;
    }










  });
});
