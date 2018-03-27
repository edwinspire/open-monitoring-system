"use strict";
exports.__esModule = true;
var express_1 = require("./express/express");
var io_1 = require("./socketio/io");
var https = require("https");
var fs = require("fs");
var pgsql_1 = require("./postgres/pgsql");
var OpenMonitoringSystem = /** @class */ (function () {
    function OpenMonitoringSystem() {
        var Web = new express_1["default"]('./');
        this.pg = new pgsql_1["default"]();
        this.webServer = https.createServer({
            key: fs.readFileSync('key.pem'),
            cert: fs.readFileSync('cert.pem'),
            requestCert: false
        }, Web.app());
        var sIO = new io_1["default"](this.webServer);
    }
    OpenMonitoringSystem.prototype.run = function () {
        this.webServer.listen(process.env.EXPRESS_PORT, function () {
            console.log('Example app listening on port: ' + process.env.EXPRESS_PORT);
        });
    };
    return OpenMonitoringSystem;
}());
exports["default"] = OpenMonitoringSystem;
