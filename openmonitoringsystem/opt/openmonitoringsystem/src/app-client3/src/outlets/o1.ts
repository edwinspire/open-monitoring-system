import { Outlet } from '@dojo/routing/Outlet';

import Banner from './../widgets/o1';

export const BannerOutlet = Outlet({ index: Banner }, 'home1');

export default BannerOutlet;
