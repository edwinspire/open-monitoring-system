import { create, v, w } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';
import Outlet from '@dojo/framework/routing/Outlet';
import dojo from '@dojo/themes/dojo';
import Home from './widgets/Home';
import Dashboard from './widgets/Dashboard';
import About from './widgets/About';
import Vehiculo from './widgets/Vehicle';
import Vehicles from './widgets/Vehicles';
import Fueling from './widgets/fueling/Fueling';
import FuelingLog from './widgets/FuelingLog';
import Contact from './widgets/Contact';
import Contacts from './widgets/Contacts';
import Login from './widgets/login/Login';
import Menu from './widgets/Menu';
import * as css from './App.m.css';

const factory = create({ theme });

export default factory(function App({ middleware: { theme } }) {
	if (!theme.get()) {
		theme.set(dojo);
	}

      // Se deben borrar los cookies aqui
//      document.cookie = "TOKEN_USER= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";


      return v('div', { classes: [css.root] }, [
            w(Menu, {}),
            v('div', [
                  w(Outlet, { key: 'home', id: 'home', renderer: () => w(Home, {}) }),
                  w(Outlet, { key: 'contact', id: 'contact', renderer: () => w(Contact, {}) }),      
                  w(Outlet, { key: 'contacts', id: 'contacts', renderer: () => w(Contacts, {}) }),   
                  w(Outlet, { key: 'vehicle', id: 'vehicle', renderer: () => w(Vehiculo, {}) }),         
                  w(Outlet, { key: 'vehicles', id: 'vehicles', renderer: () => w(Vehicles, {}) }),         
                  w(Outlet, { key: 'about', id: 'about', renderer: () => w(About, {}) }),
                  w(Outlet, { key: 'dashboard', id: 'dashboard', renderer: () => w(Dashboard, {}) }),
                  w(Outlet, { key: 'login', id: 'login', renderer: () => w(Login, {}) }),
                  w(Outlet, { key: 'fueling', id: 'fueling', renderer: () => w(Fueling, {}) }),
                  w(Outlet, { key: 'fuelinglog', id: 'fuelinglog', renderer: () => w(FuelingLog, {}) })
                  ])
            ]);
});