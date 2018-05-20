// import { DNode } from '@dojo/widget-core/interfaces';
import {  theme } from '@dojo/widget-core/mixins/Themed';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import * as css from './styles/login.m.css';
import  Request  from '../../class/request';

@theme(css)
export default class Login extends WidgetBase {

	user = v('input', {type:"text", placeholder:"Username", name:"user"})
	pwd = v('input', {type:"password", placeholder:"Password", name:"pwd"})

	Submit (evt: any){

		evt.preventDefault();
		//let c = evt.target.childNodes;
		let form = {name: 'user_login', datas: [{username: this.pwd.properties.bind.user.domNode.value, password: this.pwd.properties.bind.pwd.domNode.value}]};
		//console.log(evt, c);
		console.dir(this.children);
		console.dir(this.pwd.properties);
		console.dir(this.user.properties);
		//console.dir(this.pwd.properties.bind.pwd.domNode.value);
/*
		var i;
		for (i = 0; i < c.length; i++) {

			if(c[i].name && c[i].value){
				form.datas.push(c[i]);
			}
			
		}
*/


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
		return v('div', {classes: css.login_body}, [
			v('div', { classes: css.wrapper }, [
				v('div', { classes: css.container }, [
					v('h1', {  }, [ 'Open Monitoring System']),
					v('form', {onsubmit: this.Submit}, [
						//v('input', { type:"hidden", name:"name", value:"user_login"}), 
						this.user,
						this.pwd,
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
