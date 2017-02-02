 var dojo = require('dojo-node'); 


 dojo.require(["dojo/request",
    "dojo/on", 
    "dojo/_base/array", 
    "dojo/node!crypto",
    "dojo/node!http", 
    "dojo/node!socket.io", 
    "dojo/node!path", 
    "dojo/node!fs", 
    "dojo/node!url", 
    "dojo/node!cookie-parser", 
    "dojo/node!path-to-regexp", 
    "dojo/node!express", 
    "dojo/node!pg", 
    "dojo/node!compression", 
    "dojo/node!mssql", 
    "dojo/node!body-parser", 
    "dojo/node!nodemailer",
    "dojo/node!node-xmpp-client",
    "dojo/node!telegraf",
    "custom/postgres/oms", 
    "dojox/encoding/digests/MD5", 
    "custom/session_users/session_users", 
    "custom/postgres/udc_dgrid_structure", 
    "custom/postgres/oms_query_builder", 
    "custom/postgres/udc_table_accounts", 
    "custom/postgres/udc_table_phones", 
    "custom/postgres/udc_table_emails", 
    "custom/postgres/udc_table_account_contacts", 
    "custom/postgres/udc_table_account_users",
    "custom/postgres/udc_table_account_equipments",
    "custom/postgres/udc_farma_view_lista_precios",
    "custom/postgres/udc_tables_views",
    "custom/postgres/udc_tables_columns",
    "custom/postgres/udc_table_groups",
    "custom/postgres/udc_table_account_events_isopen",
    "custom/postgres/udc_table_events_isopen",
    "custom/postgres/udc_table_events",
    "custom/postgres/udc_account_events_comments"  
    ], function(request, on, array, crypto, http, sio, path, fs, url, cookieParser, pathToRegexp, express, pG, compression, mssql, bodyParser, nodeMailer, XmppClient, Telegraf, pgOMS, MD5, sessionusers){


        var pgParam = {user: 'postgres', pwd: 'pg4321', host: '192.168.251.174', db: 'oms'};
        var sessionUsers = new sessionusers();
        var PostgreSQL = new pgOMS(pgParam);


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
// Usuario a sido deslogueado

}, function(error){
//res.status(500).json(error);
});


});

/*
        const hash = crypto.createHash('sha256');

        hash.update('some data to hash');
        console.log(hash.digest('hex'));

        const hash2 = crypto.createHash('sha256');

        hash2.update('mellamoedwinspire');
        console.log(hash2.digest('base64'));

        const buf = Buffer.from('mellamoedwinspire', 'ascii');
        */

  /*        var cipher = crypto.createCipher('aes192', 'password')
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  console.log(crypted);

// Prints: 68656c6c6f20776f726c64
console.log(buf.toString('hex'));
*/



/*
process.env.BOT_TOKEN = "292733408:AAGPIZbNtpgEkW4bwmlgpLImPTZz1nLEBCY";
const appBot = new Telegraf(process.env.BOT_TOKEN)

appBot.command('start', (ctx) => ctx.reply('Bienvenid@!'))
appBot.hears('hi', (ctx) => ctx.reply('Hey there!'))
appBot.on('sticker', (ctx) => ctx.reply('👍'))


appBot.hears('hola', (ctx) => {
    var msg = ctx.message;
    msg.text = msg.text+' '+ctx.from.id;
    console.log(ctx, ctx.from, ctx.message.chat);
    ctx.telegram.sendCopy(ctx.from.id, ctx.message);

})

appBot.startPolling()
*/







process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var smtpConfig = {
    host: 'mail.farmaenlace.com',
    port: 465,
//ignoreTLS:false,
    secure: true, // use SSL 
    auth: {
        user: 'edwindelacruz',
        pass: '1715021828'
    }
};


// create reusable transporter object using the default SMTP transport 
var transporter = nodeMailer.createTransport(smtpConfig);

// setup e-mail data with unicode symbols 
var mailOptions = {
    from: '"Edwin De La Cruz 👥" <edwindelacruz@farmaenlace.com>', // sender address 
    to: 'edwinspire@gmail.com', // list of receivers 
    subject: 'Open Monitoring System Start ✔ '+Date.now(), // Subject line 
    text: 'Hello world 🐴', // plaintext body 
    html: '<b>Hello world 🐴</b>' // html body 
};

