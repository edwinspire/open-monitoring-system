define(['dojo/_base/declare',
	'dijit/_Widget',
	'dijit/_Templated',
	'dojo/text!Widget/evenstatustype_user_buttons/evenstatustype_user_buttons.html',
	"dojo/dom-class",
	"dojo/on",
	"dojo/_base/array",
	"dojo/topic",
	'dojo/request',
	"dojo/dom-construct",
	"dijit/form/RadioButton",
	"dijit/registry",
	"dojo/query",
	"dijit/layout/ContentPane"
	], function (declare, _Widget, _Templated, templateString, domClass, on, array, topic, request, domConstruct, RadioButton, registry, query) {

		return declare([_Widget, _Templated], {
			widgetsInTemplate: true,
			templateString: templateString,
			value: 0,
			_clicks_handle_events: false,
			target: '/njs/db/Select_Generic_to_Store',
			postCreate: function () {
				var t = this;

				topic.subscribe("/event/table/changed/event_statustypes", function(data){
					//console.debug('Hubo cambio en los datos de event_statustypes');
					t._request();
				});

				t._request();     

			},
			_request: function(){
				var t = this;

				t.BlockButton.destroyDescendants();

				//console.debug(t._clicks_handle_events);
				
				if(t._clicks_handle_events){
					t._clicks_handle_events.remove();
				}

				  request.post(t.target, {
					data: {_uDCTable: 'event_statustypes_to_client'},
					preventCache: true,
					handleAs: 'json'
				}).then(
				function (response) {

					var b = '';
					array.forEach(response, function(item, i){

						b = b+'<input class="EventStatusTypeRadio" data-dojo-type="dijit/form/RadioButton" value="'+item.ideventstatustype+'" >&nbsp;'+item.label_status+'&nbsp;&nbsp;';

					});

					t.BlockButton.set('content', b);
					t._clicks_handle_events = on(t.domNode, ".EventStatusTypeRadio:click", function(e){
						
						if(e.target.value){
							t.value = e.target.value;
							console.debug(t.value);
							on.emit(t.domNode, 'Change', {value: t.value});

						}
					});

				},
				function (e) {
					console.error(e, t.target);
				}
				);

			},
			_setValueAttr: function (_v, _emitChanged) {
				var t = this;
				t.value = String(_v);
				console.debug(_v, t.value);

				registry.getEnclosingWidget(query('[value='+t.value+']', t.domNode)[0]).set('checked', true);
				on.emit(t.domNode, 'Change', {value: t.value});

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
