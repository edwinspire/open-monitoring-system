// import { DNode } from '@dojo/widget-core/interfaces';
import {  theme } from '@dojo/widget-core/mixins/Themed';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import * as css from './styles/login.m.css';
import  Request  from '../../class/request';

@theme(css)
export default class Login extends WidgetBase {

	Submit (evt: any){

		evt.preventDefault();

		console.log(evt);

		let R = new Request();

		R.send({name: "user_login", description: "hola"}).then((response) => {		
			
			let r = (response as any);


			if(r.login){
				alert('Bienvenido ' + (response as any).fullname);
				window.location.replace("/#directory");
			}else{
				alert('Las credenciales no son validas');	
				window.location.replace("http://google.com");
			}


		});

		return false;
	}

	protected render() {
		return v('div', {classes: css.login_body}, [
			v('div', { classes: css.wrapper }, [
				v('div', { classes: css.container }, [
					v('h1', {  }, [ 'Open Monitoring System']),
					v('form', {onsubmit: this.Submit}, [
						v('input', { type:"hidden", name:"@command"}), 
						v('input', {type:"text", placeholder:"Username", name:"user"}),
						v('input', {type:"password", placeholder:"Password", name:"pwd"}),
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
