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
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cookieParser = require("cookie-parser");
var compression = require("compression");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var Ev = require("events");
var WebServer = (function (_super) {
    __extends(WebServer, _super);
    function WebServer(static_dir) {
        if (static_dir === void 0) { static_dir = undefined; }
        var _this = _super.call(this) || this;
        _this.appexp = express();
        static_dir = static_dir || process.env.EXPRESS_STATIC_DIR;
        _this.appexp.use(express.static(static_dir));
        _this.appexp.use(cookieParser());
        _this.appexp.use(compression());
        _this.appexp.use(morgan('common'));
        _this.appexp.use(bodyParser.json());
        _this.appexp.use(bodyParser.urlencoded({
            extended: true
        }));
        _this.appexp.post('/services', function (req, res) {
            _this.emit('request_services', { req: req, res: res });
        });
        _this.appexp.use(function (req, res, next) {
            console.log(req.originalUrl);
            res.status(404).send('Sorry cant find that!' + ' ' + static_dir + ' - ' + req.originalUrl);
        });
        return _this;
    }
    WebServer.prototype.app = function () {
        return this.appexp;
    };
    WebServer.prototype.post = function (route, fun) {
        this.appexp.post(route, function (req, res) {
            fun(req, res);
        });
    };
    return WebServer;
}(Ev.EventEmitter));
exports.default = WebServer;
