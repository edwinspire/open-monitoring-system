define(["dojo/_base/declare", 
	"dojo/window",
	"dijit/form/FilteringSelect",
	"LiveStore/DijitSelectStore",
	"dojo/parser"
	], function(declare, win, FilteringSelect, DijitSelectStore) {
		return declare("FilteringSelectLiveStore/FilteringSelectLiveStore", [FilteringSelect], {

			//GlobalLiveStore: false,
			refreshOnTableChanged: [],

			constructor: function(args){
// this.GlobalLiveStore = {};
// this.refreshOnTableChanged= [];
//var t = this;
//t.queryExpr = '*${0}*';
//t.searchDelay = 600;
//t.autoComplete = 'false';
dojo.safeMixin(this, args);
},
postCreate:function (args){
	this.inherited(arguments);
	
	var t = this; 
//console.warn(t.GlobalLiveStore);

if(t.LiveStore){

	t.autoComplete = false;
	t.queryExpr = '*${0}*';
/*
t.queryExpr = '*${0}*';
t.searchDelay = 600;
t.autoComplete = 'false';
*/
//console.debug(t.queryExpr, t.searchDelay, t.autoComplete);

	try{
		t.set('store', new DijitSelectStore(t.LiveStore));
	}catch(e){
		console.error(e);
	}
}


},
request: function(_r){
this.get('store').request(_r);	
}


















}); 
	});
