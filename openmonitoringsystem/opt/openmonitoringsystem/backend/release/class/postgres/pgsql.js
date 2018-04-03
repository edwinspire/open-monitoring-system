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
var pg_1 = require("pg");
var Promise_1 = require("@dojo/shim/Promise");
var events_1 = require("events");
var crypto = require("crypto");
var PostgreSQL = (function (_super) {
    __extends(PostgreSQL, _super);
    function PostgreSQL() {
        var _this = _super.call(this) || this;
        _this.APPConfig = new Map();
        _this.EventsMd5 = new Map();
        _this.poolPG = new pg_1.Pool({
            max: 30
        });
        _this.on('public.configuration_server.op', function (ev) {
            console.log('=>', ev);
            _this.get_config_from_db().then(function (config) {
                console.log('Configuration UPDATE: ', config);
            });
        });
        _this.get_config_from_db().then(function (config) {
            console.log('Configuration: ', config);
            _this.connect_notify(_this.APPConfig.get('PGNOTIFY'));
        });
        return _this;
    }
    PostgreSQL.prototype.query = function (q, p) {
        var _this = this;
        return new Promise_1.default(function (resolve, reject) {
            _this.poolPG.query(q, p)
                .then(function (res) {
                resolve(res);
            }).catch(function (e) { return setImmediate(function () {
                console.trace(e);
                reject(e);
            }); });
        });
    };
    PostgreSQL.prototype.connect_notify = function (channels) {
        var _this = this;
        this.poolPG.connect().then(function (client) {
            client.on('notification', function (n) {
                if (_this.EventsMd5.has(n.channel)) {
                    _this.emit(_this.EventsMd5.get(n.channel), n.payload);
                }
            });
            var ch = [];
            _this.EventsMd5.clear();
            _this.APPConfig.get("PGNOTIFY").forEach(function (c) {
                var emd5 = 'e' + crypto.createHash('md5').update(c).digest('hex');
                _this.EventsMd5.set(emd5, c);
                ch.push(emd5);
            });
            client.query('SELECT public.fun_listen_events($1) as e;', [ch]).then(function (res) {
                if (res.rows.length > 0) {
                    console.log('Event Listen: ' + res.rows[0].e);
                }
                else {
                    console.log('Algo sucedió incorrectamente');
                }
            }).catch(function (e) {
                client.reject();
                console.error('query error', e);
            });
        });
    };
    PostgreSQL.prototype.get_config_from_db = function () {
        var _this = this;
        var q = 'SELECT * FROM configuration_server WHERE enabled = true;';
        return new Promise_1.default(function (resolve, reject) {
            _this.poolPG.query(q, [])
                .then(function (res) {
                res.rows.forEach(function (config) {
                    switch (config.config_name) {
                        case "SMTP":
                            _this.APPConfig.set(config.config_name, config.configuration);
                            if (config.configuration.host) {
                                process.env.SMPT_HOST = config.configuration.host;
                            }
                            if (config.configuration.port) {
                                process.env.SMPT_PORT = config.configuration.port;
                            }
                            if (config.configuration.ignoreTLS) {
                                process.env.SMPT_IGNORETLS = config.configuration.ignoreTLS;
                            }
                            if (config.configuration.secure) {
                                process.env.SMPT_SECURE = config.configuration.secure;
                            }
                            if (config.configuration.auth.user) {
                                process.env.SMPT_AUTH_USER = config.configuration.auth.user;
                            }
                            if (config.configuration.auth.pass) {
                                process.env.SMPT_AUTH_PWD = config.configuration.auth.pass;
                            }
                            break;
                        case 'XMPP':
                            _this.APPConfig.set(config.config_name, config.configuration);
                            if (config.configuration.server) {
                                process.env.XMPP_SERVER = config.configuration.server;
                            }
                            if (config.configuration.username) {
                                process.env.XMPP_USERNAME = config.configuration.username;
                            }
                            if (config.configuration.pwd) {
                                process.env.XMPP_PASSWORD = config.configuration.pwd;
                            }
                            break;
                        case 'PGNOTIFY':
                            _this.APPConfig.set(config.config_name, Array.from(new Set(config.configuration)));
                            break;
                    }
                });
                resolve(_this.APPConfig);
            }).catch(function (e) { return setImmediate(function () {
                console.log(e);
                reject(e);
            }); });
        });
    };
    PostgreSQL.prototype.eventdata_insert = function (data) {
        return this.query("SELECT events.funjs_insert_data($1::json) as result", [data]);
    };
    return PostgreSQL;
}(events_1.EventEmitter));
exports.default = PostgreSQL;
