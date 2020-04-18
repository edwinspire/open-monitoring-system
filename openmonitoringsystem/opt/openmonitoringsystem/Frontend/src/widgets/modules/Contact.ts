import { v, w } from '@dojo/framework/core/vdom';
import WidgetBase from '@dojo/framework/core/WidgetBase';
import * as css from '../styles/Profile.m.css';
import TextInput from '@dojo/widgets/text-input';
import Textarea from '@dojo/widgets/text-area';
import SelectFromURL from './SelectFromURL';
import watch from '@dojo/framework/core/decorators/watch';
import ToolBar from '@dojo/widgets/toolbar';
import Icon from '.././Icon/Icon';
import SBar from '@dojo/widgets/snackbar';
//import theme from '@dojo/themes/material';

export interface ContactProperties {
	idcontact?: string;
}

export default class Contact extends WidgetBase<ContactProperties>  {

	@watch()	 private Params = {
		idaccount: '0',
		idcontact: '-1',
		rowkey: 0,
		firstname: '',
		lastname: '',
		identification: '',
		ididentificationtype: '0',
		birthday: '2020-01-01',
		idcontacttype: '0',
		idgender:  '0',
		note: ''
	}

	@watch()	private _openSnackMsgValideFields = false;
	@watch()	private _openSnackMsgSaveError = false;

	
	private Save(){
		this.Params.idaccount = localStorage.getItem('idaccount')||'0';
		if(this.Params.firstname.length > 0 && this.Params.lastname.length > 0 && this.Params.identification.length){
			fetch('/contact_cu', {
				method: 'POST',
				body: JSON.stringify(this.Params),
				headers: {
					'Content-Type': 'application/json'
				}
			}).then((response)=>{
				response.json().then((data)=>{
					if(data.idcontact > 0 && data.rowkey > 0){
						window.location.href = "/#contacts";
					}else{
						this._openSnackMsgSaveError = true;
						this.invalidate();
					}
				});
			});

		}else{
			this._openSnackMsgValideFields = true;
			setTimeout(()=>{
				this._openSnackMsgValideFields = false
			}, 4000)
		}

		this.invalidate();
	}

	async onAttach(){

		this.Params.idaccount = localStorage.getItem('idaccount')||'0';
		if(this.properties.idcontact && this.Params.idaccount){

			var paramsString = window.location.hash.split('?')[1];
			var searchParams = new URLSearchParams(paramsString);
			this.Params.idcontact = searchParams.get("idcontact")||'-3';
			var url = "/contact_r?idcontact="+this.Params.idcontact+"&idaccount="+this.Params.idaccount;

			const res = await fetch(url, {method: 'GET', headers: {'Content-Type': 'application/json'}});
			if(res.status == 200){
				const data = await res.json();
				console.log(data);
				if(data.length > 0){
					this.Params = data[0];
				}
			}else if(res.status == 401){
				window.location.href = "/#login";
			}

			console.log(res);
			this.invalidate(); 			
		}else{
			console.log('No consulta', this.Params);
		}
	}

	protected render(){

		return v('div', {}, [
			w(ToolBar, {heading: 'CONTACTOS',  collapseWidth: 150}, [
				w(Icon, {label: 'NUEVO', classes: ['fas', 'fa-user-plus'], ShowLabel: true,
					onClick: (e)=>{    
						console.log('onClick 2');             
						this.Params = {
							idaccount: '0',
							idcontact: '0',
							rowkey: 0,
							firstname: '',
							lastname: '',
							identification: '',
							ididentificationtype: '0',
							birthday: '2020-01-01',
							idcontacttype: '0',
							idgender:  '0',
							note: ''
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
			v('div', {classes: css.row}, [
				v('div', { classes: [css.column2]}, [
					w(TextInput, { key: 't5',
						type: 'text',
						label: "Nombre",
						disabled: false,
						readOnly: false,
						required: true,
						placeholder: 'Nombre',
						value: this.Params.firstname,
						onChange: (d)=>{
							this.Params.firstname = d as string;
							this.invalidate();
						}
					}),
					]
					),
				v('div',{ classes: [css.column2]}, [
					w(TextInput, { key: 't5',
						type: 'text',
						label: "Apellido",
						disabled: false,
						readOnly: false,
						required: true,
						placeholder: 'Apellido',
						value: this.Params.lastname,
						onChange: (d)=>{
							this.Params.lastname = d as string;
							this.invalidate();
						}
					}),
					]
					)
				]),		
			v('div', {classes: css.row}, [
				v('div',{ classes: [css.column2]}, [
					w(TextInput, { key: 't5',
						type: 'text',
						label: "Identificación",
						disabled: false,
						readOnly: false,
						required: true,
						value: this.Params.identification,
						onChange: (d)=>{
							this.Params.identification = d as string;
							this.invalidate();
						}
					}),
					]
					),						
				v('div',{ classes: [css.column2] }, [
					w(SelectFromURL, {label: 'Tipo Identificación', value: this.Params.ididentificationtype, url: '/toselect/identificationtypes',
						onSelect:(label, value, disabled)=>{
							console.log('onSelect', label, value, disabled);
							this.Params.ididentificationtype = value;	
						}
					}),
					]
					)
				]),
			v('div', {classes: css.row}, [
				v('div', {classes: [css.column2]}, [
					w(TextInput, {    key: 't6',
						type: 'date',
						label: "Fecha nacimiento",
						disabled: false,
						readOnly: false,
						value: this.Params.birthday as any,
						onChange: (v)=>{
							this.Params.birthday = v as string;
							this.invalidate();
						}
					}),
					]),
				v('div',{ classes: [css.column2]}, [
					w(SelectFromURL, {label: 'Género', url: '/toselect/genders', value: this.Params.idgender,
						onSelect:(label, value, disabled)=>{
							console.log('onSelect', label, value, disabled);
							this.Params.idgender = value;	
						}
					}),
					]
					)
				]),			
			v('div', {classes: css.row}, [
				v('div',{ classes: [css.column2]}, [
					w(SelectFromURL, {label: 'Tipo de contacto', url: '/toselect/contacttypes', value: this.Params.idcontacttype, 
						onSelect:(label, value, disabled)=>{
							this.Params.idcontacttype = value;	

						}
					}),
					]
					),
				v('div', {classes: css.column2}, [])
				]),
			v('div', {classes: []}, [
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
			w(SBar, {open: this._openSnackMsgValideFields, leading: false, type: 'error', messageRenderer: () => 'Complete los campos requeridos'}),
			w(SBar, {open: this._openSnackMsgSaveError, leading: false, type: 'error', messageRenderer: () => 'No se pudo guardar, revise la conexión'})
			]);

	}


}