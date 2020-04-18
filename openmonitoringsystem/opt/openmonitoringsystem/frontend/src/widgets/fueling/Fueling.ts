import { v, w } from '@dojo/framework/core/vdom';
import WidgetBase from '@dojo/framework/core/WidgetBase';
import * as css from '../styles/Profile.m.css';
import TextInput from '@dojo/widgets/text-input';
import Checkbox from '@dojo/widgets/checkbox';
import Textarea from '@dojo/widgets/text-area';
import SelectFromURL from '.././modules/SelectFromURL';
//import Lbox from '.././modules/ListboxUri';
import watch from '@dojo/framework/core/decorators/watch';
import ToolBar from '@dojo/widgets/toolbar';
import Icon from '.././Icon/Icon';
import SBar from '@dojo/widgets/snackbar';
import TitlePane from '@dojo/widgets/title-pane';
import Menu from '.././Menu';


export interface FuelingProperties {
	idfueling?: string;
}

export default class Fueling extends WidgetBase<FuelingProperties>  {

	@watch()	 private Params = {
		idfueling: '0', 
		rowkey: 0,
		date_reg: '2020-01-01', 
		idvehicle: '0', 
		iduser: '0', 
		odometer: 0, 
		quantity: 0, 
		idfueltype: '0', 
		price_by_unit: '0', 
		total: 0, 
		full_tank: false, 
		geox: 0, 
		geoy: 0, 
		address: '', 
		last_lost: false, 
		note: ''
	}


	//	@watch()	private _readOnlyField = false;
	@watch()	private _openAddress = false;
	@watch()	private _openSnack = false;
	@watch()	private _MsgSnackBar = '-';
	
	private SnackBar(msg: string){
		this._openSnack = true;
		this._MsgSnackBar = msg;
		this.invalidate();
		setTimeout(()=>{
			this._openSnack = false;
			this.invalidate();
		}, 4000)		
	}
	
	private async GetAddress(){
		//data=[timeout:10][out:json];is_in(-0.21263,-78.41053)->.a;way(pivot.a);out+tags+bb;out+ids+geom(-0.21803,-78.41111,-0.21141,-78.40560);relation(pivot.a);out+tags+bb;
		let query = `[out:json][timeout:10];is_in(${this.Params.geox},${this.Params.geoy})->.a;relation(pivot.a);out tags qt;(way(around:20,${this.Params.geox},${this.Params.geoy}););out tags qt;`;
		let r = await fetch("https://overpass-api.de/api/interpreter", {
			"credentials": "omit",
			"headers": {
				"accept": "*/*",
				"accept-language": "es-ES,es;q=0.9,en;q=0.8",
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "cross-site"
			},
			"referrer": `https://www.openstreetmap.org/query?lat=${this.Params.geox}&lon=${this.Params.geoy}`,
			"referrerPolicy": "no-referrer-when-downgrade",
			//"body": `data=%5Btimeout%3A10%5D%5Bout%3Ajson%5D%3Bis_in(${this.Params.geox}%2C${this.Params.geoy})-%3E.a%3Bway(pivot.a)%3Bout+tags+bb%3Bout+ids+geom(${Number(this.Params.geox).toFixed(5)}%2C${Number(this.Params.geoy).toFixed(5)}%2C${this.Params.geox}%2C${this.Params.geoy})%3Brelation(pivot.a)%3Bout+tags+bb%3B`,
			"body": query, 
			"method": "POST",
			"mode": "cors"
		});
		let data = await r.json();
		console.log(data);
		var addr = '';

		if(data.elements){
			data.elements.forEach((item: any, index: number)=>{
				if(item.tags){
					if(index == 0){
						addr += item.tags.name;
					}else if(!item.tags.timezone && item.tags.name){
						addr += ', '+item.tags.name;						
					}				
				}

				if(data.elements.length == index+1){
					this.Params.address = addr;
					this.invalidate();
					this.SnackBar(addr);
				}
			});	
		}		

	}

	private Save(){

		console.log(this.Params);

		if(this.Params.odometer > 0 && Number(this.Params.idvehicle) > 0){
			fetch('/fueling', {
				method: 'POST',
				body: JSON.stringify(this.Params),
				headers: {
					'Content-Type': 'application/json'
				}
			}).then((response)=>{
				response.json().then((data)=>{
					if(data.save){
						window.location.href = "/#fuelinglog";
					}else{
						this.SnackBar('No se pudo guardar');
						this.invalidate();
					}
				});
			});

		}else{
			this.SnackBar('Complete los campos requerido');
		}

		this.invalidate();
	}

