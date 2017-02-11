/**
     * Postgres custom methods
     *
     * @module postgres.oms
     */
define(['dojo/_base/declare',  "dojo/node!pg", "dojo/promise/Promise"
	], function (declare, pg, Promise) {

		return declare('postgres.QueryPromise', Promise, {
			    then: function(resolve, reject, progress){
      // Implementation of .then()
    },
    cancel: function(){
      // Implementation of .cancel()
    },
    isResolved: function(){
      // Implementation of .isResolved()
    },
    isRejected: function(){
      // Implementation of .isRejected()
    },
    isFulfilled: function(){
      // Implementation of .isFulfilled()
    },
    isCanceled: function(){
      // Implementation of .isCanceled()
    }



});
});
