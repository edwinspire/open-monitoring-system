import { v, w } from '@dojo/framework/core/vdom';
import WidgetBase from '@dojo/framework/core/WidgetBase';
import * as css from './Register.m.css';
import SBar from '@dojo/widgets/snackbar';
import watch from '@dojo/framework/core/decorators/watch';

export default class Vehicle extends WidgetBase  {

	@watch()	private _openSnack = false;
	@watch()	private _MsgSnackBar = '-';
	@watch()	private _typeSnackBar: "error" | "success" | undefined = 'error';
	
	private SnackBar(msg: string, type: "error" | "success" | undefined){
		console.log('SnackBar '+msg)
		this._openSnack = true;
		this._MsgSnackBar = msg;
		this._typeSnackBar = type;
		this.invalidate();
		setTimeout(()=>{
			this._openSnack = false;
			this.invalidate();
		}, 5000)		
	}

	protected render(){
		return v('div', {classes: [css.root]}, [
			v('div', { classes: [css.login, css.container, css.container_html]}, [
				v('h1', {}, ['Registro']),
				v('form', {action: "/register", method: "post",  onsubmit: (e: Event)=>{	
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

														this.SnackBar('Cuenta creada... no olvide sus datos. Redireccionando a Login', 'success');
														setTimeout(()=>{
															window.location.href = "/#login";
														}, 5000);

													}else{
														this.SnackBar(data.Message, 'error');
													}
												

											}else{
												console.log('No se pudo registrar', data);
												//alert('No se pudo registrar');
												this.SnackBar('no se pudo guardar', 'error');
											}
										}
										)();

									}else{
										this.SnackBar('Las contraseñas no coinciden', 'error');
									}

								}
							}
						}

						e.preventDefault();
					}}, [
//					v('input', {classes: [css.input], name: 'account',  type: 'text', placeholder: 'Nombre de Cuenta', required: 'required'}),
					v('input', {classes: [css.input], name: 'firstname',  type: 'text', placeholder: 'Nombre', required: 'required'}),
					v('input', {classes: [css.input], name: 'lastname',  type: 'text', placeholder: 'Apellido', required: 'required'}),
					v('input', {classes: [css.input], name: 'email', type: 'email', placeholder: 'Email', required: 'required'}),
					v('input', {classes: [css.input],  name: 'username', type: 'text', placeholder: 'Usuario', required: 'required'}),
					v('input', {classes: [css.input], name: 'pwd', type: 'password', placeholder: 'Contraseña', required: 'required'}),
					v('input', {classes: [css.input], name: 'pwd2', type: 'password', placeholder: 'Confirme Contraseña', required: 'required'}),
					v('input', {name: 'register', classes: [css.btn, css.btn_primary, css.btn_block, css.btn_large], type: 'submit', value: 'Aceptar'})
					]),
				v('div', {classes: css.register}, [
					v('a', {classes: [css.anchor],  href: "/#login"}, ['Login'])])
				]),
			w(SBar, {open: this._openSnack, leading: false, type: this._typeSnackBar, messageRenderer: () => this._MsgSnackBar})
			])
	}
}