import Evented from '@dojo/framework/core/Evented';
import SocketIO from 'socket.io-client';
import { Store } from '@dojo/framework/stores/Store';
import { OperationType } from '@dojo/framework/stores/state/Patch';
import { Pointer } from '@dojo/framework/stores/state/Pointer';
//import { registerStoreInjector } from '@dojo/framework/stores/StoreInjector';

declare global {
	interface Window { GlobalSocketIO: SocketIOClient.Socket;}
	interface Window { GlobalStore: Store;}
}

export default class GlobalComunicator extends Evented {

	public test = '';
	private store = new Store();
	private socket = SocketIO.connect('//'+document.location.host);


	constructor(){
		super();
		console.log('Global X');
//		const registry = registerStoreInjector(this.store);
//		console.log(registry);
		window.GlobalSocketIO = this.socket;
		window.GlobalStore = this.store;

		this.store.on('invalidate', () => {
			console.log('El store ha cambiado');
		});

		this.store.onChange(this.store.path('grid', 'meta', 'page'), () => {
			console.log('onChange store');
		});
	}

	storeTest(){

		this.store.apply([
		{
			op: OperationType.ADD,
			path: new Pointer(['grid', 'meta', 'page']),
			value: Date.now()
		}
		]);


		const page = this.store.get(this.store.path('grid', 'meta', 'page'));
		console.log('Main Nuevo Global1: '+page);


		this.store.apply([
		{
			op: OperationType.REPLACE,
			path: new Pointer(['grid', 'meta', 'page']),
			value: 999
		}
		]);

		let page2 = this.store.get(this.store.path('grid', 'meta', 'page'));
		console.log('Main Nuevo Global2: '+page2);

	//	let page3 = this.getValue('grid', 'meta', 'page');
	//	console.log('Main Nuevo Global3: '+page3);		
	}

	

	connect(){
		window.GlobalSocketIO.on('connection', function(client: any) {  
			console.log('Client connected. web component..');
			window.GlobalSocketIO.emit('my other event', { my: 'data' });
		});

		window.GlobalSocketIO.on('connect_error', (data: any)=> {
			//console.log(data);
			window.GlobalSocketIO.emit('my other event', { my: 'data' });
		});

		window.GlobalSocketIO.on('news', (data: any)=> {
			//console.log(data);
			window.GlobalSocketIO.emit('my other event', { my: 'data' });
		});

		window.GlobalSocketIO.on('gps', (data: any)=> {
			console.log(data);
			//window.GlobalSocketIO.emit('my gps', data);
		});


		window.GlobalSocketIO.on('hora', (data: any)=> {
			//console.log(data);
			//window.GlobalSocketIO.emit('my other event', { my: 'data' });
		});

		window.GlobalSocketIO.on('postgres', (data: any)=> {
			//console.log(data);
			//window.GlobalSocketIO.emit('my other event', { my: 'data' });
		});

	}

}



