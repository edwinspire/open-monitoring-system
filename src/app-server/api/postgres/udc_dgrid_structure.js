// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms",  "dojo/node!pg", "dojo/store/Memory"], function(lang, OMS, pg, Memory){
  lang.extend(OMS, {

    _store_structure: new Memory(),

    get_table_structure: function(_table){
      var t = this;

      if(_table){
       return t._store_structure.query(t._store_structure.get(_table));
     }else{
      return {table: _table, error: 'Table undefined'};
    }

  },
  get_dgrid_fullstructure: function(){

    var t = this;
    t.tv_structure = {};
    t._store_structure = new Memory({data: null, idProperty: 'tv_name'});


    var q = 'SELECT *,    (      select array_to_json(array_agg(row_to_json(d)))      from (         select dgrid_editor_args as "editorArgs", dgrid_sortable as sortable, dgrid_editon as "editOn", dgrid_resizable as resizable, column_name as field, column_label as "label", dgrid_rendercell as "renderCell", dgrid_classname as "className", dgrid_formatter as formatter, dgrid_editor as editor, data_type       from udc_columns where idtableview = udc_tables_views.idtableview  ORDER BY column_position      ) d    ) as udc_column_definition  from udc_tables_views';
    pg.connect(t.connString(), (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      //return res.status(500).json({success: false, data: err});
      return false;
    }

    var query = client.query(q);

    query.on('row', (row) => {

//console.log(row);
//t.tv_structure[row.tv_name] = row;
t._store_structure.put(row);
//t.emit("get_dgrid_structure", row);
});


  // After all data is returned, close connection and return results
  query.on('end', (result1) => {

    done();
    //t.emit("get_dgrid_structure", t._store_structure);
  });





});

  }










});
});
