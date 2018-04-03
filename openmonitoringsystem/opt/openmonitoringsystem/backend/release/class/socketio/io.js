"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socketIO = require("socket.io");
var WebSocketIO = (function () {
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
        });
    };
    WebSocketIO.prototype.onService = function (client) {
        client.on('wsservice', function (message) {
        });
    };
    WebSocketIO.prototype.onLogin = function (client) {
        client.on('clogin', function (config) {
            var CommunicatorConfig = JSON.parse(config);
            var WSClient = this;
            console.log(CommunicatorConfig, WSClient.handshake);
        });
    };
    WebSocketIO.prototype.io = function () {
        return this.sio;
    };
    return WebSocketIO;
}());
exports.default = WebSocketIO;
