// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "dijit/Editor"], function(lang, Editor){
  lang.extend(Editor, {
  //  Config: {Url: 'none.none', PlaceHolder: '', LoadOnCreate: false, Query: {}, Table: '', FieldValue: '', FieldLabel: '' }, 
        reset: function(){
        	this.setValue('');
        }
        
        
        
        
  });
});
