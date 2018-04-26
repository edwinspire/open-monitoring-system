"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("./express/express");
var io_1 = require("./socketio/io");
var https = require("https");
var fs = require("fs");
var pgsql_1 = require("./postgres/pgsql");
var OpenMonitoringSystem = (function () {
    function OpenMonitoringSystem() {
        var Web = new express_1.default('./');
        this.pg = new pgsql_1.default();
        this.webServer = https.createServer({
            key: fs.readFileSync('key.pem'),
            cert: fs.readFileSync('cert.pem'),
            requestCert: false
        }, Web.app());
        var sIO = new io_1.default(this.webServer);
    }
    OpenMonitoringSystem.prototype.heartbeat = function (id) {
        var _this = this;
        setInterval(function () {
            _this.pg.internal_services({ name: "event_add", id: id, timestamp: new Date(), datas: { description: "", ideventtype: 4 } }).then(function (r) {
                console.log('ok', r);
            }, function (e) {
                console.log('error', e);
            });
        }, 5000);
    };
    OpenMonitoringSystem.prototype.run = function () {
        var _this = this;
        setTimeout(function () {
            console.log('Starting...');
            _this.webServer.listen(process.env.EXPRESS_PORT, function () {
                console.log('Example app listening on port: ' + process.env.EXPRESS_PORT);
                _this.heartbeat(2);
                _this.pg.internal_services({ name: "event_add", ideventtype: 1, id: 2, description: 'OMS ha iniciado', timestamp: new Date() }).then(function (r) {
                    console.log('ok2', r);
                }, function (e) {
                    console.log('error2', e);
                });
            });
        }, 5000);
    };
    return OpenMonitoringSystem;
}());
exports.default = OpenMonitoringSystem;
