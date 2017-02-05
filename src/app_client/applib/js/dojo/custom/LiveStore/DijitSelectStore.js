define(["dojo/_base/declare", 
  "dojo/_base/lang",
  "dojo/data/ObjectStore",
  "dojo/store/Memory", 
  "dojo/store/Observable",
  'dojo/request',
  "dojo/topic",
  "dojo/_base/array",
  "dijit/_WidgetBase"
  ], function(declare, lang, ObjectStore, Memory, Observable, request, topic, array, _WidgetBase) {
    return  declare("Widget/LiveStore/DijitSelectStore", [ObjectStore], {

      target: '',
      handleAs: 'json',
      requestQuery: {},
      identifier: '',
      _subscribe: [],
      refreshOnTableChanged: [],
      
      constructor: function(args){

       var t = this;
       this.target = '';
       this.handleAs= 'json';
       this.requestQuery = false;
       this.objectStore = Observable(new Memory());
       this.refreshOnTableChanged= [];
       this.identifier = '';

       dojo.safeMixin(this, args);

       t.postCreate();

     }, 
     postCreate:function (args){
      this.inherited(arguments);       
      var t = this; 

//** Subscribe a los eventos de cambio de datos en X tablas **//
if (Object.prototype.toString.call(t.refreshOnTableChanged) === '[object Array]') {

  array.forEach(t.refreshOnTableChanged, function(item, i){

    t._subscribe.push(topic.subscribe("/event/table/changed/"+item, function(data){
       t.request();
     }));
  });

}

if(t.requestQuery){

  this.request(t.requestQuery);

}



},
uninitialize: function(){
  var t = this;
//	topic.unsubscribe(t._subscribe);        
console.warn('TODO Implementar');
},


request: function(_query){

  this.requestQuery = _query || this.requestQuery;
  var t = this;

 //console.debug(this);

 return  request.post(this.target, {
  data: this.requestQuery,
  preventCache: true,
  handleAs: 'json'
}).then(
function (response) {
//console.log(response);
t.objectStore = Observable(new Memory({ data: {identifier: t.identifier, items: response}}));

},
function (e) {
  console.error(e, t.target);
}
);

}













}); 
  });
