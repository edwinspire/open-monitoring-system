"use strict";
const sio = require('socket.io')();
const dojo = require('@dojo/core');
const mp = require('@dojo/core/MultiMap');
const {Pool} = require('pg');
const EventEmitter = require('events');
const sql3 = require('sqlite3').verbose();


var pg = new Pool({user: 'postgres', host: 'localhost', database: 'broker', password: 'pg4321'});

class dms extends EventEmitter {


  query(sqlquery, param){

    let prom = new Promise((resolve, reject)=>{

      pg.connect().then(client=>{
        return client.
        query(sqlquery, param)
        .then(res=>{
          client.release();
          resolve(res);
        })
        .catch(err =>{
          client.release();
          console.log(err.stack);
          reject(err.stack);
        })
      });

    });

    return prom;
  }

  server (channels){  

    var t = this;

    console.log('*******************');
    console.log('**** BROKER-IO ****');
    console.log('*******************');
    console.log('Starting server: ', dojo.DateObject.now().toString());

    var testMP = new mp.default();
    testMP.set('sdsad', {hola: 0, chao: 1});
    console.log(testMP.get('sdsad'));
    console.log(testMP.size);



    testMP.set('sdsad', {hola: 99, chao: 10000});
    console.log(testMP.get('sdsad'));
    console.log(testMP.size);


    testMP.set({holax: 1000}, {hola: 1212, chao: 2323});
    console.log(testMP.get({chaha: 10}));
    console.log(testMP.size);


    testMP.set({holay: 10}, {ca: 12120000, sa: 23230000});
    console.log(testMP.get('sdsad'));
    console.log(testMP.get({chaha: 10}));
    console.log(testMP.size);


    var db = new sql3.Database(':memory:');

    db.serialize(function() {
      db.run("CREATE TABLE lorem (info TEXT)");

      var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
      for (var i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
      }
      stmt.finalize();

      db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
        console.log(row.id + ": " + row.info);
      });
    });


    t.query('SELECT public.fun_server() as server;', []).then(res=>{

      if(res.rows.length > 0 && res.rows[0].server){
        res.rows[0].server.forEach(ch=>{
          t._addChannel(ch);
        });
      }

    }, err=>{
      console.log(err);
    });

    sio.on('connection', function(socket){
      console.log("Conectado Inicial");
    });

    sio.listen(3000);
  }

  _login (nsp, socket){
    socket.emit('connected', true);
    return true;
  }

  _addChannel(channel){

// /empresa/sucursal/

    var t = this;

    if(channel.events && channel.events.length > 0){
      channel.events.forEach(ev=>{
//console.log(ev);
    let ch = channel.channel+'/'+channel.partition;
    console.log('Add Channel: '+ch);

        let nsp = sio.of(ch).on('connection', (socket)=>{
          if(t._login(nsp, socket)){
            console.log('Channel: '+ch+' > Event: '+ev.name);
            socket.on(ev.name, (rec)=>{
              console.log('Recibe evento: '+ev.name, rec);
            });

            setInterval(()=>{
              socket.emit(ev.name, dojo.DateObject.now().toString());
            }, 1000);

          }else{
        // deberia enviar alguna señal para que se desconecte
      }

    });

      });
    }

    //console.log('Agregado canal '+ch); // Aqui deberiamos agregar a un log que se ha agregado un canal
  }

}

module.exports = dms;