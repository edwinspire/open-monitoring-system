import { create, v, w } from '@dojo/framework/core/vdom';
import Contact from './modules/Contact';
import Menu from './Menu';

import * as css from './styles/Profile.m.css';

console.log(window.location.hash);

const factory = create();

export default factory(function Profile({ properties }) {
	return v('div', { classes: [css.root] }, [
		w(Menu, {}),
		w(Contact, {idcontact: '0'})
		]);
});
