define("oams/grid_structures/oams_table_columns",['dojo/_base/declare', 'dojo/Evented', 'dojo/date/locale'],function(_1, _2, _3){

  return _1([_2], {
	structure: {column_default: {r: {field:'column_default', width: 'auto' , name:'column_default'},  w: {field:'column_default', editable: 'true', name:'column_default'}},
column_label: {r: {field:'column_label', width: 'auto' , name:'column_label'},  w: {field:'column_label', editable: 'true', name:'column_label'}},
column_name: {r: {field:'column_name', width: 'auto' , name:'column_name'},  w: {field:'column_name', editable: 'true', name:'column_name'}},
column_width: {r: {field:'column_width', width: 'auto' , name:'column_width'},  w: {field:'column_width', editable: 'true', name:'column_width'}},
data_type: {r: {field:'data_type', width: 'auto' , name:'data_type'},  w: {field:'data_type', editable: 'true', name:'data_type'}},
idword: {r: {field:'idword', width: 'auto' , name:'idword'},  w: {field:'idword', editable: 'true', name:'idword'}},
table_name: {r: {field:'table_name', width: 'auto' , name:'table_name'},  w: {field:'table_name', editable: 'true', name:'table_name'}},
ts: {r: {field:'ts', width: 'auto' , dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'ts'},  w: {field:'ts', editable: 'true', dataType: 'datetime', decorator: function(value)
{
  try {
    if (value) {
      var dt = new Date(value.replace('T', ' '));
return _3.format(dt, { selector: "date", datePattern: "yyyy-MM-dd HH:mm:ss"}); 
    }
  } catch (e) {
    console.error('error decorating date: ' + e.toString());
  }
}, name:'ts'}}}


});


});