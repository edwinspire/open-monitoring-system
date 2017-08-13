/**
     * Postgres custom methods
     *
     * @module postgres.oms
     */
     define(['dojo/_base/declare',  "dojo/node!pg", "dojo/node!pg-pool", "dojo/Evented", "dojo/Deferred", "dojo/_base/array", "dojo/store/Memory", "dojox/encoding/digests/MD5"
     	], function (declare, pg, pgpool, Evented, Deferred, array, Memory, MD5) {

     		return declare('postgres.oms', Evented, {

     			user: 'user',
     			pwd: 'pwd',
     			host: '127.0.0.1',
     			db: 'db',
     			port: 5432,
     			_last_ts: {},
     			tv_structure: {},
     			_last_notification_area: 0,
     			configuration_server: {},
     			_schema: new Memory(),
     			pgPool: {},


//////////////////////////////////
// The constructor
constructor: function(args) {
	this.port = 5432;
	dojo.safeMixin(this,args);
	var t = this;
	t._last_ts = {};
	t._last_idnotify_notification_area = 0;
	t.tv_structure= {};
	//return "pg://"+this.user+":"+this.pwd+"@"+this.host+":"+this.port+"/"+this.db;
	t.pgPool = new pgpool({
		host: this.host,
		database: this.db,
		user: this.user,
		password: this.pwd,
		port: this.port,
  //ssl: true,
  max: 90, //set pool max size to 20
  //min: 4, //set min pool size to 4
  //idleTimeoutMillis: 1000 //close idle clients after 1 second
});

	t.pgPool.connect().then(client => {
		client.query('SELECT version();', []).then(res => {
			client.release()
			console.log(res.rows[0]) 
		})
		.catch(e => {
			client.release()
			console.error('query error', e.message, e.stack)
		})
	});

	t.get_schema().then(function(){

	});

},
startup: function(){
	console.log('Startup');
}, 
get_schema: function(){
	var t = this;
	var q = 'SELECT * FROM view_table_schema;';
	var deferred = new Deferred();

	t.query(q, []).then(function(result){
		t._schema = new Memory({data: result.rows, idProperty: 'tschema_tname'});
		deferred.resolve(result);
	});
	return deferred.promise;
},
get_table_schema: function(_tschema_tname){
	var t = this;
	var resultado = [];

	t._schema.query({tschema_tname: _tschema_tname}).forEach(function(r){
		resultado.push(r);
	});

	return resultado;
},
get_change_in_tables: function(){
	var deferred = new Deferred();
	var t = this;
	this.query("SELECT tschema_tname, table_name, datetime_modif as ts FROM view_last_modif_tables;").then(function(result){

		array.forEach(result.rows, function(row){
			var newts = Date.parse(row.ts);

			if(typeof t._last_ts[row.tschema_tname] === 'undefined'){

				t._last_ts[row.tschema_tname] = newts;
				t.send_notification_area(row.tschema_tname);
				t.emit("tschange", {table_name: row.tschema_tname,  ts: newts});

			}else{

				if(t._last_ts[row.tschema_tname]  !=  newts){
					t._last_ts[row.tschema_tname] = newts;
					t.send_notification_area(row.tschema_tname);
					t.emit("tschange", {table_name: row.tschema_tname,  ts: newts});
				}

			}
		});
		deferred.resolve(true);

	});
	return deferred.promise;
},
get_config_from_db: function(){
	var t = this;
	var q = 'SELECT * FROM configuration_server WHERE enabled = true;';

	var deferred = new Deferred();

	t.query(q, []).then(function(result){
		t.configuration_server = new Memory({data: result.rows, idProperty: 'config_name'});

		t.configuration_server.query().forEach(function(config){
			switch(config.config_name){
				case "SMTP":

				if(config.configuration.host){
					process.env.SMPT_HOST = config.configuration.host;
				}

				if(config.configuration.port){
					process.env.SMPT_PORT = config.configuration.port;
				}

				if(config.configuration.ignoreTLS){
					process.env.SMPT_IGNORETLS = config.configuration.ignoreTLS;
				}

				if(config.configuration.secure){
					process.env.SMPT_SECURE = config.configuration.secure;
				}

				if(config.configuration.auth.user){
					process.env.SMPT_AUTH_USER = config.configuration.auth.user;
				}

				if(config.configuration.auth.pass){
					process.env.SMPT_AUTH_PWD = config.configuration.auth.pass;
				}

				break;
			}
		});

		deferred.resolve(result);
	});

	return deferred.promise;
},
///////////////////////////////////////////////////////////////
connString: function(){
	return "pg://"+this.user+":"+this.pwd+"@"+this.host+":"+this.port+"/"+this.db;
},
///////////////////////////////////////////////////////////////
query: function(_query, _param){

	var deferred = new Deferred();
	var t = this;	
	if(!_param){
		_param = [];
	}

	t.pgPool.connect().then(client => {
		client.query(_query, _param).then(res => {
			client.release();
			deferred.resolve(res);
		})
		.catch(e => {
			console.trace(_query, _param);
			console.trace(e);
			client.release();
			deferred.reject(e);
		})
	})
	.catch(e => {
		console.trace(e);
		deferred.reject(e);
	})

	return deferred.promise;
},
login: function(user, password, remoteAddress, userAgent){

	var t = this;
	var q = "SELECT * from public.fun_login_system($1::TEXT, $2::TEXT, $3::INET, $4::TEXT);";
	return t.query(q, [user, password, remoteAddress, userAgent]);
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
send_notification_area: function(_table_notifications){

	var t = this;

	if(_table_notifications === "gui.notification_area"){
		t.query("SELECT * FROM gui.notification_area WHERE idnotify > $1::integer ORDER BY idnotify;", [t._last_idnotify_notification_area]).then(function(result){
			array.forEach(result.rows, function(n, i){
				t._last_idnotify_notification_area = n.idnotify;    
				t.emit("notifying_the_user", n);
			});
		}, function(error){
			t.emit("pgError", error);
		});

/*
		pg.connect(t.connString(), (err, client, done) => {

			if(err) {
				done();
				return false;
			}

			var query = client.query("SELECT * FROM gui.notification_area WHERE idnotify > $1::integer ORDER BY idnotify;", [t._last_idnotify_notification_area]);

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
*/
}

},
response_insert: function(res, _query, _param){
	var t = this;
	pg.connect(t.connString(), (err, client, done) => {
		if(err) {
			done();
		//	console.log(err);
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
response_query: function(res, _query, _param){
	var t = this;
	t.query(_query, _param).then(function(result){
		res.json(result.rows);
	}, function(error){
		res.status(500).json({success: false, data: error});
	});
/*
	pg.connect(t.connString(), (err, client, done) => {
		if(err) {
			done();
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
	*/
},
response_update: function(res, _query, _param){
	var t = this;
	pg.connect(t.connString(), (err, client, done) => {
		if(err) {
			done();
		//	console.log(err);
		res.status(500).json({success: false, data: err, query: _query});
	}

	var query = client.query(_query, _param, (error)=>{
		if(error){
			res.status(500).json({success: false, data: error, query: _query});
		}
	});

	query.on('end', (result) => {
		res.json({success: true, rowCount: result.rowCount});
		done();
	});

});
},
textToMD5: function(text){
	return MD5(text, dojox.encoding.digests.outputTypes.Hex);
}




});
});
