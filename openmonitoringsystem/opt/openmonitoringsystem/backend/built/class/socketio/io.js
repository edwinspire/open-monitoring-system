"use strict";
exports.__esModule = true;
var socketIO = require("socket.io");
var WebSocketIO = /** @class */ (function () {
    function WebSocketIO(httpsServer) {
        var _this = this;
        this.sio = socketIO.listen(httpsServer);
        this.sio.on('connection', function (clientio) {
            clientio.emit('connection', 'Welcome Open Monitoring System!');
            console.log('Welcome Open Monitoring System!');
            _this.onHeartbeat(clientio);
            _this.onService(clientio);
            _this.onLogin(clientio);
            _this.onReconnect(clientio);
            _this.onDisconnect(clientio);
        });
    }
    WebSocketIO.prototype.onDisconnect = function (client) {
        client.on('disconnect', function () {
            console.log('reconnect fired!');
        });
    };
    WebSocketIO.prototype.onReconnect = function (client) {
        client.on('reconnect', function () {
            console.log('reconnect fired!');
        });
    };
    WebSocketIO.prototype.onHeartbeat = function (client) {
        client.on('heartbeat', function (event) {
            /*
              if(!exp.userHeartbeat(event.sid)){
                clientio.emit('command', {command: 'logout'});
                clientio.disconnect('unauthorized');
              }
              */
        });
    };
    WebSocketIO.prototype.onService = function (client) {
        client.on('wsservice', function (message) {
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
    };
    WebSocketIO.prototype.onLogin = function (client) {
        //------------------------------------------
        client.on('clogin', function (config) {
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
    };
    WebSocketIO.prototype.io = function () {
        return this.sio;
    };
    return WebSocketIO;
}());
exports["default"] = WebSocketIO;
