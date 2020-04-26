export default [
{
	path: 'home',
	outlet: 'home'
},
{
	path: 'contact',
	outlet: 'contact'
},
{
	path: 'contacts',
	outlet: 'contacts'
},
{
	path: 'vehicle',
	outlet: 'vehicle'
},
{
	path: 'vehicles',
	outlet: 'vehicles'
},
{
	path: 'about/{page}',
	outlet: 'about',
	defaultParams: {
		page: 'about'
	}
},
{
	path: 'fueling',
	outlet: 'fueling'
},
{
	path: 'fuelinglog',
	outlet: 'fuelinglog'
},
{
	path: 'dashboard',
	outlet: 'dashboard'
},
{
	path: 'login',
	outlet: 'login',
	defaultRoute: true
},
{
	path: 'register',
	outlet: 'register'
},
{
	path: 'account_activation',
	outlet: 'account_activation'
}
];
