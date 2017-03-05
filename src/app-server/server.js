require(["dojo/request",
	"dojo/on", 
	"dojo/_base/array", 
	"dojo/node!crypto",
	"dojo/node!http", 
	"dojo/node!socket.io", 
	"dojo/node!path", 
	"dojo/node!fs", 
	"dojo/node!url", 
	"dojo/node!cors", 
	"dojo/node!cookie-parser", 
	"dojo/node!path-to-regexp", 
	"dojo/node!express", 
	"dojo/node!pg", 
	"dojo/node!compression", 
	"dojo/node!mssql", 
	"dojo/node!body-parser", 
	"dojo/node!nodemailer",
	"api/postgres/oms", 
	"dojox/encoding/digests/MD5", 
	"api/config", 
	"api/session_users/session_users", 
	"api/postgres/udc_dgrid_structure", 
	"api/postgres/oms_query_builder", 
	"api/postgres/udc_table_accounts", 
	"api/postgres/udc_table_phones", 
	"api/postgres/udc_table_emails", 
	"api/postgres/udc_table_account_contacts", 
	"api/postgres/udc_table_account_users",
	"api/postgres/udc_table_account_equipments",
	"api/postgres/udc_farma_view_lista_precios",
	"api/postgres/udc_tables_views",
	"api/postgres/udc_tables_columns",
	"api/postgres/udc_table_groups",
	"api/postgres/udc_table_account_events_isopen",
	"api/postgres/udc_table_events_isopen",
	"api/postgres/udc_table_events_details",
	"api/postgres/udc_table_events",
	"api/postgres/udc_account_events_comments"  
	], function(request, on, array, crypto, http, socketIO, path, fs, url, cors, cookieParser, pathToRegexp, express, pG, compression, mssql, bodyParser, nodeMailer, pgOMS, MD5, Config, sessionusers){


		var sessionUsers = new sessionusers();
		var PostgreSQL = new pgOMS({user: process.env.PG_USER, pwd: process.env.PG_PWD, host: process.env.PG_HOST, db: process.env.PG_DB});

// Obtenemos la configuracion desde el servidor
PostgreSQL.get_config_from_db().then(function(){


	setInterval(function(){
		console.log('Tareas periodicas');
		PostgreSQL.query("SELECT * FROM fun_set_expired_events();", []).then(function(response){
			console.log(response);
		});
		PostgreSQL.query("SELECT * FROM fun_remove_notifications_old();", []).then(function(response){
			console.log(response);
		});
	}, 60*1000);


	sessionUsers.on('dead_session', function(datauser){

		sessionUsers.remove(datauser.id);

		PostgreSQL.logout(datauser).then(function(results){

		}, function(error){
//res.status(500).json(error);
});


	});


	var cnxSMTP = {host: process.env.SMPT_HOST, port: process.env.SMPT_PORT, ignoreTLS: process.env.SMPT_IGNORETLS, secure: process.env.SMPT_SECURE, auth: {user: process.env.SMPT_AUTH_USER, pass: process.env.SMPT_AUTH_PWD}};
	console.log(cnxSMTP);
// create reusable transporter object using the default SMTP transport 
var transporter = nodeMailer.createTransport(cnxSMTP);

// mailOptions = {
//     from: '"Edwin De La Cruz 👥" <edwindelacruz@farmaenlace.com>', // sender address 
//     to: 'edwinspire@gmail.com', // list of receivers 
//     subject: 'Open Monitoring System Start ✔ '+Date.now(), // Subject line 
//     text: 'El servidor ha sido iniciado en el puerto '+this.ServerPort, // plaintext body 
//     html: '<b>El servidor ha sido iniciado en el puerto '+this.ServerPort+'</b>' // html body 
// };

PostgreSQL.configuration_server.filter({config_name: "mailOptions"}).forEach(function(config){
//send mail with defined transport object 
//console.log(config);
transporter.sendMail(config.configuration, function(error, info){
	if(error){
		return console.log(error);
	}
	console.log('Message email sent: ' + info.response);
});
});








var app = express();

app.use(express.static(process.env.EXPRESS_STATIC_DIR, {setHeaders: setFontHeaders}));

function setFontHeaders(res) {
     //res.setHeader('Accept-Ranges', 'none');
     // Por el momento no tiene funcion
 }

 app.use(cookieParser());
 app.use(compression());
//app.set('Accept-Ranges', 'none');
//app.use( express.bodyParser());       // to support JSON-encoded bodies
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
})); 


app.get('/map.html',  function(req, res){

    // if(sessionUsers.isauthorized(req, res, true)){
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

    			if(sessionUsers.isauthorized(req, res, true)){

    				if(req.query.maptype){

    					var q = 'SELECT * FROM contacts WHERE idcontact = $1::BIGINT;';
    					var p = [-999];

    					switch(req.query.maptype){
    						case 'contact_only':
    						if(req.query.idcontact){
    							q = 'SELECT * FROM contacts WHERE idcontact = $1::BIGINT;';
    							p = [req.query.idcontact]    
    						}
    						break;
    						case 'all_contacts':
    						q = 'SELECT * FROM contacts WHERE enabled = true;';
    						p = [] 
    						break;
    					}

    					PostgreSQL.query(q, p).then(function(response){
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
app.post("/njs/db/table/*", cors(), function(req, res){

	var u = sessionUsers.isauthorized(req, res, true);

	if(u){

		var table = req.path.replace("/njs/db/table/", "");
		switch(table){
			case "account_events_comments":
			PostgreSQL.udc_account_events_comments(req, res);
			break;        
			case "events":
			PostgreSQL.udc_table_events(req, res, u);
			break;
			case "account_events_isopen":
			PostgreSQL.udc_table_account_events_isopen(req, res);
			break;
			case "view_events_isopen":
			PostgreSQL.udc_table_events_isopen(req, res);
			break;        
			case "view_events_details":
			PostgreSQL.udc_table_events_details(req, res);
			break; 
			case "groups":
			PostgreSQL.udc_table_groups(req, res);
			break;
			case "udc_columns":
			PostgreSQL.udc_tables_columns(req, res);
			break;
			case "udc_tables_views":
			PostgreSQL.udc_tables_views(req, res);
			break;
			case "farma_view_lista_precios":
			PostgreSQL.udc_farma_view_lista_precios(req, res);
			break;
			case "account_equipments":
			PostgreSQL.udc_table_account_equipments(req, res);
			break;
			case "account_users":
			PostgreSQL.udc_table_account_users(req, res);
			break;
			case "account_contacts":
			PostgreSQL.udc_table_account_contacts(req, res);
			break;
			case "emails":
			PostgreSQL.udc_table_emails(req, res);
			break;
			case "phones":
			PostgreSQL.udc_table_phones(req, res);
			break;
			case "accounts":
			PostgreSQL.udc_table_accounts(req, res);
			break;
			default:
			res.status(404).json({table: table});
			break;
		}

	}

});




////////////////////////////////////////////////////////////////////////////////////////
app.post("/njs/login", function(req, res){

 //res.status(500).json({});


 PostgreSQL.login(req, res).then(function(results){

 	var r =  results.rows;
 	if(r.length > 0 && r[0]['fun_login_system']){

 		var u = r[0]['fun_login_system'];

 		sessionUsers.add_user(u, req, res);
        //res.redirect('/oms.html');
        res.status(200).json({success: true});

    }else{
     //res.redirect('/njs/logout');
     res.status(403).json({success: false});
 }

}, function(error){
        //res.status(500).json(error);
        res.redirect('/njs/logout');
    });

});

////////////////////////////////////////////////////////////////////////////////////////
app.get("/njs/logout", function(req, res){

	var sid = req.cookies['oms_sessionidclient'];
	var u = sessionUsers.datauser(sid);
	if(u){

		sessionUsers.remove(sid);

		PostgreSQL.logout(u).then(function(results){
// Usuario a sido deslogueado

res.cookie('oms_sessionidclient', 'anonymous', { maxAge: 1});
res.cookie('oms_fullname', 'anonymous', { maxAge: 1});
res.redirect('/');

}, function(error){
	res.status(500).json(error);
});


	}else{
//res.status(500).json(sid);
res.redirect('/');
}

});

////////////////////////////////////////////////////////////////////////////////////////
app.post("/njs/db/Select_Generic_to_Store", function(req, res){

	var t = this;

	if(sessionUsers.isauthorized(req, res, true)){

		if(req.body._uDCTable){

			var qp;

			switch(req.body._uDCTable){
				case "event_statustypes_to_client":
				var qp = {query: "SELECT ideventstatustype, label_status FROM event_statustypes WHERE internal = false ORDER BY label_status", param: []};
				break;  
				case "event_statustypes":
				var qp = {query: "SELECT ideventstatustype, label_status FROM event_statustypes ORDER BY label_status", param: []};
				break;      
				case 'view_account_contacts':
				var qp = {query: "SELECT idcontact, contact_name FROM view_account_contacts WHERE idaccount = $1::BIGINT ORDER BY contact_name", param: [req.body.idaccount]};
				break;
				case 'eventtypes':
				var qp = {query: "SELECT ideventtype, label FROM eventtypes ORDER BY label", param: []};
				break;
				case 'view_eventtypes_to_client':
				var qp = {query: "SELECT ideventtype, label FROM view_eventtypes_to_client ORDER BY label", param: []};
				break;
				case 'contacts':
				var qp = {query: "SELECT idcontact, (last_name||' '||first_name||' ['||identification||']') as contact_name FROM contacts ORDER BY last_name, first_name", param: []};
				break;
				case 'account_types':
				var qp = {query: "SELECT idaccounttype, type FROM account_types ORDER BY idaccounttype", param: []};
				break;          
				case 'account_states':
				var qp = {query: "SELECT idaccountstate, state FROM account_states ORDER BY state", param: []};
				break;
				case 'identification_types':
				var qp = {query: "SELECT ididtype, name FROM identification_types ORDER BY name", param: []};
				break;
				case 'divisions':
				var qp = {query: "SELECT iddivision, name FROM divisions ORDER BY name", param: []};
				break;
				case 'phone_providers':
				var qp = {query: "SELECT idprovider, provider FROM phone_providers ORDER BY provider", param: []};
				break;
				case 'view_accounts':
				var qp = {query: "SELECT idcontact, (last_name||' '||first_name||' ['||identification||']') as account__name FROM accounts WHERE EXISTS(SELECT idadmin FROM admins WHERE accounts.iddivision = ANY(divisions) AND idadmin = $1::BIGINT) ORDER BY last_name, first_name", param: [2]};
				break;
				case 'equipments_by_account':
				var qp = {query: "SELECT idequipment, (equipment||' ['||code_ref||']') as equipment_name FROM equipments WHERE idaccount = $1::BIGINT ORDER BY equipment;", param: [req.body.idaccount]};
				break;          
				default:
				res.status(500).json({success: false, data: "Intentando obtener datos de la tabla "+req.body._uDCTable});
				return false;
				break;
			}

			pG.connect(PostgreSQL.connString(), (err, client, done) => {
    // Handle connection errors
    if(err) {
    	done();
    	console.log(err);
    	res.status(500).json({success: false, data: err});
    	return false;
    }

    var query = client.query(qp.query, qp.param);

  // After all data is returned, close connection and return results
  query.on('end', (result1) => {
  	res.json(result1.rows);
  	done();
    //t.emit("get_dgrid_structure", t.tv_structure);
});

});

		}else{
			res.status(404).json({success: false, data: {}});
		}

	}

});



////////////////////////////////////////////////////////////////////////////////////////
app.post("/njs/db/uDCFieldTypes", function(req, res){

	var t = this;
	var def = PostgreSQL.get_table_structure(req.body.uDCTable);

	if(def.length > 0){
		res.json(def[0].udc_column_definition);
	}else{
		res.json([]);
	}

});



////////////////////////////////////////////////////////////////////////////////////////
app.post("/njs/db/generic_select", function(req, res){


	var cq = PostgreSQL.Select(req.body.UdcTable, []).build();

//var q = 'SELECT * FROM   public.udc_tables_views,   public//.udc_columns WHERE udc_tables_views.idtableview = udc_columns.idtableview ORDER BY udc_tables_views.tv_name, udc_columns.column_position;';
pG.connect(PostgreSQL.connString(), (err, client, done) => {
    // Handle connection errors
    if(err) {
    	done();
    	console.log(err);
    	res.status(500).json({success: false, data: err});
    //return false;
}

console.log(cq);
var query = client.query(cq.query, cq.param);

  // After all data is returned, close connection and return results
  query.on('end', (result1) => {
  	res.json(result1.rows);
  	done();
    //t.emit("get_dgrid_structure", t.tv_structure);
});

});


});



////////////////////////////////////////////////////////////////////////////////////////
app.post("/njs/admin_status_login", function(req, res){

	res.status(200).json(sessionUsers.users_status());


});

////////////////////////////////////////////////////////////////////////////////////////
app.post("/njs/db/dgrid_table_structure", function(req, res){

   // var user = sessionUsers.user(res.cookie('oms_sessionidclient'), req);
   res.type('application/javascript'); 

   if(true){

   	if(req.body.UdcTable){

   		// PostgreSQL.get_table_structure(req.body.UdcTable, req.body.Fields).then(function(result){

   		// 	res.send(JSON.stringify(result, function(key, value){

   		// 		if(typeof value === "string"){
   		// 			return value.split("\n").join(' ');
   		// 		}else if(value === null) {
   		// 			return undefined;
   		// 		}
   		// 		return value;
   		// 	}).replace(/(\"<jsfunction>|<\/jsfunction>\")/ig,''));

   		// });

   		var structure = PostgreSQL.get_table_structure(req.body.UdcTable, req.body.Fields);

   		res.send(JSON.stringify(structure, function(key, value){

   			if(typeof value === "string"){
   				return value.split("\n").join(' ');
   			}else if(value === null) {
   				return undefined;
   			}
   			return value;
   		}).replace(/(\"<jsfunction>|<\/jsfunction>\")/ig,''));

   	}

   }else{
//  res.writeHead(401);
res.status(401).json({});
}

});

app.use(function(req, res, next) {
	res.status(404).send('Sorry cant find that!'+' '+process.env.EXPRESS_STATIC_DIR+' '+req.originalUrl);
});


//*******************************************************//
//*******************************************************//

//** Arranca el servidor **//
var port = process.env.PORT||80;

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('Something broke!');
}); 




var server = http.createServer(app)
, sio = socketIO.listen(server);


PostgreSQL.on('get_dgrid_structure', function(tv){
	console.log('Emite evento de postgres', tv);

});


var pgEventTs = PostgreSQL.on('tschange', function(r){
	sio.emit('pgtschange', JSON.stringify(r));
});

var pgEventNotif = PostgreSQL.on('notifying_the_user', function(r){
	sio.emit('notifying_the_user', JSON.stringify(r));
});


sessionUsers.on('newsession', function(e){
	console.log(e);
	sio.emit('command', {command: 'heartbeat'});    
});


// Add a connect listener
sio.on('connection', function(client){ 

	client.emit('connection', 'Open Monitoring System');

    // Success!  Now listen to messages to be received
    client.on('heartbeat',function(event){ 
       // console.log('Received message from client!', event.sessionidclient, sessionUsers.session);
//sid = event.sessionidclient;
var datauser = sessionUsers.datauser(event.sessionidclient);

if(datauser){
    //client.emit('notifying_the_user', sessionUsers.sessionUsers);
    datauser.heartbeat = Date.now();
    sessionUsers.put(datauser);

}else{

	client.emit('command', {command: 'logout'});
}

});

    client.on('disconnect',function(){
    	console.log('Server has disconnected');

    });

    client.on('reconnect', function() {
    	console.log('reconnect fired!');
    });

});


process.on('uncaughtException', function(error){
	console.log(error);
});


server.listen(port, function(){
	console.log("Listening on " + port);
});



});




////////////////////////////////////////////////////////////
});