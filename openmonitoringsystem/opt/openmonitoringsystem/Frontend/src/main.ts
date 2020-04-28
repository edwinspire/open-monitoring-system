import renderer, { w } from '@dojo/framework/core/vdom';
import Registry from '@dojo/framework/core/Registry';
import { registerRouterInjector } from '@dojo/framework/routing/RouterInjector';
import '@dojo/themes/dojo/index.css';
import routes from './routes';
import App from './App';
import push from './push-notifications';
import GlobalComunicator from './widgets/GlobalComunicator';
const NoSleep = require('nosleep.js')
require('@fortawesome/fontawesome-free/css/all.css');

new push(); // Registra para recibir notificaciones push	

let gcom = new GlobalComunicator();
gcom.connect();
gcom.storeTest();

const noSleep = new NoSleep();
noSleep.enable();

const registry = new Registry();
registerRouterInjector(routes, registry);

const r = renderer(() => w(App, {}));
r.mount({ registry });
