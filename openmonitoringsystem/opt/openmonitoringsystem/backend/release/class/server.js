"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("./express/express");
var io_1 = require("./socketio/io");
var https = require("https");
var fs = require("fs");
var pgsql_1 = require("./postgres/pgsql");
var OpenMonitoringSystem = (function () {
    function OpenMonitoringSystem() {
        var _this = this;
        var Web = new express_1.default(__dirname + '/../../../frontend/output/dist/');
        this.pg = new pgsql_1.default();
        this.webServer = https.createServer({
            key: fs.readFileSync('key.pem'),
            cert: fs.readFileSync('cert.pem'),
            requestCert: false
        }, Web.app());
        var sIO = new io_1.default(this.webServer);
        Web.on('request_services', function (service) {
            console.log(JSON.stringify(service.req.body));
            console.log('request_services');
            var service_req = service.req.body;
            service_req.ip = service.req.headers['x-forwarded-for'] || service.req.connection.remoteAddress;
            service_req.useragent = service.req.get('User-Agent');
            service_req.token = "sddd";
            service_req.datas = [];
            _this.pg.services(service_req).then(function (res) {
                console.log('request_services...', res);
                if (res.private) {
                    if (res.private.token && res.private.token.length > 0) {
                        service.res.cookie('OMSToken', res.private.token, { maxAge: 900000 });
                    }
                    if (res.private.fullname && res.private.fullname.length > 0) {
                        service.res.cookie('OMSFullNameUser', res.private.fullname, { maxAge: 900000 });
                    }
                }
                if (res.error) {
                    service.res.status(400).json(res.public);
                }
                else {
                    service.res.json(res.public);
                }
            }, function (err) {
                service.res.status(400).json(err);
            });
        });
    }
    OpenMonitoringSystem.prototype.heartbeat = function (id) {
        var _this = this;
        setInterval(function () {
            _this.pg.internal_services({ name: "event_add", id: id, datas: { description: "", ideventtype: 4 } }).then(function (r) {
                console.log('ok', r);
            }, function (e) {
                console.log('error', e);
            });
        }, 30000);
    };
    OpenMonitoringSystem.prototype.run = function () {
        var _this = this;
        setTimeout(function () {
            console.log('Starting...');
            _this.webServer.listen(process.env.EXPRESS_PORT, function () {
                console.log('Example app listening on port: ' + process.env.EXPRESS_PORT);
                _this.heartbeat(2);
                _this.pg.internal_services({ name: "event_add", ideventtype: 1, id: 2, description: 'OMS ha iniciado' }).then(function (r) {
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
