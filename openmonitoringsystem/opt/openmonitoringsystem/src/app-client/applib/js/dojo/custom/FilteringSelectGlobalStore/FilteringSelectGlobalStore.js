define(["dojo/_base/declare", 
	"dojo/window",
	"dijit/form/FilteringSelect"
	], function(declare, win, FilteringSelect) {
		return declare("Widget/FilteringSelectGlobalStore/FilteringSelectGlobalStore", [FilteringSelect], {

			GlobalLiveStore: false,
			refreshOnTableChanged: [],

			postCreate:function (args){
				this.inherited(arguments);

				var t = this; 

				if(t.GlobalLiveStore){
					t.autoComplete = false;
					t.queryExpr = '*${0}*';

					try{
						t.set('store', win.GlobalLiveStore.Store(t.GlobalLiveStore));
					}catch(e){
						console.warn(e);
					}
				}

			},
			onChange: function(value){
				
			}

















		}); 
	});
