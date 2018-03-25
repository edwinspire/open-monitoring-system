"use strict";
exports.__esModule = true;
var express = require("express");
var cookieParser = require("cookie-parser");
var compression = require("compression");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var WebServer = /** @class */ (function () {
    function WebServer(static_dir) {
        if (static_dir === void 0) { static_dir = undefined; }
        this.appexp = express();
        static_dir = static_dir || process.env.EXPRESS_STATIC_DIR;
        this.appexp.use(express.static(static_dir));
        this.appexp.use(cookieParser());
        this.appexp.use(compression());
        this.appexp.use(morgan('common'));
        this.appexp.use(bodyParser.json());
        this.appexp.use(bodyParser.urlencoded({
            extended: true
        }));
        this.appexp.use(function (req, res, next) {
            console.log(req.originalUrl);
            res.status(404).send('Sorry cant find that!' + ' ' + static_dir + ' - ' + req.originalUrl);
        });
    }
    WebServer.prototype.app = function () {
        return this.appexp;
    };
    return WebServer;
}());
exports["default"] = WebServer;
