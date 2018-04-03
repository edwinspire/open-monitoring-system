"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var execFile = require('child_process').execFile;
var spawn = require('child_process').spawn;
var Promise_1 = require("@dojo/shim/Promise");
var CheckSum = (function () {
    function CheckSum() {
        console.log('Se ha construido');
    }
    CheckSum.prototype.FromFile = function (ChecksumType, file) {
        var _this = this;
        return new Promise_1.default(function (resolve, reject) {
            var t = _this;
            var args = [];
            args.push(ChecksumType);
            args.push('file');
            args.push(file);
            var child = spawn(__dirname + '/bin/checksumjs-cli', args);
            child.on('error', function (error) {
                console.log(error);
                reject(error);
            });
            child.on('message', function (message) {
                console.log("child process message due to receipt of message " + message);
                resolve(message);
            });
            child.stdout.on('data', function (message) {
                var m = JSON.parse(message.toString());
                resolve(m);
            });
            child.stderr.on('data', function (data) {
                console.log(data);
                reject(data);
            });
        });
    };
    return CheckSum;
}());
exports.default = CheckSum;
