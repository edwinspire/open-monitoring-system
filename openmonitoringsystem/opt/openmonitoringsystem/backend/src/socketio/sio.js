const crypto = require('crypto')
const socketio = require('socket.io')
const postgreSQL = require('./../postgresql/PostgreSQL.js');

module.exports = class sIO {

	constructor(server){
		this.io = socketio(server);

		this.pG = new postgreSQL();

		this.io.on('connection',  (socket)=> {
			this.pG.on('result', (d)=>{
				socket.emit('gps', d);
			});
			socket.emit('news', { hello: 'world' });
			this._sendDate(socket);
			this._gps(socket);
		});

	}

	_sendDate(socket){
		setInterval(()=>{
			socket.emit('hora', { hora: Date.now() });
		}, 5000);

	}

	_clients(){

		setInterval(()=>{
			var clients = this.io.sockets.clients();
			//console.log(clients);
		}, 36000);
	}

	_gps(socket){
		socket.on('gps', (data)=> {
			console.log('Recibe GPS ', data);
			let query = {
				name: 'save-gps',
				text: 'INSERT INTO public.gps(gps) VALUES ($1) RETURNING *',
				values: [JSON.stringify(data)]
			}

			this.pG.Query(query);

		});

	}

};