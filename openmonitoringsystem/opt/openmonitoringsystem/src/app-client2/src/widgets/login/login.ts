// import { DNode } from '@dojo/widget-core/interfaces';
import {  theme } from '@dojo/widget-core/mixins/Themed';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import * as css from './styles/login.m.css';


@theme(css)
export default class Login extends WidgetBase {
	protected render() {
		return v('div', {classes: css.login_body}, [
			v('div', { classes: css.wrapper }, [
				v('div', { classes: css.container }, [
					v('h1', {  }, [ 'Open Monitoring System']),
					v('form', {action:"/service/login_user", method:"POST"}, [
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
