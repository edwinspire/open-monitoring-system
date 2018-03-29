"use strict";
exports.__esModule = true;
var execFile = require('child_process').execFile;
var spawn = require('child_process').spawn;
var Promise_1 = require("@dojo/shim/Promise");
var MountFS = /** @class */ (function () {
    function MountFS(param) {
        if (param) {
            this.param = param;
        }
        console.log('Se ha construido');
    }
    MountFS.prototype.mount = function (_param) {
        var _this = this;
        return new Promise_1["default"](function (resolve, reject) {
            var args = [];
            if (_param) {
                _this.param = _param;
            }
            args.push(_this.param.protocol);
            args.push(_this.param.domain);
            args.push(_this.param.location);
            args.push(_this.param.anonymous);
            args.push(_this.param.username);
            args.push(_this.param.password);
            args.push(_this.param.timeout);
            var child = execFile(__dirname + '/bin/mountjs-cli', args, function (error, stdout, stderr) {
                // console.log(error, stdout, stderr);
                if (error) {
                    reject(error);
                }
                else {
                    var r = JSON.parse(stdout.toString());
                    if (r.error) {
                        reject(r);
                    }
                    else {
                        resolve(r);
                    }
                }
            });
        });
    };
    return MountFS;
}());
exports["default"] = MountFS;
