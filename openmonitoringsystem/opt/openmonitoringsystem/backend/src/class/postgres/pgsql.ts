import  {Pool} from 'pg';
import * as mssql from 'mssql';
import * as dojo from "@dojo/core";
import Promise from "@dojo/shim/Promise";
import {EventEmitter} from "events";
import * as crypto from "crypto";

export interface EventData {
	iddata: string;
	idaccount: number; // Campo para particionar
	_foot_print_: number;
	dateevent: Date; // Campo para particionar en años, meses
	idstatustype: number;
	priority: number;
	ideventtype: number; // 
	source: string;
	iddevice: number;
	idreceptionmode: number;
	description: string;
	details: object;
	ip: string;
	idadmin_assigned: number;
	creator: number;
	isopen: boolean;
}

export default class PostgreSQL extends  EventEmitter{
	private poolPG: any;
	private APPConfig: Map<string, any> = new Map();
	private EventsMd5: Map<string, any> = new Map();
	constructor() {
		super();
		this.poolPG = new Pool({
			max: 30
		});

		this.on('public.configuration_server.op', (ev)=>{
			console.log('=>', ev);
			this.get_config_from_db().then((config)=>{
				console.log('Configuration UPDATE: ', config);
				//this.removeAllListeners('public.configuration_server.op');
				//this.connect_notify(this.APPConfig.get('PGNOTIFY'));
			});
		});

		this.get_config_from_db().then((config)=>{
			console.log('Configuration: ', config);
			this.connect_notify(this.APPConfig.get('PGNOTIFY'));
		});

	}

	query(q: string, p: Array<any>){
		return new Promise((resolve, reject) => {
			this.poolPG.query(q, p)
			.then((res) => {
				resolve(res);
			}).catch(e => setImmediate(() => {
				console.trace(e);
				reject(e);
			}))
		})	
	}

	private connect_notify(channels: Array<string>){

		//this.removeAllListeners('notification');
		// TODO:
		// Recordar que hay que desconectar todos los conectados a este evento cuando haya una modificacion en la tabla de configuraciones

		this.poolPG.connect().then(client => {
			client.on('notification', (n)=>{
				//console.log(n);
				if(this.EventsMd5.has(n.channel)){
					this.emit(this.EventsMd5.get(n.channel), n.payload);
				}
			})

			let ch = [];
			this.EventsMd5.clear();
			this.APPConfig.get("PGNOTIFY").forEach((c)=>{
				let emd5 = 'e'+crypto.createHash('md5').update(c).digest('hex');
				this.EventsMd5.set(emd5, c);
				ch.push(emd5);
			});

			client.query('SELECT public.fun_listen_events($1) as e;', [ch]).then(res => {

				if(res.rows.length > 0){
					console.log('Event Listen: '+res.rows[0].e);
				}else{
					console.log('Algo sucedió incorrectamente');
				}

			}).catch(e => {
				client.reject()
				console.error('query error', e)
			})
		})

	}


	private get_config_from_db(){	

		let q = 'SELECT * FROM configuration_server WHERE enabled = true;';

		return new Promise((resolve, reject) => {
			this.poolPG.query(q, [])
			.then((res) => {

				res.rows.forEach((config)=>{
					switch(config.config_name){
						case "SMTP":

						this.APPConfig.set(config.config_name, config.configuration);

						if(config.configuration.host){
							process.env.SMPT_HOST = config.configuration.host;
						}

						if(config.configuration.port){
							process.env.SMPT_PORT = config.configuration.port;
						}

						if(config.configuration.ignoreTLS){
							process.env.SMPT_IGNORETLS = config.configuration.ignoreTLS;
						}

						if(config.configuration.secure){
							process.env.SMPT_SECURE = config.configuration.secure;
						}

						if(config.configuration.auth.user){
							process.env.SMPT_AUTH_USER = config.configuration.auth.user;
						}

						if(config.configuration.auth.pass){
							process.env.SMPT_AUTH_PWD = config.configuration.auth.pass;
						}

						break;
						case 'XMPP':
						this.APPConfig.set(config.config_name, config.configuration);
						if(config.configuration.server){
							process.env.XMPP_SERVER = config.configuration.server;
						}
						if(config.configuration.username){
							process.env.XMPP_USERNAME = config.configuration.username;
						}
						if(config.configuration.pwd){
							process.env.XMPP_PASSWORD = config.configuration.pwd;
						}
						break;
						case 'PGNOTIFY':
						this.APPConfig.set(config.config_name,  Array.from(new Set(config.configuration)));
						break;
					}
				});

				resolve(this.APPConfig);
			}).catch(e => setImmediate(() => {
				console.log(e);
				reject(e);
			}))
		})	

	}

	eventdata_insert(data: EventData){
//return this.query();
}




}
