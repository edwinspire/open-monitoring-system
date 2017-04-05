/**
     * Postgres custom methods
     *
     * @module postgres.oms
     */
     define(['dojo/_base/declare',  "dojo/node!mongodb", "dojo/Evented", "dojo/Deferred", "dojo/_base/array", "dstore/Memory", "dojo/node!assert",
     	], function (declare, DBase, Evented, Deferred, array, Memory, Assert) {

     		return declare('mongodb.oms', Evented, {

     			user: 'user',
     			pwd: 'pwd',
     			host: '127.0.0.1',
     			db: 'db',
     			port: 5432,
     			_last_ts: {},
     			tv_structure: {},
     			_last_notification_area: 0,
     			configuration_server: {},

//////////////////////////////////
// The constructor
constructor: function(args) {

	dojo.safeMixin(this,args);
	var t = this;

	var Client = DBase.MongoClient;

	// Connection URL
var url = 'mongodb://localhost:27017/myproject';

// Use connect method to connect to the server
Client.connect(url, function(err, db) {
  Assert.equal(null, err);
  console.log("Connected successfully to server");

  db.close();
  });


},
startup: function(){
	console.log('Startup');
}



});
});
