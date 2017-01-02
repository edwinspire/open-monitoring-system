// Dojo 1.7+ (AMD)

//TODO No esta funcinando
require(["dojo/_base/lang", "dijit/layout/ContentPane", "dojo/dom-attr", "dojo/dom-style", "dojo/query"], function(lang, ContentPane, domAttr, domStyle, query){
  lang.extend(ContentPane, {
  //  Config: {Url: 'none.none', PlaceHolder: '', LoadOnCreate: false, Query: {}, Table: '', FieldValue: '', FieldLabel: '' }, 
  selectedPage: false,
        as_page: function(){
        	
        
        query("> *", this.domNode).forEach(function(child, i){
if(child.dataset.selected){
    this.selectedPage = child;
}else{
 domStyle.set(child, 'display', 'none'); // set
 //domAttr.set(child, 'data-selected', false);
 child.dataset.selected = false;
}
        });

if(this.selectedPage){
domStyle.set(this.selectedPage, 'display', 'block-inline'); // set	
}



        },
        selectPage: function(node){

//dojo.query("> *").attr('data-selected', false);
//domAttr.set(node, 'data-selected', true);
node.dataset.selected = true;
console.debug(node);
this.as_page();
/*
var page = false;

        query("> *", this.domNode).forEach(function(child, i){
        //	console.debug(domAttr.get(child, attrName));
if(!page && node == child){
	page = child;
	domAttr.set(child, 'data-selected', true);
}else{
	domAttr.set(child, 'data-selected', false);
 domStyle.set(child, 'display', 'none'); // set
}
        });

if(page){
	this.selectedPage = page;
domStyle.set(this.selectedPage, 'display', 'block-inline'); // set
}
*/

        }
        
        
        
        
  });
});
