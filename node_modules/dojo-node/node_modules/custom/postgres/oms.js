/**
     * Postgres custom methods
     *
     * @module postgres.oms
     */
     define(['dojo/_base/declare',  "dojo/node!pg", "dojo/Evented", "dojo/Deferred", "dojo/_base/array", "dojo/promise/all"
     	], function (declare, pg, Evented, Deferred, array, All) {

     		return declare('postgres.oms', Evented, {

//  var conString = "pg://postgres:pg4321@192.168.238.66:5432/oms";
user: 'user',
pwd: 'pwd',
host: '127.0.0.1',
db: 'db',
port: 5432,
_last_ts: {},
tv_structure: {},
_last_notification_area: 0,

//////////////////////////////////
// The constructor
constructor: function(args) {
	this.port = 5432;
	dojo.safeMixin(this,args);
// this.inherited(arguments);
var t = this;
t._last_ts = {};
t._last_idnotify_notification_area = 0;
t.tv_structure= {};

setTimeout(function(){

	t.get_dgrid_fullstructure();

	setInterval(function(){

		var q = "SELECT table_name, ts FROM sys_table_ts;";
		pg.connect(t.connString(), (err, client, done) => {
    // Handle connection errors
    if(err) {
    	done();
    	console.log(err);
      //return res.status(500).json({success: false, data: err});
      return false;
  }

  var query = client.query(q);

  query.on('row', (row) => {

  	var newts = Date.parse(row.ts);

  	if(typeof t._last_ts[row.table_name] === 'undefined'){

  		t._last_ts[row.table_name] = newts;
  		t.get_tv_structure(row.table_name);
  		t.send_notification_area(row.table_name);
  		t.emit("tschange", {table_name: row.table_name,  ts: newts});

  	}else{

  		if(t._last_ts[row.table_name]  !=  newts){
  			t._last_ts[row.table_name] = newts;
  			t.get_tv_structure(row.table_name);
  			t.send_notification_area(row.table_name);
  			t.emit("tschange", {table_name: row.table_name,  ts: newts});
  		}

  	}


  });


  // After all data is returned, close connection and return results
  query.on('end', (result1) => {
  	done();
  });
  

});


	}, 1000);

}, 2000);

},
startup: function(){
	console.log('Startup');
}, 
///////////////////////////////////////////////////////////////
get_tv_structure: function(_tv){

	var t = this;

	if(_tv == 'udc_columns' || _tv == 'udc_tables_views'){
		t.get_dgrid_fullstructure();
	}

	return true;
},
///////////////////////////////////////////////////////////////
connString: function(){
	return "pg://"+this.user+":"+this.pwd+"@"+this.host+":"+this.port+"/"+this.db;
},
///////////////////////////////////////////////////////////////
query: function(_query, _param){

	var deferred = new Deferred();
	var t = this;
	//console.log(_query);
	//t.emit("tschange", {q: _query, p: _param});
	

	pg.connect(t.connString(), (err, client, done) => {

		//t.emit("tschange", {e: err, c: client, d: done});

		if(err) {
			
			console.log(err);
			t.emit("tschange", err);
			deferred.reject(err);
			done();
			//res.status(500).json({success: false, data: err});
		}

		var q = client.query(_query, _param, (error)=>{
			if(error){
				t.emit("tschange", error);
				deferred.reject(error);
			}
		});

		q.on('end', (result) => {
			//res.json(result.rows);
			deferred.resolve(result);
			done();
		});

	});

	return deferred.promise;
},
login: function(req, res){

	var t = this;

	var user = req.body.user || false;
	var pwd = req.body.pwd || false;

	var q = "SELECT * from fun_login_system($1::TEXT, $2::TEXT, $3::INET, $4::TEXT);";

	return t.query(q, [user, pwd, req.connection.remoteAddress, req.headers['user-agent']]);
},
logout: function(datauser){
	var t = this;
	var q = "SELECT * FROM fun_logout_system($1::BOOLEAN, $2::BIGINT, $3::TEXT, $4::INET);";
	if(datauser.isadmin){
		return t.query(q, [true, datauser.idadmin, datauser.fullname, datauser.ip]);	
	}else{
		return t.query(q, [false, datauser.idcontact, datauser.fullname, datauser.ip]);	
	}
	
},
get_notifications: function(req, res){


	var user = req.body.user || false;
	var client = new pg.Client(t.connString());
	client.on('error', function(error) {
		console.log(error);
	});     
	client.on('drain', client.end.bind(client)); 

	var query = client.query("SELECT * FROM notification_area WHERE (sessionid = 'all' OR sessionid = $1::text) AND idnotify > $2::integer ORDER BY urgency, idnotify", ['', 0]);

	query.on("row", function (row, result) {

  //  result.addRow(row);
});

	query.on('end', function() {
		console.log('query 2 completed');
	});


	client.connect();

},
send_notification_area: function(_table_notifications){

	var t = this;

	if(_table_notifications === "notification_area"){
//t._last_idnotify_notification_area
pg.connect(t.connString(), (err, client, done) => {
    // Handle connection errors
    if(err) {
    	done();
    	console.log(err);
      //return res.status(500).json({success: false, data: err});
      return false;
  }

  var query = client.query("SELECT * FROM notification_area WHERE idnotify > $1::integer ORDER BY idnotify;", [t._last_idnotify_notification_area]);

  query.on('row', (row) => {
  	t._last_idnotify_notification_area = row.idnotify;    
  	t.emit("notifying_the_user", row);
  });


// TODO: OJO si hay que cerrar esta conexion

  // After all data is returned, close connection and return results
  query.on('end', (result1) => {
  	done();
  });
  





});
}

},
response_insert: function(req, res, _query, _param){
	var t = this;
	pg.connect(t.connString(), (err, client, done) => {
		if(err) {
			done();
			console.log(err);
			res.status(500).json({success: false, data: err});
		}

		var query = client.query(_query, _param, (error)=>{
			if(error){
				res.status(500).json({success: false, data: error, query: _query});
			}
		});
		query.on('end', (result) => {
			res.json({success: true, data: result});
			done();
		});

	});

},
response_query: function(req, res, _query, _param){
	var t = this;
	pg.connect(t.connString(), (err, client, done) => {
		if(err) {
			done();
			console.log(err);
			res.status(500).json({success: false, data: err});
		}

		var query = client.query(_query, _param, (error)=>{
			if(error){
				res.status(500).json({success: false, data: error});
			}
		});

		query.on('end', (result) => {
			res.json(result.rows);
			done();
		});

	});

},
response_update: function(rea, res, _query, _param){
	var t = this;
	pg.connect(t.connString(), (err, client, done) => {
		if(err) {
			done();
			console.log(err);
			res.status(500).json({success: false, data: err});
		}

		var query = client.query(_query, _param, (error)=>{
			if(error){
				res.status(500).json({success: false, data: error});
			}
		});

		query.on('end', (result) => {
			res.json({success: true, rowCount: result.rowCount});
			done();
		});

	});
}




});
});
