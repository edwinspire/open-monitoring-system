import { Outlet } from '@dojo/routing/Outlet';

import Login from './login';

export const LoginOutlet = Outlet({ index: Login }, 'login');

export default LoginOutlet;