	async onAttach(){

		if(this.properties.idfueling){

			var paramsString = window.location.hash.split('?')[1];
			var searchParams = new URLSearchParams(paramsString);
			this.Params.idfueling = searchParams.get("idfueling")||'-3';
			var url = "/fueling?idfueling="+this.Params.idfueling;

			const res = await fetch(
				url, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				}	
				);
			
			if(res.status == 200){
				let data = await res.json();
				if(data.length > 0){
					this.Params = data[0];
				}
			}

			console.log(res);
			this.invalidate(); 			
		}
	}

	private	getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position)=>{
				this.Params.geox = position.coords.latitude;
				this.Params.geoy = position.coords.longitude;
				this.invalidate();
				if(this.Params.address.length < 2){
					this.GetAddress().then();
				}
			});
		} else {
			this.SnackBar('No se pudo obtener las coordenadas');
		}
	}

	protected render(){

		return v('div', {}, [
			w(Menu, {}),
			w(ToolBar, {heading: 'ABASTECIMIENTO',  collapseWidth: 150}, [
				w(Icon, {label: 'HISTORIAL', classes: ['fas', 'fa-table'], ShowLabel: true,
					onClick: (e)=>{  

						console.log('Historial ', this.Params);

						if(Number(this.Params.idvehicle) > 0){
							let url = "/#fuelinglog?idvehicle="+this.Params.idvehicle;
							console.log(url);
							window.location.href = url;						
						}else{
							this.SnackBar('Seleccione un vehículo');					
						}
					}
				}),
				v('span', {}, ['|']),
				w(Icon, {label: 'GUARDAR', classes: ['fas', 'fa-save'], ShowLabel: true,
					onClick: (e)=>{    
						this.Save();
					}
				})
				]),
			v('div',{ classes: css.field_one_line }, [
				w(SelectFromURL, {label: 'Vehículo', value: this.Params.idvehicle, url: '/toselect/vehicles', 
					onSelect:(label, value, disabled)=>{
						console.log('onSelect', label, value, disabled);
						this.Params.idvehicle = value;	
					},
					params: {idaccount: localStorage.getItem('idaccount')}
				}),
				]
				),
			v('div', {classes: css.row}, [
				v('div',{ classes: [css.column2]}, [
					w(TextInput, { 
						type: 'text',
						label: "Odómetro (Km)",
						disabled: false,
						readOnly: false,
						required: true,
						value: this.Params.odometer as any,
						onChange: (d)=>{
							this.Params.odometer = Number(d);
							this.invalidate();
						}
					}),
					]
					),
				v('div', {classes: css.column2_center_checkbox},[
					w(Checkbox, {
						checked: this.Params.full_tank,
						aria: { describedBy: 'Tanque lleno' },
						label: 'Tanque lleno',
						//mode: Mode.toggle,
						name: 'full_tank',
						onLabel: 'Si',
						offLabel: 'No',
						onChange: (value: string, checked: boolean) => {
							this.Params.full_tank = checked;
							console.log(this.Params.full_tank);
							this.invalidate();
						}
					})
					])
				]),						
			v('div', {classes: css.row}, [
				v('div',{ classes: [css.column2]}, [
					w(TextInput, { 
						type: 'text',
						label: "Cantidad",
						disabled: false,
						readOnly: false,
						required: true,
						value: this.Params.quantity as any,
						onChange: (d)=>{
							this.Params.quantity = Number(d);
							this.invalidate();
						}
					}),
					]
					),						
				v('div',{ classes: [css.column2] }, [
					w(SelectFromURL, {label: 'Tipo Combustible', value: this.Params.idfueltype, url: '/toselect/fueltypes',
						onSelect:(label, value, disabled)=>{
							console.log('onSelect', label, value, disabled);
							this.Params.idfueltype = value;	
						}
					}),
					]
					)
				]),
			v('div', {classes: css.row}, [
				v('div', {classes: [css.column2]}, [
					w(TextInput, { 
						type: 'number',
						label: "Precio x Unidad",
						disabled: false,
						readOnly: false,
						value: this.Params.price_by_unit as any,
						onChange: (v)=>{
							this.Params.price_by_unit = v as string;
							this.invalidate();
						}
					}),
					]),
				v('div', {classes: [css.column2]}, [
					w(TextInput, { 
						type: 'number',
						label: "Costo Total",
						disabled: false,
						readOnly: false,
						value: this.Params.total as any,
						onChange: (v)=>{
							this.Params.total = Number(v);
							this.invalidate();
						}
					}),
					]),
				]),	
			v('div', {classes: css.row}, [
				v('div', { classes: [css.column2]}, [
					w(TextInput, { 
						type: 'date',
						label: "Fecha",
						disabled: false,
						readOnly: false,
						required: true,
						placeholder: 'Fecha',
						value: this.Params.date_reg,
						onChange: (d)=>{
							this.Params.date_reg = d as string;
							this.invalidate();
						}
					}),
					]
					),
				v('div',{ classes: [css.column2]}, [
					w(TextInput, { 
						type: 'text',
						label: "Hora",
						disabled: false,
						readOnly: false,
						required: true,
						placeholder: 'Hora',
						value: this.Params.date_reg,
						onChange: (d)=>{
							this.Params.date_reg = d as string;
							this.invalidate();
						}
					}),
					]
					)
				]),				
			v('div', {classes: css.field_one_line}, [
				w(TitlePane, {
					title: 'Punto de abastecimiento',
					open: this._openAddress,
					onRequestOpen: () => {
						this._openAddress = true;
						this.getLocation();
						console.log('Abrió pane');
					},
					onRequestClose: () => {
						this._openAddress = false;
						console.log('Cerró pane');
					}
				}, [ 
				v('div', {classes: css.row}, [
					v('div', {classes: [css.column2]}, [
						w(TextInput, {  
							type: 'number',
							label: "Coordenada X",
							disabled: false,
							readOnly: false,
							value: this.Params.geox as any,
							onChange: (v)=>{
								this.Params.geox = v as number;
								this.invalidate();
							}
						}),
						]),
					v('div', {classes: [css.column2]}, [
						w(TextInput, {  
							type: 'number',
							label: "Coordenada Y",
							disabled: false,
							readOnly: false,
							value: this.Params.geoy as any,
							onChange: (v)=>{
								this.Params.geoy = v as number;
								this.invalidate();
							}
						}),
						]),
					v('div', {classes: [css.field_one_line]}, [
						w(Textarea, {
							columns: 40,
							rows: 5,
							placeholder: 'Dirección',
							label: 'Dirección',
							key: 'text-area',
							value: this.Params.address,
							onInput: (value: string) => {
								this.Params.address = value;
								this.invalidate();
							}
						}),
						])
					])
				])
				]),
			v('div', {classes: css.row}, [
				v('div', {classes: css.column2_center_checkbox}, [
					w(Checkbox, {
						checked: this.Params.last_lost,
						aria: { describedBy: 'Última recarga perdida' },
						label: 'Última recarga perdida',
						//mode: Mode.toggle,
						name: 'last_lost',
						onLabel: 'Si',
						offLabel: 'No',
						onChange: (value: string, checked: boolean) => {
							this.Params.last_lost = checked;
							console.log(this.Params.last_lost);
							this.invalidate();
						}
					})
					]),
				v('div', {classes: css.column2}, [])
				]),
			v('div', {classes: [css.field_one_line]}, [
				w(Textarea, {
					columns: 40,
					rows: 5,
					placeholder: 'Notas',
					label: 'Notas',
					key: 'text-area',
					value: this.Params.note,
					onInput: (value: string) => {
						this.Params.note = value;
						this.invalidate();
					}
				}),
				]),
			//			w(SBar, {open: this._openSnackMsgValideFields, leading: false, type: 'error', messageRenderer: () => 'Complete los campos requeridos'}),
			//			w(SBar, {open: this._openSnackMsgGPSError, leading: false, type: 'error', messageRenderer: () => 'No se pudo obtener las coordenadas'}),
			//			w(SBar, {open: this._openSnackMsgSaveError, leading: false, type: 'error', messageRenderer: () => 'No se pudo guardar, revise la conexión'}),
			w(SBar, {open: this._openSnack, leading: false, type: 'error', messageRenderer: () => this._MsgSnackBar})
			]);

}


}