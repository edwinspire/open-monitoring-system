define(["dojo/_base/declare", 
"dojo/_base/lang",
"dojo/data/ObjectStore",
"dojo/store/Memory", 
"dojo/store/Observable",
'dojo/request',
"dojo/topic"
], function(declare, lang, ObjectStore, Memory, Observable, request, topic) {
  return  declare("LiveObjectStore/LiveObjectStore", ObjectStore, {

target: '',
handleAs: 'json',
requestQuery: {},
identifier: '',
table: '',
_subscribe: {},
subscribe: '',


 constructor: function(args){

	var t = this;
	this.target = '';
this.handleAs= 'json';
this.requestQuery = {};
this.objectStore = Observable(new Memory());
// lang.mixin(t, args);
//this.idProperty = '';
this.identifier = '';

this.inherited(arguments);
//console.log(arguments, args);
//var a = arguments;
this._subscribe = topic.subscribe(this.subscribe, function(data){
			   t.request();
			   console.debug('Store subscrito al canal '+t.subscribe);
						  });



this.request().then(function(response){
     //   lang.mixin(t, args);

//console.log(response);
//t.inherited(arguments);
});


    },

        uninitialize: function(){
        var t = this;
	topic.unsubscribe(t._subscribe);        
        },


request: function(_query){

this.requestQuery = _query || this.requestQuery || {};
var t = this;
console.log(this.requestQuery, this.target);


          return  request.post(this.target, {
                data: this.requestQuery,
                  preventCache: true,
                handleAs: 'json'
            }).then(
                function (response) {

t.objectStore = Observable(new Memory({ data: {identifier: t.identifier, items: response}}));
//t.objectStore.setData(response);
//t.set('objectstore', Observable(new Memory({ data: response})));
console.log('Terminamos', t);

                },
                function (e) {
                    // Display the error returned
                  //  t._notifications({ Urgency: 1, Message: e, Title: 'Error!' });
                  //  t.emit('onError', { error: e });
                    console.error(e);
                }
                );

}


/*

	stateStore = new ObjectStore({
						objectStore: Observable(new Memory({ data: {} })),
						labelProperty: "name"
				});

*/











    }); 
});
