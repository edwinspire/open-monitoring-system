const express = require('express');
const  https = require('https');
const  fs = require('fs');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const socketIO = require('socket.io');


var app = express();

var webServer = https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  requestCert: false
}, app);

var sio = socketIO.listen(webServer);

app.use(express.static(process.env.EXPRESS_STATIC_DIR));
app.use(cookieParser());
app.use(compression());
app.use(morgan('common'));
app.use( bodyParser.json() );      
app.use(bodyParser.urlencoded({    
  extended: true
})); 


app.use(function(req, res, next) {
  console.log(req.originalUrl);
  res.status(404).send('Sorry cant find that!'+' '+process.env.EXPRESS_STATIC_DIR+' - '+req.originalUrl);
});



webServer.listen(47443, function () {
  console.log('Example app listening on port 49443!');
});


// Add a connect listener
sio.on('connection', function(clientio){ 

  clientio.emit('connection', 'Welcome Open Monitoring System!');

  console.log('Welcome Open Monitoring System!');
  
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
























