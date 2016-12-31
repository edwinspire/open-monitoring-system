define(["dojo/_base/declare", 
	"dojo/window",
	"dijit/form/FilteringSelect",
	"dojo/parser"
	], function(declare, win, FilteringSelect) {
		return declare("FilteringSelectGlobalStore/FilteringSelectGlobalStore", [FilteringSelect], {

			GlobalLiveStore: false,
			refreshOnTableChanged: [],

			constructor: function(args){
// this.GlobalLiveStore = {};
// this.refreshOnTableChanged= [];
dojo.safeMixin(this, args);
},
postCreate:function (args){
	this.inherited(arguments);
	
	var t = this; 
//console.warn(t.GlobalLiveStore);

if(t.GlobalLiveStore){
	t.autoComplete = false;
	t.queryExpr = '*${0}*';
//console.debug(t.queryExpr, t.searchDelay, t.autoComplete);

	try{
		t.set('store', win.GlobalLiveStore.Store(t.GlobalLiveStore));
	}catch(e){
		console.warn(e);
	}
}

}


















}); 
	});
