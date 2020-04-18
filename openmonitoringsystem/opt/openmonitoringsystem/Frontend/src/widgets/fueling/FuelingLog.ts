import { v, w } from '@dojo/framework/core/vdom';
import WidgetBase from '@dojo/framework/core/WidgetBase';
import Grid from '@dojo/widgets/grid';
import { createFetcher } from '@dojo/widgets/grid/utils';
import ToolBar from '@dojo/widgets/toolbar';
import IconX from '.././Icon/Icon';

export interface FuelingLogProperties {
	idvehicle: string;
}

export default class FuelingLog extends WidgetBase <FuelingLogProperties> {

	private url: string = '/fuelinglog';
	private Params = {
		idvehicle: '0'
	}
	private columnConfig = [
	{
		id: 'date_reg',
		title: 'Fecha',
		filterable: true,
		sortable: true,
		//editable: true,
		resizable: true
	},	
	{
		id: 'odometer',
		title: 'Odometer',
		filterable: true,
		sortable: true,
		//editable: true,
		resizable: true
	},
	{
		id: 'quantity',
		title: 'Cantidad',
		filterable: true,
		sortable: true,
		//editable: true,
		resizable: true
	},
	{
		id: 'price_by_unit',
		title: 'Precio x Unidad',
		filterable: true,
		sortable: true,
		//editable: true,
		resizable: true
	},

	{
		id: 'total',
		title: 'Total',
		filterable: true,
		sortable: true,
		//editable: true,
		resizable: true
	},
	{
		id: 'address',
		title: 'Dirección',
		//filterable: true,
		sortable: true,
		//editable: true,
		resizable: true
	}	,
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

		setTimeout(()=>{
			this.columnConfig = [
			{
				id: 'date_reg',
				title: 'Fecha',
				filterable: false,
				sortable: true,
				//editable: true,
				resizable: true
			},	
			{
				id: 'odometer',
				title: 'Odometer',
				filterable: false,
				sortable: true,
				//editable: true,
				resizable: true
			},
			{
				id: 'quantity',
				title: 'Cantidad',
				filterable: false,
				sortable: true,
				//editable: true,
				resizable: true
			},
			{
				id: 'total',
				title: 'Total',
				filterable: false,
				sortable: true,
				//editable: true,
				resizable: true
			},
			{
				id: 'address',
				title: 'Dirección',
				//filterable: true,
				sortable: false,
				//editable: true,
				resizable: true
			}
			];

			this.invalidate();

		}, 10000)


		var paramsString = window.location.hash.split('?')[1];
		var searchParams = new URLSearchParams(paramsString);
		this.Params.idvehicle = searchParams.get("idvehicle")||'-2';

		const res = await fetch(
			this.url+'?idvehicle='+this.Params.idvehicle,{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			}
			);
		let data = await res.json();
		console.log(data);
		this._fetcher = createFetcher(data);
		this.invalidate(); 
	}

	protected render(){

		return v('div', { }, [
			w(ToolBar, {heading: 'ABASTECIMIENTOS', collapseWidth: 150}, [
				w(IconX, {label: 'NUEVO', classes: ['fas', 'fa-user-plus'], ShowLabel: true,
					onClick: (e)=>{    
						window.location.href = "/#fueling?idfueling=0&rowkey=0";
					}
				})
				]),
			v('div', { }, [
				this._fetcher ? w(Grid, {
					columnConfig: this.columnConfig,
					fetcher: this._fetcher,
					height: 400,
					onRowSelect: (items: any[]) => {
						console.log(items, this._fetcher)
						window.location.href = "/#fueling?idfueling="+items[0].idfueling+"&rowkey="+items[0].rowkey;
					}
				}) : null
				])
			]);
	}

}