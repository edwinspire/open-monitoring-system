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

    this.webServer.listen(47443, function () {
      console.log('Example app listening on port 49443!');
    });

  }
}































