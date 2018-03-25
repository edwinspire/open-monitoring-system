import * as socketIO from 'socket.io';
import * as EventEmitter from 'events';


export default class WebSocketIO {
  private sio: any;
  constructor(httpsServer: any) {

    this.sio = socketIO.listen(httpsServer);
    this.sio.on('connection', (clientio)=>{ 

      clientio.emit('connection', 'Welcome Open Monitoring System!');

      console.log('Welcome Open Monitoring System!');

      this.onHeartbeat(clientio);
      this.onService(clientio);
      this.onLogin(clientio);
      this.onReconnect(clientio);
      this.onDisconnect(clientio);


    });



  }

  private onDisconnect(client: any){
    client.on('disconnect', function() {
      console.log('reconnect fired!');
    });
  }

  private onReconnect(client: any){
    client.on('reconnect', function() {
      console.log('reconnect fired!');
    });
  }

  private onHeartbeat(client: any){
    client.on('heartbeat',function(event){ 

/*
  if(!exp.userHeartbeat(event.sid)){
    clientio.emit('command', {command: 'logout'});
    clientio.disconnect('unauthorized');
  }
  */

});
  }

  private onService(client: any){
    client.on('wsservice',function(message){ 

/*
  var wsObj = JSON.parse(message);

  if(PostgreSQL.textToMD5(clientio.id) == wsObj.token){

    PostgreSQL.service_ws(clientio, wsObj);

  }else{
    console.log("Ha expirado");
    clientio.emit('token_expired');
  }
  */

}); 
  }

  private onLogin(client: any){
  //------------------------------------------
  client.on('clogin',function(config){ 

    var CommunicatorConfig = JSON.parse(config);
    var WSClient = this;

    console.log(CommunicatorConfig, WSClient.handshake);
/*
  PostgreSQL.query("SELECT services.fun_login($1::bigint, $2::text, $3::inet);", [CommunicatorConfig.Id, CommunicatorConfig.Pwd, WSClient.handshake.address.address]).then(function(results){
    if(results.rowCount == 1){
      WSClient.emit('clogged', PostgreSQL.textToMD5(WSClient.id));
    }else{
      WSClient.disconnect('unauthorized');
    }

  }, function(error){
    WSClient.emit('clogged', error);
    WSClient.disconnect('unauthorized');
  });
  */

});

}

io(){
  return this.sio;
}

}



