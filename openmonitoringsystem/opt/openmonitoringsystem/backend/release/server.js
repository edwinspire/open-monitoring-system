"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./class/server");
var MFS = require("./class/mount-js/lib/mountjs");
var fs = require("fs");
process.env.PGDATABASE = 'oms';
process.env.PGUSER = 'postgres';
process.env.PGHOST = 'localhost';
process.env.PGPASSWORD = 'pg4321';
process.env.PGAPPNAME = 'OMSServer';
process.env.EXPRESS_PORT = '49443';
var OMS = new server_1.default();
var m2 = new MFS.default();
m2.mount({ protocol: "smb", domain: "", location: "172.16.124.2/c$", anonymous: false, username: "Administrador", password: "1234567", timeout: 90 }).then(function (result) {
    try {
        fs.readdirSync(result.mount.location).forEach(function (file) {
            console.log(file);
        });
    }
    catch (err) {
        console.log("readdirSync 2=>", err);
    }
}, function (e) {
    console.log("mount2 =>", e);
});
OMS.run();
