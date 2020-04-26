import { v } from '@dojo/framework/core/vdom';
import WidgetBase from '@dojo/framework/core/WidgetBase';
import * as css from './account_actived.m.css';

export default class Register extends WidgetBase  {

	onAttach(){
		document.cookie = "TOKEN_USER= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
		console.log('Borrar');
	}

	protected render(){

		return v('div', {classes: [css.root]}, [
			v('div', {classes: [css.body]}, [
				v('div', {classes: css.wrapper}, [
					v('div', { classes: [css.container]}, [
						v('h1', {}, ['Bienvenido!']),
						v('div', {}, ['Su cuenta ha sido correctamente activada. Presione continuar para acceder al login.']),
						v('form', {classes: css.form, action: "/#login", method: "get"}, [
							v('input', {name: 'Continuar', type: 'submit', value: 'Continuar'})
							]),
						])
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