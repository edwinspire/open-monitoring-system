/**
     * Postgres custom methods
     *
     * @module postgres.oms
     */
     define(['dojo/_base/declare',  "dojo/node!pg", "dojo/Evented", "dojo/Deferred", "dojo/_base/array", "dojo/store/Memory", "api/postgres/udc_dgrid_structure"
     	], function (declare, pg, Evented, Deferred, array, Memory) {

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

//////////////////////////////////
// The constructor
constructor: function(args) {
	this.port = 5432;
	dojo.safeMixin(this,args);
	var t = this;
	t._last_ts = {};
	t._last_idnotify_notification_area = 0;
	t.tv_structure= {};

	setTimeout(function(){

		t.get_dgrid_fullstructure();
		//t.get_config_from_db();

		setInterval(function(){

			var q = "SELECT table_name, datetime_modif as ts FROM view_last_modif_tables;";
			pg.connect(t.connString(), (err, client, done) => {
				if(err) {
					done();
					console.log(err);
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

	pg.connect(t.connString(), (err, client, done) => {

		if(err) {
			
			console.log(err);
			deferred.reject(err);
			done(err);
		}

		var q = client.query(_query, _param, (error)=>{
			
			if(error){
				t.emit("tschange", error);
				deferred.reject(error);
			}
			done(error);
		});

		q.on('end', (result) => {
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
send_notification_area: function(_table_notifications){

	var t = this;

	if(_table_notifications === "notification_area"){

		pg.connect(t.connString(), (err, client, done) => {

			if(err) {
				done();
				console.log(err);
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
response_insert: function(res, _query, _param){
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
response_query: function(res, _query, _param){
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
response_update: function(res, _query, _param){
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
