"use strict";
exports.__esModule = true;
var server_1 = require("./class/server");
var MFS = require("./class/mount-js/lib/mountjs");
var fs = require("fs");
process.env.PGDATABASE = 'oms';
process.env.PGUSER = 'postgres';
process.env.PGHOST = 'localhost';
process.env.PGPASSWORD = 'pg4321';
process.env.PGAPPNAME = 'OMSServer';
process.env.EXPRESS_PORT = '49443';
var OMS = new server_1["default"]();
var m = new MFS["default"]();
m.mount({ protocol: "ftp", domain: "", location: "ftp.gnome.org/pub/GNOME/sources/", anonymous: true, username: "", password: "", timeout: 90 }).then(function (result) {
    console.log(result);
    fs.readdirSync(result.mount.location).forEach(function (file) {
        console.log(file);
    });
}, function (e) {
    console.log(e);
});
/*
let c = new CheckSum();
c.FromFile('MD5', '/home/edwinspire/Desarrollo/Node/open-monitoring-system/openmonitoringsystem/opt/openmonitoringsystem/old.tar.gz').then(function(r){
console.log(r);
});

c.FromFile('MD5', '/home/edwinspire/Desarrollo/Node/open-monitoring-system/openmonitoringsystem/opt/openmonitoringsystem/backend/src/class/checksum-js/lib/checksumjs.js').then(function(r){
console.log(r);
});
*/
OMS.run();