// send mail with defined transport object 
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});


var client = new XmppClient({
    jid: 'farmaoms@suchat.org',
    password: 'farmaspire',
    reconnect: true,
    credentials: true
})

client.on('online', function() {
    console.log('XMPP online');
    var stanza = new XmppClient.Stanza('message', {to: 'edwinspire@suchat.org', type: 'chat'})
    .c('body').t('Open Monitoring System - Se ha iniciado el servidor\n '+Date.now())
    client.send(stanza);

})

client.on('stanza', function(stanza) {
    console.log('XMPP Incoming: ', stanza.children[0].children);

})

client.on('chat', function(from, message) {
    xmpp.send(from, 'echo: ' + message);
});

client.on('error', function(err) {
    console.error(err);
});

/*
cl.on('stanza',
    function(stanza) {
        if (stanza.is('message') &&
            // Important: never reply to errors!
            stanza.attrs.type !== 'error') {
            console.log("New message");
            // Swap addresses...
            stanza.attrs.to = stanza.attrs.from;
            delete stanza.attrs.from;
            // and send back.
            cl.send(stanza);
        }
    });
    */





    var app = express();

app.use(express.static(process.env.EXPRESS_STATIC_DIR, {setHeaders: setFontHeaders}));

function setFontHeaders(res) {
  res.setHeader('Accept-Ranges', 'none');
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








//res.status(401).json({e: 'fsdfsdfsdfsdf'});

});


/* serves main page */
app.get("/test", function(req, res) {

    console.log(req.query);
    console.log(req.cookies);
    res.clearCookie('login_token');
    res.cookie('login_token', +new Date(), { maxAge: 3600000});


    var results = '--';
//************************//


////////////////////////////////////////////
mssql.connect("mssql://sa:sqlfarma@192.168.180.34/easygestionempresarial").then(function() {
    // Query 
    
    new mssql.Request().query('SELECT TOP (200) cfs_id, cfs_ultima_fecha, cfs_estado FROM  PV_ControlFechaServidor').then(function(recordset) {
        console.dir(recordset);
    }).catch(function(err) {
        // ... query error checks 
        console.log('Algo falla ', error);
    });

});


});







////////////////////////////////////////////////////////////////////////////////////////
app.post("/njs/db/table/*", function(req, res){

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

        res.send(JSON.stringify(PostgreSQL.get_table_structure(req.body.UdcTable, req.body.Fields), function(key, value){

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
  res.status(404).send('Sorry cant find that!');
});


//*******************************************************//
//*******************************************************//

//** Arranca el servidor **//
var port = process.env.PORT || 80;

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
}); 




var server = http.createServer(app)
, sio = sio.listen(server);


PostgreSQL.on('get_dgrid_structure', function(tv){
  console.log('Emite evento de postgres', tv);

});


var pgEventTs = PostgreSQL.on('tschange', function(r){
  //  console.log('Emite evento de postgres', r);
  sio.emit('pgtschange', JSON.stringify(r));

});

var pgEventNotif = PostgreSQL.on('notifying_the_user', function(r){
    //console.log('-- Envia notificacion de postgres', r);
    sio.emit('notifying_the_user', JSON.stringify(r));

    var stanza = new XmppClient.Stanza('message', {to: 'edwinspire@suchat.org', type: 'chat'})
    .c('body').t(r.title.replace('</br>', '\n')+'\n'+r.body.replace('</br>', '\n'));
    client.send(stanza);
});


sessionUsers.on('newsession', function(e){
    console.log(e);
    sio.emit('command', {command: 'heartbeat'});    
});


// Add a connect listener
sio.on('connection', function(client){ 

  //  var sid = '';

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

/*
var u = sessionUsers.datauser(sid);
if(u){

sessionUsers.remove(sid);

 PostgreSQL.logout(u).then(function(results){
// Usuario a sido deslogueado

 });
 
}
*/

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

// set = function(req, res) { res.cookie('login_token', +new Date(), { maxAge: 3600000, path: '/' }); res.redirect('/'); };





