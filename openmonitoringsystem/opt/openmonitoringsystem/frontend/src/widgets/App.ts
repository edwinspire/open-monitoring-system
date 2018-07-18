import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';

import { WorkerFormData } from './WorkerForm';
import { WorkerProperties } from './Worker';
import WorkerFormOutlet from './../outlets/WorkerFormOutlet';
import WorkerContainerOutlet from './../outlets/WorkerContainerOutlet';
import BannerOutlet from './../outlets/BannerOutlet';
import LoginOutlet from './../outlets/LoginOutlet';
import ContactsOutlet from './../outlets/ContactsOutlet';
import FilteredWorkerContainerOutlet from './../outlets/FilteredWorkerContainerOutlet';
import workerData from './../support/workerData';
import * as css from './../styles/app.m.css';
import Menu from './menu/menu';
const socketIO = require ('socket.io-client');


@theme(css)
export default class App extends ThemedMixin(WidgetBase) {
	private _newWorker: Partial<WorkerFormData> = {};

	private _workerData: WorkerProperties[] = workerData;

	private _addWorker() {
		this._workerData = this._workerData.concat(this._newWorker);
		this._newWorker = {};
		this.invalidate();
	}

	private _onFormInput(data: Partial<WorkerFormData>) {
		this._newWorker = {
			...this._newWorker,
			...data
		};
		this.invalidate();
	}

	private _SocketIO(){


		var hostws = '//'+document.location.host;
		var socket = socketIO.connect(hostws);

		console.log(hostws);

		socket.on('connection', function(client: any) {  
			console.log('Client connected to '+hostws);
                    //socket.emit('heartbeat', {sessionidclient: cookie('oms_sessionidclient'), token: cookie('oms_sessiontoken')});
                });
		


	}

	protected render() {

		this._SocketIO();

		return v('div', { classes: this.theme(css.main) }, [
			w(Menu, {}),
			v('div', {},  [
				w(BannerOutlet, {}),
				w(LoginOutlet, {}),
				w(ContactsOutlet, {}),
				w(WorkerFormOutlet, {
					formData: this._newWorker,
					onFormInput: this._onFormInput,
					onFormSave: this._addWorker
				}),
				w(FilteredWorkerContainerOutlet, {
					workerData: this._workerData
				}),
				w(WorkerContainerOutlet, {
					workerData: this._workerData
				})
				])
			]);
	}
}
