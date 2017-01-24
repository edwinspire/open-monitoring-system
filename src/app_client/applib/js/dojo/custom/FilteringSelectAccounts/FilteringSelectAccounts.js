require(["dojo/_base/declare", "dijit/form/FilteringSelect", "dojo/parser"], function(declare, FilteringSelect) {
    declare("FilteringSelectAccounts/FilteringSelectAccounts", [FilteringSelect], {
        postCreate: function() {
            this.inherited(arguments);
      var t = this;
//console.log(arguments);
//t.inherited(arguments);

t.queryExpr = '*${0}*';
t.searchDelay = 600;


console.debug(t.Config);

if(t.Config.LoadOnCreate){
t.Load(t.Config.Query);
}

        }
    }); 
});
