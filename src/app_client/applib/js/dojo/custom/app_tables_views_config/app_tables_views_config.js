define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!Widget/app_tables_views_config/app_tables_views_config.html',
    "dojo/dom-class",
    "dojo/on", "dojo/query",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/window",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "Widget/uDCGridWidget/uDCGridWidget"
], function (declare, _Widget, _Templated, templateString, domClass, on, query, domStyle, domClass, w) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        postCreate: function () {
	var t = this;
	
	domStyle.set(t.domNode, 'min-height', w.getBox().h-70+'px');
	on(t.TTableView, 'ClickRow', function(e){
		t.TTableColumns.Grid.Select({idtableview: e.idtableview});
	});
	
     
        },
         resize: function() {
       	//	this.TAB.resize();
        }
          
                
    });
});
