require(["api/express/express",
  "dojo/on", 
  "dojo/_base/array", 
  "dojo/node!os",
  "dojo/node!@xmpp/client",
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
  ], function(express, on, array, os, xmppC, cluster, crypto, socketIO, path, fs, LogSystem, https, url, pG, nodeMailer, pgOMS, MD5, Config){


    //var Log = new LogSystem('debug', fs.createWriteStream('Log_oms'+(new Date()).toLocaleDateString()+'.log'));
    //Log.debug("Inicia Open Monitoring System WebApp");

    console.log(xmppC);

const client = new xmppC.Client();
//const client = new xmppC.Client();

 
// Log errors
client.on('error', err => {
  console.error('❌', err.toString())
})

// Log status changes
client.on('status', (status, value) => {
  console.log('🛈', status, value ? value.toString() : '')
})

// Useful for logging raw traffic
// Emitted for every incoming fragment
// -- client.on('input', data => console.log('⮈', data))
// Emitted for every outgoing fragment
// -- client.on('output', data => console.log('⮊', data))

// Useful for logging XML traffic
// Emitted for every incoming XML element
// client.on('element', data => console.log('⮈', data))
// Emitted for every outgoing XML element
// client.on('send', data => console.log('⮊', data))

client.on('stanza', el => {
  if (el.is('presence') && el.attrs.from === client.jid.toString()) {
    console.log('🗸', 'available, ready to receive <message/>s')
  }
})

client.on('online', jid => {
  console.log('jid', jid.toString())
  client.send(xmppC.xml('presence'))



client.on('stanza', el => {

    if (el.is('presence') && el.attrs.from === client.jid.toString()) {
      console.log('👌', 'available, ready to receive <message/>s');
  console.log(JSON.stringify(el));    
    }

    if (el.is('message')) {
      //console.log('👌', 'available, ready to receive <message/>s');
  console.log(JSON.stringify(el));    
    }

  })


     // prettier-ignore
    client.send(
     xmppC.xml('message', {to: 'edwinspire@suchat.org', type: 'chat'},
       xmppC.xml('body', {}, 'hello  word...')
      )
    )


})

// "start" opens the socket and the XML stream
client
  .start('suchat.org') // Auto
  // .start('xmpp://localhost:5222') // TCP
  // .start('xmpps://localhost:5223') // TLS
  // .start('ws://localhost:5280/xmpp-websocket') // Websocket
  // .start('wss://localhost:5281/xmpp-websocket') // Secure WebSocket
  .catch(err => {
    console.error('start failed', err)
  })

// Handle authentication to provide credentials
client.handle('authenticate', authenticate => {
  return authenticate('sasasasasasasasasasasasas@suchat.org', 'shaguarmasha')
})

// Handle binding to choose resource - optional
client.handle('bind', bind => {
  return bind('example')
})

  
  


console.log('Server 1'); 





    const numCPUs = os.cpus().length;

    //var sessionUsers = new sessionusers();
    var PostgreSQL = new pgOMS({user: process.env.PG_USER, pwd: process.env.PG_PWD, host: process.env.PG_HOST, db: process.env.PG_DB});

// Obtenemos configuraciones desde el servidor
PostgreSQL.get_config_from_db().then(function(){

  PostgreSQL._schema_gui_properties_fromdb().then(function(r){
      ////Log.debug(r);
    });

  setInterval(function(){
    PostgreSQL.get_change_in_tables().then(function(){
  ////Log.debug('Se busca cambios en las tablas');
});

  }, 25*100);


  setInterval(function(){
    //Log.debug('Tareas periodicas');
    PostgreSQL.query("SELECT * FROM events.fun_set_expired_events();", []).then(function(response){
      ////Log.debug(response);
    });
    PostgreSQL.query("SELECT * FROM gui.fun_remove_notifications_old();", []).then(function(response){
      ////Log.debug(response);
    });
    PostgreSQL.query("SELECT * FROM fun_last_modified_table_remove_olds();", []).then(function(response){
      ////Log.debug(response);
    });
    PostgreSQL.query("SELECT * FROM fun_remove_last_modified_cells();", []).then(function(response){
      ////Log.debug(response);
    });
    


// Esto debe dispararse solo al inicio de la aplicacion y cuando haya cambios en las tablas involucradas
PostgreSQL._schema_gui_properties_fromdb().then(function(r){
  //Log.debug(r);
});
}, 15*1000);


console.log('Server >> 5'); 

  var cnxSMTP = {host: process.env.SMPT_HOST, port: process.env.SMPT_PORT, ignoreTLS: process.env.SMPT_IGNORETLS, secure: process.env.SMPT_SECURE, auth: {user: process.env.SMPT_AUTH_USER, pass: process.env.SMPT_AUTH_PWD}};
  //Log.debug(cnxSMTP);
// create reusable transporter object using the default SMTP transport 
var transporter = nodeMailer.createTransport(cnxSMTP);

PostgreSQL.configuration_server.query({config_name: "mailOptions"}).forEach(function(config){

  config.configuration.html = '<b>Open Monitoring System</b><p>'+os.hostname()+'</p><p>'+os.platform()+'</p><p>Webserver Port: '+process.env.PORT+'</p><p>Total Mem: '+os.totalmem()+'</p>';

  transporter.sendMail(config.configuration, function(error, info){
    if(error){
      return //Log.debug(error);
    }
    //Log.debug('Message email sent: ' + info.response);
  });
});

console.log('Server 6');

var exp = new express({_pG: PostgreSQL});

console.log('Server 6a');

var webServer = https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  requestCert: false
}, exp.app);

var sio = socketIO.listen(webServer);

console.log('Server 7');

var pgEventTs = PostgreSQL.on('tschange', function(r){

  if(r.table_name == 'gui.column_properties' || r.table_name == 'gui.tables_view_properties'){
    PostgreSQL._schema_gui_properties_fromdb().then(function(rx){
    }); 
  }

  sio.emit('pgtschange', JSON.stringify(r));
});

var pgEventNotif = PostgreSQL.on('notifying_the_user', function(r){
  sio.emit('notifying_the_user', JSON.stringify(r));
});

console.log('Server 8');

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
// Add a connect listener
sio.on('connection', function(clientio){ 

  clientio.emit('connection', 'Welcome Open Monitoring System!');

//------------------------------------------
clientio.on('heartbeat',function(event){ 

  if(!exp.userHeartbeat(event.sid)){
    clientio.emit('command', {command: 'logout'});
    clientio.disconnect('unauthorized');
  }

});


//------------------------------------------
clientio.on('wsservice',function(message){ 

  var wsObj = JSON.parse(message);

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
  //Log.debug('Server has disconnected');
});

clientio.on('reconnect', function() {
  console.log('reconnect fired!');
});

});


exp.on('new_session', function(e){
  sio.emit('command', {command: 'heartbeat'});    
});




webServer.listen(process.env.PORT, function(){
  //Log.debug("Listening on " + process.env.PORT);
});




var pgEventError = PostgreSQL.on('pgError', function(error){
  //Log.debug(error);
});





process.on('uncaughtException', function(error){
  //Log.debug(error);
});


});







////////////////////////////////////////////////////////////
});