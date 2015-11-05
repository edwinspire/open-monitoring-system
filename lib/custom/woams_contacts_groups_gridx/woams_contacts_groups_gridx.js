define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!woams_contacts_groups_gridx/woams_contacts_groups_gridx.html',
    'oams/grid_structures/view_contact_groups_they_belong'
], function (declare, _Widget, _Templated, templateString, gsContactsGroups) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
_idcontact: null,
        postCreate: function () {
var t = this;
            var stcg = new gsContactsGroups();
            var sg1 = stcg.structure;

      t.GridGroups.set("autoupdaterow", true);
		t.GridGroups.set("idnamefield", 'idcontact');
            t.GridGroups.Url = "oams_php_query/view_contact_groups.php";
            t.GridGroups.set("structure", [{field: "unique_id", name: "#", width: '35px'},
                sg1.ismember.w, sg1.name.r, sg1.description.r
            ]);

t.GridGroups.on('onupdaterowonserver', function(e){
t.load(this._idcontact);
});

       },
load: function(_idcontact){
this._idcontact = _idcontact;
            this.GridGroups.load({idcontact: this._idcontact});
},
resize: function(r){
this.GridGroups.resize(r);
}




});
});
