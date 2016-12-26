// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "dijit/Editor"], function(lang, Editor){
  lang.extend(Editor, {
  //  Config: {Url: 'none.none', PlaceHolder: '', LoadOnCreate: false, Query: {}, Table: '', FieldValue: '', FieldLabel: '' }, 
  constructor: function(args){
  dojo.safeMixin(this, args);
    },
        postCreate: function () {
          this.inherited(arguments);

        },
        reset: function(){
        	this.set('value', '');
        }
        
        
        
        
  });
});
