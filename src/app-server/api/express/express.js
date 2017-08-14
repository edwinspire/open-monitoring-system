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
  "dojo/Evented"
  ], function(declare, expressjs, cookieParser, compression, bodyParser, passport, passportLocal, expressSession, morgan, Memory, Evented){
    return declare(null, {

      app: null,
      pG: null,
      storeSessions: new Memory(),

      constructor: function(args){
        declare.safeMixin(this,args);
        var t = this;
        t.storeSessions = new Memory();

        t.app = expressjs();
        
        t.app.use(expressSession({
          secret: 'openmonitoringsystem@oms',
          resave: false,
          saveUninitialized: false
        }));

        t.app.use(expressjs.static(process.env.EXPRESS_STATIC_DIR));
        t.app.use(passport.initialize());
        t.app.use(passport.session());
        t.app.use(cookieParser());
        t.app.use(compression());
        t.app.use(morgan('common'));
        t.app.use( bodyParser.json() );      
        t.app.use(bodyParser.urlencoded({    
          extended: true
        })); 


        function _Login(req, res, next){

          t.pG.login(req.body.user, req.body.pwd, req.connection.remoteAddress, req.headers['user-agent']).then(function(results){

            var r =  results.rows;
            if(r.length > 0 && r[0]['fun_login_system']){

              var u = r[0]['fun_login_system'];
              next();

    }else{
     res.redirect("/logout");
    }

  }, function(error){
    res.redirect("/logout");
  });
        }

        var Strategy = passportLocal.Strategy;

        passport.use(new Strategy({usernameField: 'user',
          passwordField: 'pwd', passReqToCallback: true},
          function(req, username, password, done) {

            t.pG.login(username, password, req.connection.remoteAddress, req.headers['user-agent']).then(function(results){

              var r =  results.rows;
              if(r.length > 0 && r[0]['fun_login_system']){

                var u = r[0]['fun_login_system'];

                return done(null, u, {message:'Login OK'});

              }else{
                return done(null, false, {message:'Unable to login'});   
              }

            }, function(error){
              return done(null, false, {message:'Unable to login'});
            });

          }));


        passport.serializeUser((user, done)=>{
          //console.debug("serialize ", user);
          done(null, user);
        });

        passport.deserializeUser((id, done)=>{
          console.debug("deserialize ");
          //console.dir(id);
          done(null, id);
        });

/*
////////////////////////////////////////////////////////////////////////////////////////
t.app.post("/login", passport.authenticate('local', {failureRedirect: '/'}), function(req, res){

  req.session.save(() => {
    res.json({success: true});
  })

});
*/

////////////////////////////////////////////////////////////////////////////////////////
t.app.post("/login", _Login, function(req, res){

  res.json({success: true});

});

////////////////////////////////////////////////////////////////////////////////////////
t.app.get('/logout', function(req, res){
  req.logout();
  req.session.destroy();

  cookie = req.cookies;
  for (var prop in cookie) {
    if (!cookie.hasOwnProperty(prop)) {
      continue;
    }    
    res.cookie(prop, '', {expires: new Date(0)});
  }

  req.session = null; 

  res.redirect('/');
});


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

          t.pG.query(q, p).then(function(response){
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
t.app.post("/njs/db/table/*",  function(req, res){

  if(true){

    var table = req.path.replace("/njs/db/table/", "");
    switch(table){
      case "account_events_comments":
      t.pG.udc_account_events_comments(req, res);
      break;        
      case "events":
      t.pG.udc_table_events(req, res, u);
      break;
      case "account_events_isopen":
      t.pG.udc_table_account_events_isopen(req, res);
      break;
      case "view_events_isopen":
      t.pG.udc_table_events_isopen(req, res);
      break;        
      case "view_events_details":
      t.pG.udc_table_events_details(req, res);
      break; 
      case "groups":
      t.pG.udc_table_groups(req, res);
      break;
      case "udc_columns":
      t.pG.udc_tables_columns(req, res);
      break;
      case "udc_tables_views":
      t.pG.udc_tables_views(req, res);
      break;
      case "farma_view_lista_precios":
      t.pG.udc_farma_view_lista_precios(req, res);
      break;
      case "account_equipments":
      t.pG.udc_table_account_equipments(req, res);
      break;
      case "account_users":
      t.pG.udc_table_account_users(req, res);
      break;
      case "account_contacts":
      t.pG.udc_table_account_contacts(req, res);
      break;
      case "emails":
      t.pG.udc_table_emails(req, res);
      break;
      case "phones":
      t.pG.udc_table_phones(req, res);
      break;
      case "accounts":
      t.pG.udc_table_accounts(req, res);
      break;
      default:
      res.status(404).json({table: table});
      break;
    }

  }

});



////////////////////////////////////////////////////////////////////////////////////////
t.app.post("/receiver",  function(req, res){
// TODO Implementar un mecaniso de seguridad para impedir ingreso de eventos por algun hacker
t.pG.receiver_event(req, res);
});





/*
t.app.get("/njs/logout", function(req, res){

  var sid = req.cookies['oms_sessionidclient'];
  
  if(true){



    t.pG.logout('').then(function(results){
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
*/


////////////////////////////////////////////////////////////////////////////////////////
t.app.post("/db/*", function(req, res){

  if(true){
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

      if(t.pG[obj]){
        t.pG[obj](req, res, params);
      }else{
        res.status(404).json({path: req.path});
      }

    }else{
      res.status(500).json({path: req.path, error: 'No tiene los argumentos completos'});
    }

  }else{
    res.status(403).json({table: req.path});
  }

});

////////////////////////////////////////////////////////////////////////////////////////
t.app.post("/service/*",  function(req, res){


  var parts = req.path.split("/");

  if(parts.length >= 8){

    var params = {service: parts[2], objectdb: parts[3], action: parts[4]};

    switch(params.service){
      case "objects":

      switch(params.objectdb){
        case "view_equipment_config":
        t.pG.service_objects_view_equipment_config(req, res, params);
        break;
        default:
        console.log('No existe 1', req.path);
        res.status(404).json({path: req.path});
        break;
      }
      break;

      case "events":

      switch(params.objectdb){
        case "receiver":
        //params.file_name = parts[8];
        t.pG.service_events_receiver(req, res, params);
        break;
        default:
        console.log('No existe 2', req.path, params);
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
  //Log.error(err.stack);
  console.log(err.stack);
  res.status(500).send('Something broke!');
}); 




},

isAuthenticated_by_req: function(req,res,next){
  if(true){
        //if user is looged in, true will return true 
        next();
      } else{
        res.redirect("/");
      }
    },
    isAuthenticated_by_sid: function(sid){
      if(true){
        //if user is looged in, true will return true 
        //next();
      } else{
    //    res.redirect("/");
  }
  return true;
},






});
});