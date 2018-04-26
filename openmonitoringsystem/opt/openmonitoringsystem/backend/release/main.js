"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./class/server");
var fs = require("fs");
var MFS = require("mount-js");
var readline = require("readline");
process.env.PGDATABASE = 'oms';
process.env.PGUSER = 'postgres';
process.env.PGHOST = 'localhost';
process.env.PGPASSWORD = 'pg4321';
process.env.PGAPPNAME = 'OMSServer';
process.env.EXPRESS_PORT = '49443';
var OMS = new server_1.default();
var m2 = new MFS.default();
m2.mount({ protocol: "smb", domain: "", location: "192.168.236.247/d$/FarmaciasDiaPromo/Oficinas.csv", anonymous: false, username: "Administrador", password: "1234567", timeout: 90 }).then(function (result) {
    try {
        console.log(result.mount.location);
        fs.access(result.mount.location, fs.constants.R_OK | fs.constants.W_OK, function (err) {
            console.log(err ? 'no access!' : 'can read/write');
            if (!err) {
                var lineReader = readline.createInterface({
                    input: fs.createReadStream(result.mount.location)
                });
                if (lineReader) {
                    lineReader.on('line', function (line) {
                        var datos = line.split('|');
                        var MatrizDatos = [];
                        try {
                            if (datos.length === 3 && datos[0].trim().length > 0) {
                                MatrizDatos.push(datos[0].trim());
                                MatrizDatos.push(new Date(datos[1].trim()));
                                MatrizDatos.push(new Date(datos[2].trim()));
                            }
                            if (MatrizDatos.length > 0) {
                                console.log(MatrizDatos);
                            }
                        }
                        catch (err) {
                            console.log(err);
                        }
                    });
                }
            }
        });
    }
    catch (err) {
        console.log("readdirSync 2=>", err);
    }
}, function (e) {
    console.log("mount2 =>", e);
});
OMS.run();
