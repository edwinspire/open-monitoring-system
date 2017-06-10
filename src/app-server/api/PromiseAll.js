/**
     * Custom Module
     *
     * @module 
     */
     define(['dojo/_base/declare', 'dojo/Evented', "dojo/_base/array", "dojo/Deferred", "dojox/encoding/digests/MD5"
      ], function (declare, Evented, array, Deferred, MD5) {

        return declare('PromiseAll', Evented, { 

//////////////////////////////////
// The constructor
constructor: function(args) {

},

run: function(promises){

  var t = this;
  var totalPromises = promises.length;
  var name_event = 'PromiseAllRun'+(new Date()).getTime()+ Math.random().toString().replace('.', '_')+MD5(JSON.stringify(promises), dojox.encoding.digests.outputTypes.Hex);
  var promisesProcceced = 0;
  var Resolved = [];
  var Rejected = [];
  var deferred = new Deferred();

  console.log(name_event);

  var signal = t.on(name_event, function(r){

    promisesProcceced++;

    if(r.resolved){
      Resolved.push(r.result);
    }else{
      Rejected.push(r.result);
    }

    if(promisesProcceced == totalPromises){
      //console.log('>>>>>>>>>>>>>>>>> PromiseAllRun Completado '+totalPromises+' de '+promisesProcceced);
      signal.remove();
      deferred.resolve({resolved: Resolved, rejected: Rejected});
    }

  });

  if(totalPromises > 0){
    array.forEach(promises, function(item, i){
      item.then(function(result){
      //console.log(i, result);
      t.emit(name_event, {resolved: true, result: result});
    }, function(error){
      //console.log(i, error);
      t.emit(name_event, {resolved: false, result: error});
    });
    });
  }else{
   t.emit(name_event, {resolved: true, result: {}});
 }
 return  deferred.promise;
}



});
      });