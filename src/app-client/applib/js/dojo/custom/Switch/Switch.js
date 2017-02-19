define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!Switch/Switch.html',
'dojo/on',
"dojo/dom-construct", 
"dojo/_base/event"
], function (declare, _Widget, _Templated, templateString, on, domConstruct, event) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
//	_trigger_onchange: true,
//	_Value: false,
        postCreate: function () {
            var t = this;

       t.Input.id = this.id+'_Input';
//console.log(t.id);
    
domConstruct.place('<label class="onoffswitch-label" for="'+t.Input.id+'"> <span class="onoffswitch-inner"></span>    <span class="onoffswitch-switch"></span>  </label>', t.Container);   

if(t.value !== 'undefined'){
t.set('value', t.value, false);
}

on(t.Input, "change", function (e) {
e.value = t.Input.checked;
//if(t._trigger_onchange){
//console.log('Ha cambiado el switch', e);
t.emit('Change', e);
//}
//t._trigger_onchange = true;
});  
         




        },
        onChange: function(){
        
        },
        _setValueAttr: function (_v, _e) {
var t = this;
    if (_v == 'false' || _v == 'FALSE' || _v == false) {
        _v = false;
    } else {
        _v = true;
    }

/*
if(_e == false){
t._trigger_onchange = false;
}else{
t._trigger_onchange = true;
}
*/
//console.log(_v);
         t.Input.checked = _v;
return t;
        },
        _getValueAttr: function () {
         return this.Input.checked;
        },
     isValid: function(){
	return true;
},
reset: function(){
this.set('value', false);
return this;
}




    });
});
