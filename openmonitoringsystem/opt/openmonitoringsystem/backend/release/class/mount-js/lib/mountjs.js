"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var execFile = require('child_process').execFile;
var spawn = require('child_process').spawn;
var Promise_1 = require("@dojo/shim/Promise");
var MountFS = (function () {
    function MountFS(param) {
        if (param) {
            this.param = param;
        }
    }
    Object.defineProperty(MountFS.prototype, "mounted", {
        get: function () {
            return this._mounted;
        },
        enumerable: true,
        configurable: true
    });
    MountFS.prototype.mount = function (_param) {
        var _this = this;
        if (_param) {
            this.param = _param;
        }
        return new Promise_1.default(function (resolve, reject) {
            if (_this.param) {
                var args = [];
                args.push(_this.param.protocol);
                args.push(_this.param.domain);
                args.push(_this.param.location);
                args.push(_this.param.anonymous);
                args.push(_this.param.username);
                args.push(_this.param.password);
                args.push(_this.param.timeout);
                var child = execFile(__dirname + '/bin/mountjs-cli', args, function (error, stdout, stderr) {
                    if (error) {
                        reject(error);
                    }
                    else {
                        var r = JSON.parse(stdout.toString());
                        if (r.error) {
                            reject(r);
                        }
                        else {
                            _this._mounted = r;
                            resolve(r);
                        }
                    }
                });
            }
            else {
                reject({ error: 1, message: 'No parameter' });
            }
        });
    };
    return MountFS;
}());
exports.default = MountFS;
