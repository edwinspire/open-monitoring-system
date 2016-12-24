define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!CollapseButton/CollapseButton.html',
    "dojo/dom-class",
    "dojo/on",
"dojo/fx",
"dijit/Tooltip"
], function (declare, _Widget, _Templated, templateString, domClass, on, fx, TT) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
	ContentElement: null,
        postCreate: function () {
	var t = this;
	
 new TT({
        label: "Expande / Oculta el panel"
    }).addTarget(t.CollapseLinkIcon);	

t.on('Click', function(){

if(t.ContentElement){

if(domClass.contains(t.CollapseLinkIcon, "fa-chevron-up")){
t.Down();
}else{
t.Up();
} 

}else{
console.log('No ha definido el elemento a ocultar');
} 

});

//t.Down();

        },
        _setContentelementAttr: function (_e) {
          this.ContentElement = _e;
        },
        Up: function(){
        var t = this;
if(t.ContentElement){

if(domClass.contains(t.CollapseLinkIcon, "fa-chevron-down")){

fx.wipeIn({
        node: t.ContentElement
    }).play();

   domClass.remove(t.CollapseLinkIcon, "fa-chevron-down");
         domClass.add(t.CollapseLinkIcon, "fa-chevron-up");

} 

}else{
console.log('No ha definido el elemento a ocultar');
} 
return t;
        },
        Down: function(){
        var t = this;
if(t.ContentElement){

if(domClass.contains(t.CollapseLinkIcon, "fa-chevron-up")){

fx.wipeOut({
        node: t.ContentElement
    }).play();

   domClass.remove(t.CollapseLinkIcon, "fa-chevron-up");
         domClass.add(t.CollapseLinkIcon, "fa-chevron-down");

} 

}else{
console.log('No ha definido el elemento a ocultar');
}         
return t;
        }      
                
    });
});
