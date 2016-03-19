define("oams/grid_structures/account_states",['dojo/_base/declare', 'dojo/Evented', 'dojo/date/locale'],function(_1, _2, _3){

  return _1([_2], {
	structure: {idaccountstate: {r: {field:'idaccountstate', width: 'auto' , name:'idaccountstate'},  w: {field:'idaccountstate', editable: 'true', name:'idaccountstate'}},
note: {r: {field:'note', width: 'auto' , name:'Notas'},  w: {field:'note', editable: 'true', name:'Notas'}},
state: {r: {field:'state', width: 'auto' , name:'Estado'},  w: {field:'state', editable: 'true', name:'Estado'}},
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