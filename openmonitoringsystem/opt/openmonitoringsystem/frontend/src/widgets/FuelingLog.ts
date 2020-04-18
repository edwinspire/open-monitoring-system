import { create, v, w } from '@dojo/framework/core/vdom';
import FL from './fueling/FuelingLog';
import * as css from './styles/Profile.m.css';
import Menu from './Menu';

const factory = create();

export default factory(function Profile({ properties }) {
	return v('div', { classes: [css.root] }, [
		w(Menu, {}),
		w(FL, {idvehicle: '0'})
		]);
});
