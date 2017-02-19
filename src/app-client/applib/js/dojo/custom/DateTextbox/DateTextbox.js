define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!DateTextbox/DateTextbox.html',
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
t.set('value', t.value);
}

if(t.get('required') !== 'undefined'){
t.Input.required = t.get('required');
}

t.Input.on('Change', function(){
//console.log('Cambia el DateTextbox');
t.emit('Change', {value: t.get('value')});
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
        _setValueAttr: function (_v, _e) {
          this.Input.set('value', _v, _e);
        },
        _getValueAttr: function () {
          return this.Input.get('value');
        } ,
        reset: function () {
            this.Input.reset();
        }, 
isValid: function(){
return this.Input.isValid();
}      
                
    });
});
