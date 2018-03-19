define([
	"dojo/_base/declare",
	"dojo/node!express",
	"dojo/node!cookie-parser", 
	"dojo/node!compression", 
	"dojo/node!body-parser", 
	"dojo/node!passport",
	"dojo/node!passport-local",
	"dojo/node!express-session",
	"dojo/node!morgan",
	"dojo/store/Memory",
	"dojo/Evented",
	"dojo/node!crypto",
	"dojo/date"
	], function(declare, expressjs, cookieParser, compression, bodyParser, passport, passportLocal, expressSession, morgan, Memory, Evented, crypto, DojoDate){
		return declare(Evented, {

			app: null,
			heartbeatInterval: 30,
			_pG: null,
			_storeSessions: new Memory(),

			constructor: function(args){

				declare.safeMixin(this,args);
				var t = this;
				t._storeSessions = new Memory({idProperty: 'sessionIDSystem'});

				setInterval(function(){

					t._storeSessions.query().forEach(function(item){
						if(DojoDate.difference(item.heartbeat, new Date(), "seconds") > t.heartbeatInterval){
							t._storeSessions.remove(item.sessionIDSystem);
						}
					});

				}, t.heartbeatInterval*30);


				t.app = expressjs();

				t.app.use(expressjs.static(process.env.EXPRESS_STATIC_DIR));
				t.app.use(cookieParser());
				t.app.use(compression());
				t.app.use(morgan('common'));
				t.app.use( bodyParser.json() );      
				t.app.use(bodyParser.urlencoded({    
					extended: true
				})); 


				function _Login(req, res, next){

					t._pG.login(req.body.user, req.body.pwd, req.connection.remoteAddress, req.headers['user-agent']).then(function(results){
						var r =  results.rows;
						if(r.length > 0 && r[0]['fun_login_system']){
							var u = r[0]['fun_login_system'];

							var datauser = u;

							t._storeSessions.query({idcontact: datauser.idcontact}).forEach(function(item){
								t._storeSessions.remove(item.sessionIDSystem);
							});

							datauser['heartbeat'] = new Date();
							datauser['Syslogin'] = new Date();
							var sid = t._pG.textToMD5(JSON.stringify(u)+Date.now());
							datauser['sessionIDSystem'] = sid;
							datauser['ip'] = req.connection.remoteAddress;
							t._storeSessions.put(datauser);
							res.cookie('sessionIDSystem', sid, { maxAge: 3600000});
							res.cookie('SessionFullname', datauser.fullname, { maxAge: 3600000});
							t.emit('new_session', datauser);

							next();
						}else{
							res.redirect("/logout");
						}
					}, function(error){
						res.redirect("/logout");
					});
				}

				function _isAuthenticated(req, res, next){

					if(t.isAuthenticated(req.cookies['sessionIDSystem'])){
						next();
					}else{
						res.redirect("/logout");
					}

				}




	t.app.get('/map.html',  function(req, res){

		var geodata = [];

		var send = function(status, content, arraygeo){
			res.writeHead(status, { 'Content-Type': 'text/html' });
			res.write(content.replace('@@points@@', JSON.stringify(arraygeo)));
			res.end();  
		}

		fs.readFile(process.env.EXPRESS_STATIC_DIR+'/map_template.html', 'utf8', function (err, data) {
			if (err) {
				send(500, err, []);
			}else{

				if(true){

					if(req.query.maptype){

						var q = 'SELECT * FROM contacts.contacts WHERE idcontact = $1::BIGINT;';
						var p = [-999];

						switch(req.query.maptype){
							case 'contact_only':
							if(req.query.idcontact){
								q = 'SELECT * FROM contacts.contacts WHERE idcontact = $1::BIGINT;';
								p = [req.query.idcontact]    
							}
							break;
							case 'all_contacts':
							q = 'SELECT * FROM contacts.contacts WHERE enabled = true;';
							p = [] 
							break;
						}

						t._pG.query(q, p).then(function(response){
							geodata = response.rows;
							send(200, data, geodata);
						});

					}else{
						send(500, 'maptype no defined', []);
					}

				}else{
					send(401, content, geodata);
				}

			}


		});


	});





////////////////////////////////////////////////////////////////////////////////////////
t.app.post("/receiver", _isAuthenticated, function(req, res){
// TODO Implementar un mecaniso de seguridad para impedir ingreso de eventos por algun hacker
t._pG.receiver_event(req, res);
});


////////////////////////////////////////////////////////////////////////////////////////
t.app.post("/db/*", _isAuthenticated, function(req, res){

	var parts = req.path.split("/");
	console.log(parts);
	if(parts.length > 8){

		var params = {schema: parts[2], objectdb: parts[3], action: parts[4]};

		params.onupdate = {};

		try{
			params.onupdate[parts[5]] = parts[6];
			params.onupdate[parts[7]] = parts[8];
		}catch(e){
			res.status(500).json({path: req.path, error: e});
		}

		var obj = 'schema_'+params.schema+'_'+params.objectdb;

		console.log(obj);

		if(t._pG[obj]){
			t._pG[obj](req, res, params);
		}else{
			res.status(404).json({path: req.path});
		}

	}else{
		res.status(500).json({path: req.path, error: 'No tiene los argumentos completos'});
	}



});


////////////////////////////////////////////////////////////////////////////////////////
t.app.post("/servicex/model",  function(req, res){
	var model = t._pG.schema_gui_funjs_db_model(req.body.schema_table);

	model.then(function(result){

		if(result.rows.length > 0){
			var r = result.rows[0].return;
			res.status(200).send(r);
		}else{
			res.status(200).send("");
		}

	}, function(err){
		console.log(err);
	});
});


////////////////////////////////////////////////////////////////////////////////////////
t.app.post("/servicex/public",  function(req, res){

	var request_service = JSON.parse(req.body.data);
	t._pG.service_htttp(res, request_service);
});


////////////////////////////////////////////////////////////////////////////////////////
t.app.post("/servicex/private", _isAuthenticated, function(req, res){

	var request_service = JSON.parse(req.body.data);
	t._pG.service_htttp(res, request_service);
});

////////////////////////////////////////////////////////////////////////////////////////
// Este debe ser el unico punto de entrada para consultas a la base de datos
t.app.post("/service/*",  function(req, res){

	console.log(req);
	let b = req.body;

	let service = req.originalUrl.split('?')[0].split('/')[2];
	let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	let token_agent = t._pG.textToMD5(ip+req.headers['user-agent']);
	let rs = {service: service, body: req.body, cookies: req.cookies, route: req.route, headers: req.headers, remoteAddress: ip, token_agent: token_agent};
	console.log(rs);
	let request_service = JSON.stringify(rs);
	
	t._pG.service_point(request_service).then(function(result){

		let r = {};
		if(result.rows.length > 0 && result.rows[0].return){
			r = result.rows[0].return;
		}

		console.log("--->>>>>>>>>>> ", r);

		switch(service){
			case 'login_user':
			
			if(r.length > 0 && r[0].error == 0){

				res.cookie('sessionIDSystem', r[0].return.token, { maxAge: 3600000});
				res.cookie('SessionFullname', 'No definido', { maxAge: 3600000}); //			t.emit('new_session', datauser);
				res.redirect('/app/index.html');
				
			}else{
				let cookie = req.cookies;
				for (var prop in cookie) {
					if (!cookie.hasOwnProperty(prop)) {
						continue;
					}    
					res.cookie(prop, '', {expires: new Date(0)});
				}
				res.redirect('/');
			}
			break;
			case 'logout_user':
			let cookie = req.cookies;
			for (var prop in cookie) {
				if (!cookie.hasOwnProperty(prop)) {
					continue;
				}    
				res.cookie(prop, '', {expires: new Date(0)});
			}
			res.redirect('/');
			break;
			default:
			res.json(r);
			break;
		}

	}, function(error){
		res.status(500).json({success: false, data: error});
	});

});



////////////////////////////////////////////////////////////////////////////////////////
t.app.get('/service/logout_user', function(req, res){

	let service = 'logout_user';
	let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	let token_agent = t._pG.textToMD5(ip+req.headers['user-agent']);
	let rs = {service: service, body: req.body, cookies: req.cookies, route: req.route, headers: req.headers, remoteAddress: ip, token_agent: token_agent};
	console.log(rs);
	let request_service = JSON.stringify(rs);
	
	t._pG.service_point(request_service).then(function(result){

		let r = {};
		if(result.rows.length > 0 && result.rows[0].return){
			r = result.rows[0].return;
		}

		console.log("--->>>>>>>>>>> ", r);

		let cookie = req.cookies;
		for (var prop in cookie) {
			if (!cookie.hasOwnProperty(prop)) {
				continue;
			}    
			res.cookie(prop, '', {expires: new Date(0)});
		}
		res.redirect('/');


	})

});


////////////////////////////////////////////////////////////////////////////////////////
t.app.post("/servicexxx/*",  function(req, res){

	var parts = req.path.split("/");

	if(parts.length >= 8){

		var params = {service: parts[2], objectdb: parts[3], action: parts[4]};

		switch(params.service){
			case "objects":

			switch(params.objectdb){
				case "view_equipment_config":
				t._pG.service_objects_view_equipment_config(req, res, params);
				break;
				default:
				console.log('No existe 1', req.path);
				res.status(404).json({path: req.path});
				break;
			}
			break;

			default:
			console.log('No existe 3', req.path);
			res.status(404).json({path: req.path});
			break;
		}

	}else{
		res.status(500).json({path: req.path, error: 'No tiene los argumentos completos'});
	}
});

t.app.use(function(req, res, next) {
	console.log(req.originalUrl);
	res.status(404).send('Sorry cant find that!'+' '+process.env.EXPRESS_STATIC_DIR+' '+req.originalUrl);
});

t.app.use(function(err, req, res, next) {
	console.log(err.stack);
	res.status(500).send('Something broke!');
}); 

},
encrypt: function(myMessage, myPassword){
	var cipher = crypto.createCipher('aes192', myPassword);
	var crypted = cipher.update(myMessage,'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
},
decrypt: function(ciphertext, myPassword){
	try{
		var decipher = crypto.createDecipher('aes192',myPassword)
		var dec = decipher.update(ciphertext,'hex','utf8')
		return dec += decipher.final('utf8');
	}catch(e){
		console.warn(e);
		return false;
	}
},
isAuthenticated: function(sessionIDSystem){
	var t = this;
	var user = t._storeSessions.get(sessionIDSystem);
	if(sessionIDSystem && user && user.idcontact > 0){
		return user;
	}else{
		return false;
	}
},
userHeartbeat: function(sessionIDSystem){
	var user = this.isAuthenticated(sessionIDSystem);
	if(user){
		user.heartbeat = Date.now();
		this._storeSessions.put(user);
		return true;
	}else{
		return false;
	}
}









});
});