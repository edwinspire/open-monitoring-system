/**
     * Postgres custom methods
     *
     * @module postgres.oms
     */
     define(['dojo/_base/declare', "dojo/node!pg-pool", "dojo/Evented", "dojo/Deferred", "dojo/_base/array", "dojo/store/Memory", "dojox/encoding/digests/MD5"
     	], function (declare, pgpool, Evented, Deferred, array, Memory, MD5) {

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
     			services: {},
     			_schema: new Memory(),
     			pgPool: {},
     			gui_db_structure: {},


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
  max: 50, //set pool max size to 20
  //min: 4, //set min pool size to 4
  idleTimeoutMillis: 1000, // close idle clients after 1 second
  connectionTimeoutMillis: 5000
});



	t.ConnectNotify(['test', 'event_datas_i']);

/*
	t.query('SELECT version();', []).then((result)=>{
		console.log(result.rows[0]) 
	}, (e)=>{
		console.error('query error', e.message, e.stack)
	});


	t.get_gui_db_structure().then(function(result){
		//console.log(t.get_gui_table_structure('events.datas'));
		try{
			let x = t.QueryBuilder('events.datas', 'SELECT * FROM @:0 where @:1 AND @:2', [{column: 'dateevent', operator: '<', value: 'now()'}, {column: 'prioritys', operator: '=', value: 1}]);
		}catch(e){
			console.log(e);
		}
	}, function(e){
		console.log(e);
	});


	t.get_schema().then(function(){

	});
	*/

},
startup: function(){
	console.log('Startup');
}, 
start: function(){
	let t = this;
	let deferred = new Deferred();

	t.query('SELECT version();', []).then((result)=>{
		console.log(result.rows[0]) 

		t.fun_mapper().then((result)=>{
			console.log('Se obtuvo la lista de schemas y tablas');

			t.get_gui_db_structure().then((result)=>{
				console.log('Se obtuvo la estructura de la base de datos');

				t.get_config_from_db().then((result)=>{
					console.log('Se obtuvo configuraciones desde la base de datos');

					t.get_services().then((result)=>{
						console.log('Se la lista de servicios desde la base de datos');
						deferred.resolve(true);
					}, (error)=>{
						deferred.reject(error);
					});

				}, (error)=>{
					deferred.reject(error);
				});

			}, (error)=>{
				deferred.reject(error);
			});

		}, (error)=>{
			deferred.reject(error);
		});

	}, (e)=>{
		console.error('Query error', e.message, e.stack);
		deferred.reject(error);
	});


	return deferred.promise;
},
fun_mapper: function(){
	let t = this;
	let q = 'SELECT gui.fun_mapper();';
	let deferred = new Deferred();

	t.query(q, []).then(function(result){
		deferred.resolve(result);
	});
	return deferred.promise;
},
get_gui_db_structure: function(){
	let t = this;
	let q = "SELECT gui.funjs_db_structure('');";
	let deferred = new Deferred();

	t.query(q, []).then(function(result){
		if(result.rows.length > 0){
			t.gui_db_structure = result.rows[0].funjs_db_structure[0];
		}else{
			t.gui_db_structure = {};
		}
		deferred.resolve(t.gui_db_structure);
	});
	return deferred.promise;
},
get_gui_table_structure: function(schema_table){
	let param = schema_table.split(".");
	let t = this;
	if(param.length > 1 && t.gui_db_structure[param[0]] && t.gui_db_structure[param[0]][param[1]]){
		return t.gui_db_structure[param[0]][param[1]];
	}else{
		return false;
	}
},
get_schema: function(){
	// TODO: Esto podria borrarse
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
	// TODO: Esto podria borrarse
	var t = this;
	var resultado = [];

	t._schema.query({tschema_tname: _tschema_tname}).forEach(function(r){
		resultado.push(r);
	});

	return resultado;
},
get_change_in_tables: function(){
	// TODO - Esto podria borrarse auna vez se lo reemplace con un evento directo de la base
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
				case 'XMPP':
				if(config.configuration.server){
					process.env.XMPP_SERVER = config.configuration.server;
				}
				if(config.configuration.username){
					process.env.XMPP_USERNAME = config.configuration.username;
				}
				if(config.configuration.pwd){
					process.env.XMPP_PASSWORD = config.configuration.pwd;
				}
				break;
			}
		});

		deferred.resolve(result);
	});

	return deferred.promise;
},
get_services: function(){
	// Esto deberia ejecutarse al inicio y volverse a ejecutar unicamente cuando se haya recibido modificaciones en la tabla
	let t = this;
	let q = 'SELECT * FROM services.services;';
	let deferred = new Deferred();

	t.query(q, []).then(function(result){
		t.services = new Memory({data: result.rows, idProperty: 'service_name'});
		deferred.resolve(t.services);
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

	t.pgPool.query(_query, _param)
	.then((res) => {
		deferred.resolve(res);
	})
	.catch(err => {
		console.error('* Error executing query', _query, err.stack);
		deferred.reject(err);
	});


	return deferred.promise;
},
ConnectNotify: function(channels){

	this.pgPool.connect().then(client => {

		client.on('notification', function(n){
			console.log(n);
		})

		client.query('SELECT public.funjs_listen($1);', [JSON.stringify(channels)]).then(res => {
			//client.release()
			console.log('Connect Notify', res)
		})
		.catch(e => {
			client.release()
			console.error('query error', e)
		})
	})

},
login: function(user, password, remoteAddress, userAgent){
	var t = this;
	var q = "SELECT * from public.fun_login_system($1::TEXT, $2::TEXT, $3::INET, $4::TEXT);";
	return t.query(q, [user, password, remoteAddress, userAgent]);
},
logout: function(datauser){
	var t = this;
	var q = "SELECT * FROM fun_logout_system($1::BOOLEAN, $2::BIGINT, $3::TEXT, $4::INET);";

	return t.query(q, [false, datauser.idcontact, datauser.fullname, datauser.ip]);	
},
service_point: function(request_service){
	var t = this;
	return t.query("SELECT services.funjs_point($1::JSON) as return;", [request_service]);	
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

	var query = client.query(_query, (error)=>{
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
