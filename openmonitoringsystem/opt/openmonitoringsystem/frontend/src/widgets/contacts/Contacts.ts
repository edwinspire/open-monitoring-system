import { v, w } from '@dojo/framework/core/vdom';
import WidgetBase from '@dojo/framework/core/WidgetBase';
import Grid from '@dojo/widgets/grid';
import { createFetcher } from '@dojo/widgets/grid/utils';
import ToolBar from '@dojo/widgets/toolbar';
import IconX from '.././Icon/Icon';

export interface ContactsProperties {
	url: string;
}

export default class Contacts extends WidgetBase <ContactsProperties> {

	private columnConfig = [
	{
		id: 'lfname',
		title: 'Nombre',
		filterable: true,
		sortable: true,
		//editable: true,
		resizable: true
	},	
	{
		id: 'identificationtype_label',
		title: 'Tipo ID',
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
		id: 'gender_label',
		title: 'Género',
		filterable: true,
		sortable: true,
		//editable: true,
		resizable: true
	},

	{
		id: 'contactype_label',
		title: 'Tipo Contacto',
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
			"/contacts_r",{
				method: 'POST',
				body: JSON.stringify({idaccount: localStorage.getItem('idaccount')}),
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
			w(ToolBar, {heading: 'CONTACTOS', collapseWidth: 150}, [
				w(IconX, {label: 'NUEVO', classes: ['fas', 'fa-user-plus'], ShowLabel: true,
					onClick: (e)=>{    
						window.location.href = "/#contact?idcontact=0&rowkey=0&idaccount="+localStorage.getItem('idaccount');
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
						window.location.href = "/#contact?idcontact="+items[0].idcontact+"&rowkey="+items[0].rowkey+"&idaccount="+localStorage.getItem('idaccount');
					}
				}) : null
				])
			]);
	}

}