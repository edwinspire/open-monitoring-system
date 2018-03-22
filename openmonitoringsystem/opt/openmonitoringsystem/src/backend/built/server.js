"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var express = require("express");
var https = require("https");
var fs = require("fs");
var cookieParser = require("cookie-parser");
var compression = require("compression");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var socketIO = require("socket.io");
var EventEmitter = require("events");
var test_1 = require("./class/test");
var c = require('./class/config');
var MyEmitter = /** @class */ (function (_super) {
    __extends(MyEmitter, _super);
    function MyEmitter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MyEmitter;
}(EventEmitter));
var myEmitter = new MyEmitter();
myEmitter.on('event', function () {
    console.log('an event occurred!');
});
myEmitter.emit('event');
var myValidator = new test_1["default"]();
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(function (req, res, next) {
    console.log(req.originalUrl);
    res.status(404).send('Sorry cant find that!' + ' ' + process.env.EXPRESS_STATIC_DIR + ' - ' + req.originalUrl);
});
webServer.listen(47443, function () {
    console.log('Example app listening on port 49443!');
});
// Add a connect listener
sio.on('connection', function (clientio) {
    clientio.emit('connection', 'Welcome Open Monitoring System!');
    console.log('Welcome Open Monitoring System!');
    //------------------------------------------
    clientio.on('heartbeat', function (event) {
        /*
          if(!exp.userHeartbeat(event.sid)){
            clientio.emit('command', {command: 'logout'});
            clientio.disconnect('unauthorized');
          }
          */
    });
    //------------------------------------------
    clientio.on('wsservice', function (message) {
        /*
          var wsObj = JSON.parse(message);
        
          if(PostgreSQL.textToMD5(clientio.id) == wsObj.token){
        
            PostgreSQL.service_ws(clientio, wsObj);
        
          }else{
            console.log("Ha expirado");
            clientio.emit('token_expired');
          }
          */
    });
    //------------------------------------------
    clientio.on('clogin', function (config) {
        var CommunicatorConfig = JSON.parse(config);
        var WSClient = this;
        console.log(CommunicatorConfig, WSClient.handshake);
        /*
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
        */
    });
    clientio.on('disconnect', function () {
        //Log.debug('Server has disconnected');
    });
    clientio.on('reconnect', function () {
        console.log('reconnect fired!');
    });
});
