import { create, v, w } from '@dojo/framework/core/vdom';
import Menu from './Menu';
//import watch from '@dojo/framework/core/decorators/watch';
import Vehicles from './modules/Vehicles';

import * as css from './styles/Profile.m.css';

const factory = create();

export default factory(function Profile({ properties }) {
	//const { username, name } = properties();
	return v('div', { classes: [css.root] }, [
		w(Menu, {}),
		w(Vehicles, {})
		]);
});
