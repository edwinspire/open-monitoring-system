import WebServer from './express/express';
import WebSocketIO from './socketio/io';
import * as https from 'https';
import * as fs from 'fs';
import PgSQL from './postgres/pgsql';
import * as crypto from 'crypto';




export default class OpenMonitoringSystem {
  private webServer: any;
  private pg: any;
  constructor() {

    const Web = new WebServer('./');
    this.pg = new PgSQL();

    this.webServer = https.createServer({
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem'),
      requestCert: false
    }, Web.app());

    const sIO = new WebSocketIO(this.webServer);

  }

  heartbeat(id: number){

    setInterval(()=>{
      this.pg.internal_services({name: "event_add", id: id, timestamp: new Date(), datas: {description: "", ideventtype: 4}}).then((r)=>{
        console.log('ok', r);
      }, (e)=>{
        console.log('error', e);
      });
    }, 5000);

  }

  run(){


/*

var algorithm = 'aes128';
var inputEncoding = 'utf8';
var outputEncoding = 'base64';

var key = 'llave';
var text = 'a';

console.log('Ciphering "%s" with key "%s" using %s', text, key, algorithm);

var encrypt = crypto.createCipher(algorithm, key);
var encrypted = encrypt.update(text, inputEncoding, outputEncoding);
encrypted += encrypt.final(outputEncoding)

console.log('Result in %s is "%s"', outputEncoding, encrypted);
*/


setTimeout(()=>{
  console.log('Starting...');


  this.webServer.listen(process.env.EXPRESS_PORT,  ()=> {
    console.log('Example app listening on port: '+process.env.EXPRESS_PORT);


    this.heartbeat(2);

    this.pg.internal_services({name: "event_add", ideventtype: 1, id: 2, description: 'OMS ha iniciado', timestamp: new Date()}).then((r)=>{
      console.log('ok2', r);
    }, (e)=>{
      console.log('error2', e);
    });


  });
}, 5000);


}


}































