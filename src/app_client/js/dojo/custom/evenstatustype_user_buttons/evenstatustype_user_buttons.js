define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!evenstatustype_user_buttons/evenstatustype_user_buttons.html',
    "dojo/dom-class",
    "dojo/on",
					"dojo/_base/array",
					"dojo/topic",
					'dojo/request',
					"dojo/dom-construct",
    ], function (declare, _Widget, _Templated, templateString, domClass, on, array, topic, request, domConstruct) {

        return declare([_Widget, _Templated], {
            widgetsInTemplate: true,
            templateString: templateString,
            value: 0,
            target: '/njs/db/Select_Generic_to_Store',
            postCreate: function () {
               var t = this;
               
						topic.subscribe("/event/table/changed/event_statustypes", function(data){
							t._request();
						});

t._request();

},
_request: function(){
var t = this;
domConstruct.empty(t.BlockButton);

							return  request.post(t.target, {
								data: {_uDCTable: 'event_statustypes_to_client'},
								preventCache: true,
								handleAs: 'json'
							}).then(
							function (response) {
array.forEach(response, function(item){

  var button = domConstruct.create("a", {class: 'btn btn-default', type: 'button', 'data-value': item.ideventstatustype, innerHTML: item.label_status});

  dojo.connect(button, "onclick", function (e) {
    //console.debug(e, e.target.getAttribute('data-value'));
    t.value = e.target.getAttribute('data-value');
    on.emit(t.domNode, 'Change', {value: t.value});
  });

domConstruct.place(button, t.BlockButton);
});

},
function (e) {
	console.error(e, t.target);
}
);

},
_setValueAttr: function (_v) {
  this.value = _v;
},
_getValueAttr: function () {
  return this.value;
} ,
reset: function () {
    
} ,
isValid: function(){
	return true;
}

});
    });
