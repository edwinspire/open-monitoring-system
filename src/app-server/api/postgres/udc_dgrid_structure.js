// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms",  "dojo/node!pg", "dojo/store/Memory", "dojo/Deferred"], function(lang, OMS, pg, Memory, Deferred){
  lang.extend(OMS, {

    _store_structure: new Memory(),

    get_table_structure: function(_table){
      var t = this;
      var resultado = [];

      t._store_structure.query({tv_name: _table}).forEach(function(r){
        resultado.push(r);
      });

      return resultado;
    },
    get_dgrid_fullstructure: function(){
      var t = this;
      var q = 'SELECT *, (select array_to_json(array_agg(row_to_json(d)))  from ( select dgrid_editor_args as "editorArgs", dgrid_sortable as sortable, dgrid_editon as "editOn", dgrid_resizable as resizable, column_name as field, column_label as "label", dgrid_rendercell as "renderCell", dgrid_classname as "className", dgrid_formatter as formatter, dgrid_editor as editor, data_type  from udc_columns where idtableview = udc_tables_views.idtableview  ORDER BY column_position ) d ) as udc_column_definition  from udc_tables_views';
      var deferred = new Deferred();

      t.query(q, []).then(function(result){
        t._store_structure = new Memory({data: result.rows, idProperty: 'tv_name'});
        deferred.resolve(result);
      });
      return deferred.promise;
    }










  });
});
