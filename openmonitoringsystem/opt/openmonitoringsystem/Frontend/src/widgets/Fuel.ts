import { create, v, w } from '@dojo/framework/core/vdom';

//import watch from '@dojo/framework/core/decorators/watch';
import Fuel1 from './fuel/Fuel1';

import * as css from './styles/Profile.m.css';

const factory = create();

export default factory(function Profile({ properties }) {
	//const { username, name } = properties();
	return v('h1', { classes: [css.root] }, [w(Fuel1, {}, [])]);
});
