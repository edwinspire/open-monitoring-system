define(['dojo/_base/declare',
  'dijit/_Widget',
  'dijit/_Templated',
  'dojo/text!SelectAjax/SelectAjax.html',
  'dojo/request',
  "dojo/dom-construct",
  "dojo/_base/array",
  "dojo/query",
  "LiveStore/DijitSelectStore",
  ], function (declare, _Widget, _Templated, templateString, R, domConstruct, array, query, LStore) {

    return declare([_Widget, _Templated], {
      widgetsInTemplate: true,
    //  Config: {},
      templateString: templateString,
      postCreate: function () {
       var t = this;



dojo.connect(t.Select, 'change', function(e){
  console.log('Ha cambiado');
  t.emit('onChange', {value: t.Select.value});
});  


  },
  _setValueAttr: function (_v) {         
   this.Select.val(_v).trigger("change");
 },
 _getValueAttr: function () {
  return this.Select.value;
},
Load: function(_q){
  var t = this;
//console.log(_data);
_q._SelectTable = t.Config.Table;
_q._SelectFieldValue = t.Config.FieldValue;
_q._SelectFieldLabel = t.Config.FieldLabel;
_q._SelectFieldGroup = t.Config.FieldGroup;

R.post(t.Config.Url, {
  data: _q,
  handleAs: 'json'
}).then(
function (response) {
  if(t.Config.FieldGroup){

  }else{

    array.forEach(response, function(item){
	//	console.log(item);
  t._addOption(item[t.Config.FieldLabel], item[t.Config.FieldValue]);
});

  }

},
function (e) {
                            // Display the error returned
                            window.NotificationArea({urgency: 1, message: e, title: 'Error!'});
                            t.emit('onError', {error: e});
                          //  alert(e);
                        }
                        );
return t;
},
_addOption: function(_label, _value){
  var t = this;
  domConstruct.place('<option value="'+_value+'" selected="true">'+_label+'</option>', t.Select);  
},
isValid: function(){
	this.validate();
}







});
  });
