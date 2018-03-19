// import { DNode } from '@dojo/widget-core/interfaces';
import { ThemedMixin, theme } from '@dojo/widget-core/mixins/Themed';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v , w } from '@dojo/widget-core/d';
import * as css from './styles/login.m.css';
import { Link } from '@dojo/routing/Link';
//import LoginOutlet from './Outlet';


/**
 * @type loginProperties
 *
 * Properties that can be set on login components
 */
 export interface loginProperties { };

 export const ThemedBase = ThemedMixin(WidgetBase);

 @theme(css)
 export class login<P extends loginProperties = loginProperties> extends ThemedBase<P> {
 	protected render() {
 		return v('div', { classes: css.wrapper }, [
 			v('div', { classes: css.container }, [
 				v('h1', {  }, [ 'Open Monitoring System']),
 				v('form', {action:"#", method:"POST"}, [
 					v('input', { type:"hidden", name:"@command"}), 
 					v('input', {type:"text", placeholder:"Username", name:"user"}),
 					v('input', {type:"password", placeholder:"Password", name:"pwd"}),
 					v('button', {type:"submit", id:"login-button",   
 						onclick() {
 							console.log('Hello');
 						}}, ['Login Now']),
 					w(Link, { key: 'home', to: 'home' }, [ 'Home' ])
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
 			]);
 	}
 }

 export default login;
