import WebServer from './express/express';
import WebSocketIO from './socketio/io';
import * as https from 'https';
import * as fs from 'fs';
import PgSQL from './postgres/pgsql';




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
  run(){


    this.webServer.listen(process.env.EXPRESS_PORT,  ()=> {
      console.log('Example app listening on port: '+process.env.EXPRESS_PORT);

   this.pg.eventdata_insert({ideventtype: 10, idaccount: 1, description: 'OMS Iniciado en el puerto '+process.env.EXPRESS_PORT, dateevent: new Date()}).then((r)=>{
      console.dir(r.rows);
    }, (e)=>{
      console.dir(e);
    });

    });

  }
}































