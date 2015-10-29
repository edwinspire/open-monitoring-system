define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!woams_equipments/woams_equipments.html',
    'oams/grid_structures/equipments',
    'oams/grid_structures/network_devices',
    'oams/grid_structures/view_equipments',
    'dijit/popup',
"dijit/TooltipDialog",
"dijit/form/CheckBox",
"dijit/form/Form" ,
'woams_common_gridx/woams_common_gridx',
    'dijit/ConfirmTooltipDialog'
], function (declare, _Widget, _Templated, templateString, gse, gsnd, gsve, popup) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        postCreate: function () {
            var t = this;

  t.Grid.set('Idnamefield', 'idequipment');
	t.load_data.on('click', function(){
  t.Grid.load({});
});


//** Dialogo exportar a csv **//
            t.export_csv.on('Click', function () {
t.idequipments_to_csv.set('value', t.Grid.get('Selectedids').toString());
                popup.open({
                    popup: t.CttdExportCSV,
                    around: t.export_csv.domNode
                });
            });
/*
t.CttdExportCSV.on('Execute', function(e){

});
*/

t.submit_export_csv.on('Click', function(e){
 popup.close(t.CttdExportCSV);
});

t.cancel_export_csv.on('Click', function(e){
 popup.close(t.CttdExportCSV);
});


        },

create_grid_view_equipments: function(){
            var t = this;

            var gs1 = new gsve();
            var gs1s = gs1.structure;

            t.Grid.Url = "oams_php_query/view_equipments.php";
            t.Grid.set("structure", [{field: "unique_id", name: "#", width: '35px'},
                gs1s.enabled.r, gs1s.account.r, gs1s.account_name.r, gs1s.equipment.r, gs1s.mark.r, gs1s.model.r, gs1s.description.r, gs1s.operability.r, gs1s.note.r, gs1s.oams_assigned.r
            ]);

            t.Grid.load({});

}







    });
});
