define("oams/grid_structures/contacts_groups",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: {idcontact: {r: {field:'idcontact', width: 'auto' , name:'idcontact'},  w: {field:'idcontact', editable: 'true', name:'idcontact'}},
idcontactgroup: {r: {field:'idcontactgroup', width: 'auto' , name:'idcontactgroup'},  w: {field:'idcontactgroup', editable: 'true', name:'idcontactgroup'}},
idgroup: {r: {field:'idgroup', width: 'auto' , name:'idgroup'},  w: {field:'idgroup', editable: 'true', name:'idgroup'}},
ts: {r: {field:'ts', width: 'auto' , dataType: 'datetime',  name:'ts'},  w: {field:'ts', editable: 'true', dataType: 'datetime', name:'ts'}}}


});


});