// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "dijit/form/FilteringSelect", "dojo/store/Memory",    'dojo/request', "dojo/_base/array"], function(lang, FilteringSelect, Memory, R, array){
  lang.extend(FilteringSelect, {
  //  Config: {Url: 'none.none', PlaceHolder: '', LoadOnCreate: false, Query: {}, Table: '', FieldValue: '', FieldLabel: '' }, 
  constructor: function(args){
  dojo.safeMixin(this, args);
    },
        postCreate: function () {
          this.inherited(arguments);

        }
        
        
        
        
  });
});
