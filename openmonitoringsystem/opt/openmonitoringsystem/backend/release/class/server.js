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
    OpenMonitoringSystem.prototype.run = function () {
        var _this = this;
        this.webServer.listen(process.env.EXPRESS_PORT, function () {
            console.log('Example app listening on port: ' + process.env.EXPRESS_PORT);
            _this.pg.eventdata_insert({ ideventtype: 10, idaccount: 1, description: 'OMS Iniciado en el puerto ' + process.env.EXPRESS_PORT, dateevent: new Date() }).then(function (r) {
                console.dir(r.rows);
            }, function (e) {
                console.dir(e);
            });
        });
    };
    return OpenMonitoringSystem;
}());
exports.default = OpenMonitoringSystem;
