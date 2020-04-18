import { v, w } from '@dojo/framework/core/vdom';
import WidgetBase from '@dojo/framework/core/WidgetBase';
import * as css from './Login.m.css';
import SBar from '@dojo/widgets/snackbar';
import watch from '@dojo/framework/core/decorators/watch';

export default class Login extends WidgetBase  {

	@watch()	private _openSnack = false;
	@watch()	private _MsgSnackBar = '-';
	
	private SnackBar(msg: string){
		console.log('SnackBar '+msg)
		this._openSnack = true;
		this._MsgSnackBar = msg;
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
			v('div', { classes: [css.login, css.container, css.container_html]}, [
				v('h1', {}, ['Login']),
				v('form', {action: "/login", method: "post",  onsubmit: (e: Event)=>{	
					if(e.target){
						let d = e.target as HTMLFormElement;
						let inputs = d.getElementsByTagName("input");
						let i = 0;
						var DataLogin = {};

						for (i=0; i<inputs.length; i++){
							Object.defineProperty(DataLogin, inputs[i].name, {value : inputs[i].value, enumerable: true});
							if(i+1 == inputs.length){
								(async()=>{

									let res = await fetch("/login",{method: 'POST', body: JSON.stringify(DataLogin), headers: {'Content-Type': 'application/json'}});
									var data = await res.json();
									console.log(data);
									if(res.status == 200){

										if(!data.login){
											this.SnackBar(data.message)
										}else{
											localStorage.setItem('idaccount', data.idaccount);
											localStorage.setItem('iduser', data.iduser);
											localStorage.setItem('preferences', data.preferences);
											localStorage.setItem('fullname', data.fullname);
											localStorage.setItem('user', JSON.stringify(data));
											window.location.href = "/#home";
										}

									}else{
										this.SnackBar('Sucedió un inconveniente con el servidor')
									}
								})()
							}
						}
					}

					e.preventDefault();
				}}, [
				//v('input', {classes: [css.input], name: 'account',  type: 'text', placeholder: 'Cuenta'}, []),
				v('input', {classes: [css.input],  name: 'username', type: 'text', placeholder: 'Usuario', required: 'required'}, []),
				v('input', {classes: [css.input], name: 'pwd', type: 'password', placeholder: 'Contraseña', required: 'required'}, []),
				v('input', {name: 'carlog', classes: [css.btn, css.btn_primary, css.btn_block, css.btn_large], type: 'submit', value: 'Aceptar'})
				]),
				v('div', {classes: css.register}, [
					v('a', {classes: [css.anchor],  href: "/#register"}, ['Registro'])])
				]),
			w(SBar, {open: this._openSnack, leading: false, type: 'error', messageRenderer: () => this._MsgSnackBar})
			])
	}


}