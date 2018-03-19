import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';
//import { Link } from '@dojo/routing/Link';

import LoginOutlet from './../widgets/login/Outlet';
/*
import { WorkerFormData } from './WorkerForm';
import { WorkerProperties } from './Worker';
import WorkerFormOutlet from './../outlets/WorkerFormOutlet';
import WorkerContainerOutlet from './../outlets/WorkerContainerOutlet';
import BannerOutlet from './../outlets/BannerOutlet';
import FilteredWorkerContainerOutlet from './../outlets/FilteredWorkerContainerOutlet';

import workerData from './../support/workerData';
*/
import * as css from './styles/OpenMonitoringSystem.m.css';


@theme(css)
export default class App extends ThemedMixin(WidgetBase) {
/*	private _newWorker: Partial<WorkerFormData> = {};

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
*/
	protected render() {
		return v('div', [
			w(LoginOutlet, { 
					//data: this._workerData
				})
		]);
	}
}
