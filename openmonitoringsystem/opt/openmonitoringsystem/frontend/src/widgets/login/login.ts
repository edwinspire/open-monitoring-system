// import { DNode } from '@dojo/widget-core/interfaces';
import {  theme } from '@dojo/widget-core/mixins/Themed';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import * as css from './styles/login.m.css';
import  Request  from '../../class/request';

@theme(css)
export default class Login extends WidgetBase {

	user: string = '';
	pwd: string = '';

	private change_inputs (evt: any){
//console.log(evt.target.value);
//console.log(evt.target.name);
switch (evt.target.name) {
	case "user":
		this.user = evt.target.value;
		break;
	case "pwd":
		this.pwd = evt.target.value;
		break;

}

	}

	Submit (evt: any){

		evt.preventDefault();
		//let c = evt.target.childNodes;
		let form = {name: 'user_login', datas: {username: this.user, password: this.pwd}};

		console.dir(this.children);


		let R = new Request();

		R.send(form).then((response) => {		
			
			let r = (response as any);


			if(r.login){
				alert('Bienvenido ' + (response as any).fullname);
				window.location.replace("/#directory");
			}else{
				alert('Las credenciales no son validas');	
				//window.location.replace("http://google.com");
			}


		});

		return false;
	}

	protected render() {

// setInterval(()=>{
// 	console.log('El login esta vivo');
// }, 2000);

		return v('div', {classes: css.login_body}, [
			v('div', { classes: css.wrapper }, [
				v('div', { classes: css.container }, [
					v('h1', {  }, [ 'Open Monitoring System']),
					v('form', {onsubmit: this.Submit}, [
						//v('input', { type:"hidden", name:"name", value:"user_login"}), 
						v('input', {type:"text", placeholder:"Username", name:"user", onchange: this.change_inputs}),
						v('input', {type:"password", placeholder:"Password", name:"pwd", onchange: this.change_inputs}),
						v('button', {type:"submit", id:"login-button"}, ['Login Now'])
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
						]),
					])

				])
			]
			);
	}
}
