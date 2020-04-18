import { create, v, w } from '@dojo/framework/core/vdom';
import Vehiculo from './modules/Vehicle';
import * as css from './styles/Profile.m.css';
import Menu from './Menu';

const factory = create();

export default factory(function Profile({ properties }) {
	return v('div', { classes: [css.root] }, [
		w(Menu, {}),
		w(Vehiculo, {idvehicle: '0'}, [])]);
});
