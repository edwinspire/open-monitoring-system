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

    const Web = new WebServer(__dirname+  '/../../../frontend/output/dist/');

    this.pg = new PgSQL();

    this.webServer = https.createServer({
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem'),
      requestCert: false
    }, Web.app());  

    const sIO = new WebSocketIO(this.webServer);


    Web.on('request_services', (service)=>{

      //console.log(JSON.stringify(service.req.body));
      console.log('request_services');
      let service_req = service.req.body;
      service_req.ip = service.req.headers['x-forwarded-for'] || service.req.connection.remoteAddress;
      service_req.useragent = service.req.get('User-Agent');
      service_req.token = "sddd";
      service_req.datas = [];

      this.pg.services(service_req).then((res)=>{

        console.log('request_services...', res);

        if(res.private){

          if(res.private.token && res.private.token.length > 0){
            service.res.cookie('OMSToken',res.private.token, { maxAge: 900000});
          }


          if(res.private.fullname && res.private.fullname.length > 0){
            service.res.cookie('OMSFullNameUser',res.private.fullname, { maxAge: 900000});
          }

        }

        

        if(res.error){
          service.res.status(400).json(res.public);
        }else{
          service.res.json(res.public);
        }

      }, (err)=>{
        //console.log(err);
        service.res.status(400).json(err);
      });

    });

  }

  heartbeat(id: number){

    setInterval(()=>{
      this.pg.internal_services({name: "event_add", id: id, datas: {description: "", ideventtype: 4}}).then((r)=>{
        console.log('ok', r);
      }, (e)=>{
        console.log('error', e);
      });
    }, 30000);

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

    this.pg.internal_services({name: "event_add", ideventtype: 1, id: 2, description: 'OMS ha iniciado'}).then((r)=>{
      console.log('ok2', r);
    }, (e)=>{
      console.log('error2', e);
    });


  });
}, 5000);


}


}































