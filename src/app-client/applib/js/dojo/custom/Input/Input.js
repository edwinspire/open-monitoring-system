define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!Input/Input.html',
    "dojo/dom-class",
    "dojo/on"
    ], function (declare, _Widget, _Templated, templateString, domClass, on) {

        return declare([_Widget, _Templated], {
            widgetsInTemplate: true,
            templateString: templateString,
            postCreate: function () {
               var t = this;
               
               var icon = t.get("data-input-icon"); 
               
               if(icon){
                   domClass.remove(t.Icon);
                   domClass.add(t.Icon, icon);
               }
               
               var placeholder = t.get("placeholder");
               if(placeholder){
                   t.Input.placeholder = placeholder;
               }

               if(t.value){
                t.set('value', t.value, false);
            }

            if(t.get('required') !== 'undefined'){
                t.Input.required = t.get('required');
            }

//console.log(t.get('data-intermediate_changes'));

if(t.get('data-intermediate_changes')){
    t.Input.intermediateChanges = t.get('data-intermediate_changes').to_boolean();
}


t.Input.on('Change', function(e){
//console.log('Cambia el Input '+ e);

t.emit('Change', {value: e});
//t.emit('onchange', {value: t.get('value')});
});


/*
dojo.connect(t.Input, 'onchange', function(e){
t.onChange({value: t.Input.value});
});
*/


},
onChange: function(){
    
},
_setValueAttr: function (_v, _t) {
  this.Input.set('value', _v, _t);
},
_getValueAttr: function () {
  return this.Input.get('value');
} ,
reset: function () {
    this.Input.reset();
} ,
isValid: function(){
	return this.Input.isValid();
}

});
    });
