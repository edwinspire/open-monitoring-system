const EventEmitter = require('events');
const { Pool } = require('pg');
const crypto = require('crypto')
const Queue = require('./../queue/Queue.js');

module.exports = class PostgreSQL extends EventEmitter {

	constructor(){

		super();
		this.pool = new Pool({connectionString: process.env.DATABASE_URL});	
		this.pool.on('error', (err, client) => {
			console.error('Unexpected error on idle client', err)
		})

		this.Q = new Queue();

		setInterval(()=>{
			this._process()
		}, 5000);


	}

	_process(){

		this.Q.forEach(0, (v, k, m)=>{
//			this._Query(k, v);
});

	}

	teston(){
		this.emit('foo', {data: 125});		
		this.Q.set('hahahahahaha', {'hola': 'queue'});
		this.Q.set('kkkkkkkkk', {'chao': 'qeis'});
		this.Q.set('kkkkkkkkk', {'chao': 'qeis'});
		this.QueryWithParam('test', 'SELECT NOW()', []);
		this._process()
	}

	QueryWithParam(name, query, values){
		let q = {
			name: name||'QueryWithParam',
			text: query,
			values: values
		}
		return this.Query(q);
	}

	Query(query){
		return new Promise((resolve, reject) => {
			this.pool
			.connect()
			.then(client => {
				return client
				.query(query)
				.then(res => {
					client.release()
					//console.log(query, res)
					resolve(res);
				})
				.catch(e => {
					client.release()
					console.log(query, e)
					reject(e);
				})
			})
		});
	}

	async AccessPoint(path, req, res){

		var r;
		var datapost = req.body;
		var dataquery = req.query;
		var cookies = req.cookies;
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		console.log(req.cookies);
		var query = {
			name: path,
			text: `SELECT public.access_point($1::TEXT, $2::JSON, $3::inet, $4::JSON, $5::JSON)`,
			values: [path, JSON.stringify(cookies), ip, JSON.stringify(datapost), JSON.stringify(dataquery)]
		}
		const client = await this.pool.connect();
		try {
			const respg = await client.query(query);
			if(respg.rows.length > 0){
				r = respg.rows[0].access_point;
				if(r.data && r.data.token){
					res.cookie('TOKEN_USER', r.data.token, { maxAge: 900000, httpOnly: true });
				}
				res.status(r.status).json(r.data);
			}else{
				res.status(204).json([]);
			}
		}catch(e){
			console.error(e);
			res.status(500).json(e);
		} finally {
    // Make sure to release the client before any error handling,
    // just in case the error handling itself throws an error.
    client.release();
    return r;
}

}


QueryToResponse(response, query){
	this.Query(query).then((data)=>{
		response.status(200).json(data);
	}, (err)=>{
		response.status(500).json(err);
	});
}

QueryToResponseWithParams(response, name, query, values){
	var q = {
		name: name||'QueryToResponseWithParams',
		text: query,
		values: values
	}
	this.QueryToResponse(response, q);
}





/*
	Query(query){
		let r = -1;

		if(query){
			if(query.name && query.text && query.values){
				let hash = crypto.createHash('md5').update(JSON.stringify(query)).digest("hex");
				this.Q.set(hash, query);
				r = hash;
			}else{
				console.log('Parámetros incompletos')
			}
		}else{
			console.log('El query está vacío.');
		}	

		return r;
	}
	*/
/*
	_Query(hash, query){
		console.log(hash)
		this.pool
		.connect()
		.then(client => {
			return client
			.query(query)
			.then(res => {
				client.release()
				console.log(query, res)
				this.emit('result', {data: res, hash: hash});		
				this.Q.modify(hash, query, 2);
			})
			.catch(e => {
				client.release()
				console.log(query, e)
				this.emit('result', {error: e, hash: hash});		
				this.Q.modify(hash, query, 1);
			})
		})
	}
	*/

};