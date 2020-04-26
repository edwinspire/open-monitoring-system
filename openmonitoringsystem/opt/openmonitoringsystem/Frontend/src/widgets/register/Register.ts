import { v, w } from '@dojo/framework/core/vdom';
import WidgetBase from '@dojo/framework/core/WidgetBase';
import * as css from './Register.m.css';
import SBar from '@dojo/widgets/snackbar';
//import watch from '@dojo/framework/core/decorators/watch';

export default class Register extends WidgetBase  {

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

	onAttach(){
		document.cookie = "TOKEN_USER= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
		console.log('Borrar');

	}

	protected render(){

		return v('div', {classes: [css.root]}, [
			v('div', {classes: [css.body]}, [
				v('div', {classes: css.wrapper}, [
					v('div', { classes: [css.container]}, [
						v('h1', {}, ['Registro']),
						v('form', {classes: css.form, action: "/register", method: "post",  onsubmit: (e: Event)=>{	

							if(e.target){
								let d = e.target as HTMLFormElement;
								let inputs = d.getElementsByTagName("input");
								let i = 0;
								var DataLogin = {};
								let pwd = '';
								let pwd2 = '';

								for (i=0; i<inputs.length; i++){
									Object.defineProperty(DataLogin, inputs[i].name, {value : inputs[i].value, enumerable: true});

									if(inputs[i].name == 'pwd'){
										pwd = inputs[i].value;
									}


									if(inputs[i].name == 'pwd2'){
										pwd2 = inputs[i].value;
									}

									if(i+1 == inputs.length){

										if(pwd == pwd2){
											(
												async ()=>{
													let resp = await fetch("/register",{method: 'POST', body: JSON.stringify(DataLogin), headers: {'Content-Type': 'application/json'}});
													let data = await resp.json();
													if(resp.status == 200){

														console.log(data);
														if(data.Register){

															this.SnackBar('success', data.Message);
															setTimeout(()=>{
																window.location.href = "/#login";
															}, 5000);

														}else{
															this.SnackBar('error', data.Message);
														}


													}else{
														console.log('No se pudo registrar', data);
														//alert('No se pudo registrar');
														this.SnackBar('error', 'no se pudo guardar');
													}
												}
												)();

											}else{
												this.SnackBar('error', 'Las contraseñas no coinciden');
											}

										}
									}
								}

								e.preventDefault();							
							}}, [
							v('input', {name: 'firstname',  type: 'text', placeholder: 'Nombre', required: 'required'}),
							v('input', {name: 'lastname',  type: 'text', placeholder: 'Apellido', required: 'required'}),
							v('input', {name: 'username', type: 'email', placeholder: 'Email', required: 'required'}),
							v('input', {name: 'pwd', type: 'password', placeholder: 'Contraseña', required: 'required'}),
							v('input', {name: 'pwd2', type: 'password', placeholder: 'Confirme Contraseña', required: 'required'}),
							v('input', {name: 'register', type: 'submit', value: 'Aceptar'}),
							v('div', {classes: css.links_block}, [
								v('a', {href: "/#login"}, ['Login'])
								])
							]),
						]),
					w(SBar, {open: this._openSnack, leading: false, type: this._SnackType, messageRenderer: () => this._MsgSnackBar})
					])
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