define(["dojo/_base/declare", 
	"dojo/window",
	"dijit/form/FilteringSelect",
	"dojo/parser"
	], function(declare, win, FilteringSelect) {
		return declare("Widget/FilteringSelectGlobalStore/FilteringSelectGlobalStore", [FilteringSelect], {

			GlobalLiveStore: false,
			refreshOnTableChanged: [],

			constructor: function(args){

				dojo.safeMixin(this, args);
			},
			postCreate:function (args){
				this.inherited(arguments);

				var t = this; 
//				console.debug(win.GlobalLiveStore);

				if(t.GlobalLiveStore){
					t.autoComplete = false;
					t.queryExpr = '*${0}*';

					try{
						t.set('store', win.GlobalLiveStore.Store(t.GlobalLiveStore));
					}catch(e){
						console.warn(e);
					}
				}

			}


















		}); 
	});
