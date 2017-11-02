define(["dojo/_base/declare", "Widget/FilteringSelectGlobalStore/FilteringSelectGlobalStore"
	], function (declare, FilteringSelectGlobalStore) {
		return declare([FilteringSelectGlobalStore], {

			constructor: function(args){

				declare.safeMixin(this,args);
				this.GlobalLiveStore =  {refreshOnTableChanged:['accounts', 'admins'], requestQuery: {__affected_table: 'public.view_accounts'}, identifier: 'idaccount', target: '/njs/db/Select_Generic_to_Store'};
			},
			postCreate: function () {
				var t = this;
								this.GlobalLiveStore =  {refreshOnTableChanged:['accounts', 'admins'], requestQuery: {__affected_table: 'public.view_accounts'}, identifier: 'idaccount', target: '/njs/db/Select_Generic_to_Store'};
			}   

		});
	});
