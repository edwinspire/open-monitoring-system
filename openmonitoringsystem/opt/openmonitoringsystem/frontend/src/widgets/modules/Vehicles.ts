import { v, w } from '@dojo/framework/core/vdom';
import WidgetBase from '@dojo/framework/core/WidgetBase';
import * as css from '../styles/Profile.m.css';
import Grid from '@dojo/widgets/grid';
import { createFetcher } from '@dojo/widgets/grid/utils';
import Card from '@dojo/widgets/card';
import ToolBar from '@dojo/widgets/toolbar';
import IconX from '.././Icon/Icon';

export default class Vehicles extends WidgetBase {

	private columnConfig = [
	{
		id: 'license_plate',
		title: 'Placa',
		filterable: true,
		sortable: true,
		//editable: true,
		resizable: true
	},	
	{
		id: 'lfname',
		title: 'Propietario',
		filterable: true,
		sortable: true,
		//editable: true,
		resizable: true
	},	
	{
		id: 'identification',
		title: 'Identificación',
		filterable: true,
		sortable: true,
		//editable: true,
		resizable: true
	},		
	{
		id: 'mark_label',
		title: 'Marca',
		filterable: true,
		sortable: true,
		//editable: true,
		resizable: true
	},			
	{
		id: 'year',
		title: 'Año',
		filterable: true,
		sortable: true,
		//editable: true,
		resizable: true
	},
	{
		id: 'vin',
		title: 'VIN',
		filterable: true,
		sortable: true,
		//editable: true,
		resizable: true
	},	
	{
		id: 'note',
		title: 'Notas',
		//filterable: true,
		sortable: true,
		//editable: true,
		resizable: true
	}
	];

	private _fetcher: any;

	async onAttach() {
		const res = await fetch(
			"/vehicles",{
				method: 'POST',
				body: JSON.stringify({idaccount: localStorage.getItem('idaccount')}),
				headers: {
					'Content-Type': 'application/json'
				}
			}
			);

		if(res.status == 200){
			let data = await res.json();
			this._fetcher = createFetcher(data);
			this.invalidate(); 
		}

	}

	protected render(){

		return w(Card, {}, [
			w(ToolBar, {heading: 'VEHÍCULOS', collapseWidth: 150}, [
				w(IconX, {label: 'NUEVO', classes: ['fas', 'fa-car'], ShowLabel: true,
					onClick: (e)=>{    
						window.location.href = "/#vehicle?idvehicle=0&rowkey=0&idaccount="+localStorage.getItem('idaccount');
					}
				})
				]),
			v('div', {classes: [css.grid]}, [
				this._fetcher ? w(Grid, {
					columnConfig: this.columnConfig,
					fetcher: this._fetcher,
					height: 500,
					onRowSelect: (items: any[]) => {
						console.log(items, this._fetcher)
						window.location.href = "/#vehicle?idvehicle="+items[0].idvehicle+"&rowkey="+items[0].rowkey+"&idaccount="+localStorage.getItem('idaccount');
					}
				}) : null
				])
			]);
	}

}