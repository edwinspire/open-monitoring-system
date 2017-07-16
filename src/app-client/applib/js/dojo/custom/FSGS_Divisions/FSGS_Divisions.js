define(["FilteringSelectGlobalStore/FilteringSelectGlobalStore"
  ], function (FilteringSelectGlobalStore) {
/**
     * Account Events is Open
     *
     * @module account_events_isopen/account_events_isopen
     */
     return declare([FilteringSelectGlobalStore], {

    constructor: function(){
      // The "constructor" method is special: the parent class (Person)
      // constructor is called automatically before this one.
      this.name = "iddivision";
      this.GlobalLiveStore = {{refreshOnTableChanged:['divisions', 'admins'], requestQuery: {}, identifier: 'iddivision', target: '/njs/db/jajaja'} , searchAttr: 'name'};
    },

      postCreate: function () {
       var t = this;

     }   

});
   });
