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
  "api/xmpp",
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
  ], function(express, on, array, os, cluster, crypto, socketIO, path, fs, LogSystem, https, url, pG, nodeMailer, pgOMS, MD5, Config, xmpp){


    //var Log = new LogSystem('debug', fs.createWriteStream('Log_oms'+(new Date()).toLocaleDateString()+'.log'));
    //Log.debug("Inicia Open Monitoring System WebApp");





    console.log('Server 1'); 
    

    const numCPUs = os.cpus().length;

    var PostgreSQL = new pgOMS({user: process.env.PG_USER, pwd: process.env.PG_PWD, host: process.env.PG_HOST, db: process.env.PG_DB});
    PostgreSQL.start().then((result)=>{

      console.log(result);

      var xmppOMS = new xmpp(process.env.XMPP_SERVER, process.env.XMPP_USERNAME, process.env.XMPP_PASSWORD);
      xmppOMS.send('edwinspire@suchat.org', os.hostname());
      xmppOMS.send('edwinspire@suchat.org', os.platform());
      xmppOMS.send('edwinspire@suchat.org', os.totalmem());
      xmppOMS.send('edwinspire@suchat.org', process.env.PORT);


      var cnxSMTP = {host: process.env.SMPT_HOST, port: process.env.SMPT_PORT, ignoreTLS: process.env.SMPT_IGNORETLS, secure: process.env.SMPT_SECURE, auth: {user: process.env.SMPT_AUTH_USER, pass: process.env.SMPT_AUTH_PWD}};
      var transporter = nodeMailer.createTransport(cnxSMTP);

      PostgreSQL.configuration_server.query({config_name: "mailOptions"}).forEach(function(config){

        config.configuration.html = '<b>Open Monitoring System</b><p>'+os.hostname()+'</p><p>'+os.platform()+'</p><p>Webserver Port: '+process.env.PORT+'</p><p>Total Mem: '+os.totalmem()+'</p>';

        transporter.sendMail(config.configuration, function(error, info){
          if(error){
            console.log(error);
      return //Log.debug(error);
    }
    
  });
      });




      var exp = new express({_pG: PostgreSQL});

      console.log('Server 6a');

      var webServer = https.createServer({
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem'),
        requestCert: false
      }, exp.app);

      var sio = socketIO.listen(webServer);

      webServer.listen(process.env.PORT, function(){
        console.log('HTTP Server on PORT '+process.env.PORT);
      });


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























}, (error)=>{
  console.log(error);
});












    process.on('uncaughtException', function(error){
  //Log.debug(error);
});








////////////////////////////////////////////////////////////
});