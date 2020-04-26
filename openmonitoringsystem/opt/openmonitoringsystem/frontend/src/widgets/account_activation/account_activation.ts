import { v, w } from '@dojo/framework/core/vdom';
import WidgetBase from '@dojo/framework/core/WidgetBase';
import * as css from './account_activation.m.css';
import SBar from '@dojo/widgets/snackbar';

export default class AccountActivation extends WidgetBase  {

	onAttach(){
		document.cookie = "TOKEN_USER= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
		console.log('Borrar');
	}

	private _openSnack = false;
	private _MsgSnackBar = '-';
	private _SnackType: 'success'|'error'|undefined;
	
	private SnackBar(type: 'success'|'error'|undefined, msg: string){
		console.log('SnackBar '+msg)	
		this._openSnack = true;
		this._MsgSnackBar = msg;
		this._SnackType = type;
		this.invalidate();
		setTimeout(()=>{
			this._openSnack = false;
			this.invalidate();
		}, 4000)		
	}

	protected render(){

		return v('div', {classes: [css.root]}, [
			v('div', {classes: [css.body]}, [
				v('div', {classes: css.wrapper}, [
					v('div', { classes: [css.container]}, [
						v('h1', {}, ['Bienvenido!']),
						v('div', {}, ['Su cuenta ha sido creada. El siguiente paso es activarla.', 
							v('p', {}, ['Presione el botón para activar su cuenta'])
							]),
						v('form', {classes: css.form, action: "/xyz", method: "POST", onsubmit: (e: Event)=>{	

							(
								async ()=>{

									var paramsString = window.location.hash.split('?')[1];
									var searchParams = new URLSearchParams(paramsString);

									var datacode = {
										code: searchParams.get("activation_code")
									}

									let resp = await fetch("/account_activation",{method: 'POST', body: JSON.stringify(datacode), headers: {'Content-Type': 'application/json'}});
									let data = await resp.json();

									if(resp.status == 200){

										if(data.idaccount && data.idaccount > 0){

											this.SnackBar('success', data.notes);
											setTimeout(()=>{
												window.location.href = "/#login";
											}, 5000);

										}else{
											this.SnackBar('error', data.notes);
										}

									}else{
										console.log('No se pudo registrar', data);
										//alert('No se pudo registrar');
										this.SnackBar('error', 'no se pudo guardar');
									}
								}
								)();

								e.preventDefault();							
							}}, [
							v('input', {name: 'Continuar', type: 'submit', value: 'Continuar'})
							]),
						])
					]),
				w(SBar, {open: this._openSnack, leading: false, type: this._SnackType, messageRenderer: () => this._MsgSnackBar})
				]),
			v('ul', {classes: css.bg_bubbles}, [
				v('li'),
				v('li'),
				v('li'),
				v('li'),
				v('li'),
				v('li'),
				v('li'),
				v('li'),
				v('li'),
				v('li')
				])
			])
	}
}