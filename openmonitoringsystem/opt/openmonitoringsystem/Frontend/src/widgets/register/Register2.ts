import { v, create, w } from '@dojo/framework/core/vdom';
import * as css from './Register.m.css';
import SBar from '@dojo/widgets/snackbar';

const factory = create();

export default factory(function Profile() {

	let _openSnackMsgSaveError = false;
	let _messageSnackBar = '';

	var OpenSnackBar = (msj: string)=>{
		_messageSnackBar = msj;
		_openSnackMsgSaveError = true;
		setTimeout(()=>{
			_openSnackMsgSaveError = false;
			_messageSnackBar = '';
		}, 3000)		
	}

	return v('div', {classes: [css.root]}, [
		v('div', { classes: [css.login, css.container, css.container_html]}, [
			v('h1', {}, ['Registro']),
			v('form', {action: "/register", method: "post",  onsubmit: (e: Event)=>{	
				if(e.target){
					let d = e.target as HTMLFormElement;
					let inputs = d.getElementsByTagName("input");
					let i = 0;
					var DataLogin = {};

					for (i=0; i<inputs.length; i++){
						Object.defineProperty(DataLogin, inputs[i].name, {value : inputs[i].value, enumerable: true});
						if(i+1 == inputs.length){

							(
								async ()=>{
									let resp = await fetch("/register",{method: 'POST', body: JSON.stringify(DataLogin), headers: {'Content-Type': 'application/json'}});
									let data = await resp.json();
									if(resp.status == 200){

										console.log(data);
										if(data.register){
											if(data.register.Register){
												window.location.href = "/#login";
											}else{
												OpenSnackBar(data.register.Message);
											}
										}else{
											OpenSnackBar('no se pudo guardar');
										}

									}else{
										console.log('No se pudo registrar', data);
										//alert('No se pudo registrar');
										OpenSnackBar('no se pudo guardar');
									}
								}
								)();

							}
						}
					}

					e.preventDefault();
				}}, [
				v('input', {classes: [css.input], name: 'account',  type: 'text', placeholder: 'Nombre de Cuenta', required: 'required'}),
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
		w(SBar, {open: _openSnackMsgSaveError, leading: false, type: 'error', messageRenderer: () => _messageSnackBar})
		])
});
