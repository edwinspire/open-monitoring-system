require(["api/express/express",
  "dojo/on", 
  "dojo/_base/array", 
  "dojo/node!os",
  "dojo/node!cluster",
  "dojo/node!crypto",
  "dojo/node!socket.io", 
  "dojo/node!path", 
  "dojo/node!fs", 
  "dojo/node!log",
  "dojo/node!https",
  "dojo/node!url", 
  "dojo/node!pg", 
  "dojo/node!nodemailer",
  "api/postgres/oms", 
  "dojox/encoding/digests/MD5", 
  "api/config", 
  "api/session_users/session_users", 
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
  "api/postgres/udc_account_events_comments" ,
  "api/postgres/schema_public",
  "api/postgres/schema_secondary",
  "api/postgres/schema_events",
  "api/postgres/schema_gui",
  "api/postgres/services"
  ], function(express, on, array, os, cluster, crypto, socketIO, path, fs, LogSystem, https, url, pG, nodeMailer, pgOMS, MD5, Config, sessionusers){


    var Log = new LogSystem('debug', fs.createWriteStream('Log_oms'+(new Date()).toLocaleDateString()+'.log'));
    Log.debug("Inicia Open Monitoring System WebApp");

    const numCPUs = os.cpus().length;

    var sessionUsers = new sessionusers();
    var PostgreSQL = new pgOMS({user: process.env.PG_USER, pwd: process.env.PG_PWD, host: process.env.PG_HOST, db: process.env.PG_DB});

// Obtenemos configuraciones desde el servidor
PostgreSQL.get_config_from_db().then(function(){

  PostgreSQL._schema_gui_properties_fromdb().then(function(r){
      //Log.debug(r);
    });

  setInterval(function(){

    PostgreSQL.get_change_in_tables().then(function(){
  //Log.debug('Se busca cambios en las tablas');
});

  }, 3*1000);


  setInterval(function(){
    Log.debug('Tareas periodicas');
    PostgreSQL.query("SELECT * FROM events.fun_set_expired_events();", []).then(function(response){
      //Log.debug(response);
    });
    PostgreSQL.query("SELECT * FROM gui.fun_remove_notifications_old();", []).then(function(response){
      //Log.debug(response);
    });
    PostgreSQL.query("SELECT * FROM fun_last_modified_table_remove_olds();", []).then(function(response){
      //Log.debug(response);
    });

// Esto debe dispararse solo al inicio de la aplicacion y cuando haya cambios en las tablas involucradas
PostgreSQL._schema_gui_properties_fromdb().then(function(r){
  Log.debug(r);
});
}, 15*1000);


  sessionUsers.on('dead_session', function(datauser){

    sessionUsers.remove(datauser.id);

    PostgreSQL.logout(datauser).then(function(results){

    }, function(error){
//res.status(500).json(error);
});


  });


  var cnxSMTP = {host: process.env.SMPT_HOST, port: process.env.SMPT_PORT, ignoreTLS: process.env.SMPT_IGNORETLS, secure: process.env.SMPT_SECURE, auth: {user: process.env.SMPT_AUTH_USER, pass: process.env.SMPT_AUTH_PWD}};
  Log.debug(cnxSMTP);
// create reusable transporter object using the default SMTP transport 
var transporter = nodeMailer.createTransport(cnxSMTP);

PostgreSQL.configuration_server.query({config_name: "mailOptions"}).forEach(function(config){

  config.configuration.html = '<b>Open Monitoring System</b><p>'+os.hostname()+'</p><p>'+os.platform()+'</p><p>Webserver Port: '+process.env.PORT+'</p><p>Total Mem: '+os.totalmem()+'</p>';

  transporter.sendMail(config.configuration, function(error, info){
    if(error){
      return Log.debug(error);
    }
    Log.debug('Message email sent: ' + info.response);
  });
});

var exp = new express();
exp.pG = PostgreSQL;

var webServer = https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  requestCert: true
}, exp.app);

var sio = socketIO.listen(webServer);

var pgEventTs = PostgreSQL.on('tschange', function(r){

  Log.debug(r);

  if(r.table_name == 'gui.column_properties' || r.table_name == 'gui.tables_view_properties'){
    PostgreSQL._schema_gui_properties_fromdb().then(function(rx){
      Log.debug('GUI ha cambiado');
    }); 
  }

  sio.emit('pgtschange', JSON.stringify(r));
});

var pgEventNotif = PostgreSQL.on('notifying_the_user', function(r){
  sio.emit('notifying_the_user', JSON.stringify(r));
});



//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
// Add a connect listener
sio.on('connection', function(clientio){ 

  clientio.emit('connection', 'Welcome Open Monitoring System!');

//------------------------------------------
clientio.on('heartbeat',function(event){ 
  var datauser = sessionUsers.datauser(event.sessionidclient);

  if(datauser){
    datauser.heartbeat = Date.now();
    sessionUsers.put(datauser);
  }else{

    clientio.emit('command', {command: 'logout'});
    clientio.disconnect('unauthorized');
  }

});


//------------------------------------------
clientio.on('wsservice',function(message){ 

  var wsObj = JSON.parse(message);
  var r = {Service: "-", Return: [], Message: "--", DeviceKey: "--"};

  if(PostgreSQL.textToMD5(clientio.id) == wsObj.token){

    PostgreSQL.service_ws(clientio, wsObj);

  }else{
    console.log("Ha expirado");
    clientio.emit('token_expired');
  }

}); 


//------------------------------------------
clientio.on('clogin',function(config){ 

  var CommunicatorConfig = JSON.parse(config);
  var WSClient = this;

  console.log(CommunicatorConfig, WSClient.handshake);

  PostgreSQL.query("SELECT services.fun_login($1::bigint, $2::text, $3::inet);", [CommunicatorConfig.Id, CommunicatorConfig.Pwd, WSClient.handshake.address.address]).then(function(results){
    if(results.rowCount == 1){
      WSClient.emit('clogged', PostgreSQL.textToMD5(WSClient.id));
    }else{
      WSClient.disconnect('unauthorized');
    }

  }, function(error){
    WSClient.emit('clogged', error);
    WSClient.disconnect('unauthorized');
  });


});



clientio.on('disconnect',function(){
  Log.debug('Server has disconnected');

});

clientio.on('reconnect', function() {
  Log.debug('reconnect fired!');
  console.log('reconnect fired!');
});

});



sessionUsers.on('newsession', function(e){
  Log.debug(e);
  sio.emit('command', {command: 'heartbeat'});    
});



webServer.listen(process.env.PORT, function(){
  Log.debug("Listening on " + process.env.PORT);
});




var pgEventError = PostgreSQL.on('pgError', function(error){
  Log.debug(error);
});





process.on('uncaughtException', function(error){
  Log.debug(error);
});


});







////////////////////////////////////////////////////////////
});