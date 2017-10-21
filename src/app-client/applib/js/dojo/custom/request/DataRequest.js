define(["dojo/_base/declare", 
  "dojo/_base/lang",
  "dojo/data/ObjectStore",
  "dojo/store/Memory", 
  "dojo/store/Observable",
  'dojo/request',
  "dojo/topic",
  "dojo/_base/array",
  "dojox/encoding/digests/MD5",
  "dojo/Deferred"
  ], function(declare, lang, ObjectStore, Memory, Observable, request, topic, array, MD5, Deferred) {
    return  declare("Widget/request/DataRequest", [ObjectStore], {

      target: '',
      service: '',
      handleAs: 'json',

      _request_datas: [],
      
      constructor: function(args){

       var t = this;

       this.target = '';
       this.service = '';
       this.handleAs = 'json';
       /*
       this.handleAs= 'json';
       this.requestQuery = false;
       this.objectStore = Observable(new Memory());
       this.refreshOnTableChanged= [];
       this.identifier = '';
       this.dbschema = '';
       this.dbtableview = '';
       */

       dojo.safeMixin(this, args);

//       t.postCreate();

}, 
postCreate:function (args){

},
uninitialize: function(){
  var t = this;
//	topic.unsubscribe(t._subscribe);        
console.warn('TODO Implementar');
},
add: function(req){
  var t = this;

  var idkey = MD5(dojo.toJson(req), dojox.encoding.digests.outputTypes.Hex);
  var r = {key: idkey, datas: req};      

  t._request_datas.push(r);
  return idkey;
},

request: function(_query){

  var t = this;
  var deferred = new Deferred();

  var Datas = {
    header: {
      token: 'yyyyyyyy',
      service: t.service
    },
    request: []
  };


/*
{
  header: {},
  response: {
    datas: []
  }
}
*/

Datas.request = t._request_datas;

if(!t.target){
  this.target = '/target_undefined';
}

request.post(this.target, {
  data: {data: JSON.stringify(Datas)},
  preventCache: true,
  handleAs: t.handleAs
}).then(function(result){

  console.log(result);

  var data_return = {};

  if(result.length > 0){
    if(result[0].return){
      data_return = result[0].return;
    }

  }

// Buscar como vaciar el array
t._request_datas = [];

var store = new Memory({idProperty: 'key', data: data_return});

var R = {
  header: Datas.header,
  response: {
    data: store
  },
  getDatas: function(key){
    return this.response.data.get(key).datas;
  }
};


deferred.resolve(R);

}, function(err){
  deferred.reject(err);
});

return deferred.promise;
}













}); 
  });
