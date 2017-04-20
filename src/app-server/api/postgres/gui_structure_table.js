// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms",  "dojo/store/Memory", "dojo/Deferred"], function(lang, OMS, Memory, Deferred){
  lang.extend(OMS, {

    _gui_structure_table: new Memory(),

    gui_structure_table: function(table){
      var t = this;

      var deferred = new Deferred();

      if(t._gui_structure_table && t._gui_structure_table.data.length > 0){

        deferred.resolve(t._gui_structure_table.query({tschema_tname: table}));

      }else{
        var q = 'SELECT * FROM gui.view_table_view_columns_properties WHERE tschema_tname = $1::TEXT ORDER BY column_position;';
        //console.dir(table);
        t.query(q, [table]).then(function(result){

          //console.trace(result);
          t._gui_structure_table = new Memory({data: result.rows, idProperty: 'tschema_tname'});
          deferred.resolve(t._gui_structure_table.query({tschema_tname: table}));

        });

      }

      return deferred.promise;
    }










  });
});
