import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import Master from './widgets/login/login';
import { Registry } from '@dojo/widget-core/Registry';
import { registerRouterInjector } from '@dojo/routing/RouterInjector';

const root = document.querySelector('my-app') || undefined;

const routingConfig = [
	{
		path: 'directory',
		outlet: 'directory',
		children: [
			{
				path: '{filter}',
				outlet: 'filter'
			}
		]
	},
	{
		path: 'new-worker',
		outlet: 'new-worker',
		defaultRoute: true
	},
	{
		path: '/',
		outlet: 'home1'
	}
];


const registry = new Registry();
registerRouterInjector(routingConfig, registry);

const Projector = ProjectorMixin(Master);
const projector = new Projector();
projector.setProperties({ registry });
// By default, append() will attach the rendered content to document.body.  To insert this application
// into existing HTML content, pass the desired root node to append().
projector.append(root);
