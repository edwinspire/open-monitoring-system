/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */
// modules:['gridx/modules/Focus', 'gridx/modules/Edit', 'gridx/modules/CellWidget', 'gridx/modules/VirtualVScroller']
require(["dojo/ready",  
"dojo/on",
"dojo/Evented",
"dojo/data/ItemFileWriteStore",
  "gridx/Grid",
  "gridx/core/model/cache/Async",
	'gridx/modules/Focus',
	'gridx/modules/CellWidget',
	'gridx/modules/Edit',
"dijit/form/CheckBox",
  "dijit/form/NumberTextBox",
  "dijit/form/TextBox",
"gridx/modules/VirtualVScroller",
"jspire/Gridx",
"jspire/request/Xml",
"dojox/data/XmlStore"
], function(ready, on, Evented, ItemFileWriteStore, Grid, Async, Focus, CellWidget, Edit, CheckBox, NumberTextBox, TextBox, VirtualVScroller, jsGridx, RXml) {
	ready(function() {
		// logic that requires that Dojo is fully initialized should go here
		var MH = dijit.byId('idMH');
		var G = dijit.byId('idGridx');
		G.set('editable', true);
		G.columns( {
			name: true, priority: true, manual: true, treatment: true, accountdefault: true, groupdefault: true, note: true, enable_datetime: true, na_timeout: true, na_closable: true, na_snd: true, na_img: true
		}
		);
		MH.on("onchangedeventtypestable", function() {
			G.load();
		}
		);
		
		G.load();
	
	}
	);
}
);
