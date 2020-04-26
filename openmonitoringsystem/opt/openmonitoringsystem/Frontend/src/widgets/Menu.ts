import { create, w } from '@dojo/framework/core/vdom';
import Link from '@dojo/framework/routing/ActiveLink';
import Toolbar from '@dojo/widgets/toolbar';
import * as css from './styles/Menu.m.css';
import Icon from './Icon/Icon';

const factory = create();

export default factory(function Menu() {

	console.log('function Menu ');
	let m = [
	w(
		Link,
		{
			to: 'home',
			classes: [css.link],
			activeClasses: [css.selected]
		},
		[
		w(Icon, {label: 'HOME', classes: ['fas', 'fa-home'], ShowLabel: true})]
		),
	w(
		Link,
		{
			to: 'contacts',
			classes: [css.link],
			activeClasses: [css.selected]
		},
		[w(Icon, {label: 'CONTACTOS', classes: ['fas', 'fa-users'], ShowLabel: true})]
		),		
	w(
		Link,
		{
			to: 'vehicles',
			classes: [css.link],
			activeClasses: [css.selected]
		},
		[w(Icon, {label: 'VEHÍCULOS', classes: ['fas', 'fa-car-side'], ShowLabel: true})]
		),
	w(
		Link,
		{
			to: 'fueling',
			classes: [css.link],
			activeClasses: [css.selected]
		},
		[w(Icon, {label: 'ABASTECIMIENTO', classes: ['fas', 'fa-gas-pump'], ShowLabel: true})]
		),
	w(
		Link,
		{
			to: 'login',
			classes: [css.link],
			activeClasses: [css.selected]
		},
		[w(Icon, {label: 'SALIR', classes: ['fas', 'fa-sign-out-alt'], ShowLabel: true})]
		)
	];
	return w(Toolbar, { heading: 'Car Log', collapseWidth: 500 }, m);
});
