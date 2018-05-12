// import { DNode } from '@dojo/widget-core/interfaces';
import {  theme } from '@dojo/widget-core/mixins/Themed';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import * as css from './styles/menu.m.css';
import { Link } from '@dojo/routing/Link';


@theme(css)
export default class Menu extends WidgetBase {
	protected render() {
		return v('div', {}, [
			v('input', {type:"radio", name:"sn_menu", id:"sn_mXX", class: "ipXX"}),
			v('input', {type:"radio", name:"sn_menu", id:"sn_m00", class: "ip00"}),
			v('input', {type:"radio", name:"sn_menu", id:"sn_m01", class: "ip00 ip01"}),
			v('input', {type:"radio", name:"sn_menu", id:"sn_m02", class: "ip00 ip02"}),
			v('input', {type:"radio", name:"sn_menu", id:"sn_m03", class: "ip00 ip02 ip03"}),
			v('input', {type:"radio", name:"sn_menu", id:"sn_m04", class: "ip00 ip02 ip03 ip04"}),
			v('input', {type:"radio", name:"sn_menu", id:"sn_m05", class: "ip00 ip02 ip05"}),
			v('input', {type:"radio", name:"sn_menu", id:"sn_m06", class: "ip00 ip02 ip06"}),
			v('input', {type:"radio", name:"sn_menu", id:"sn_m07", class: "ip00 ip07"}),
			v('input', {type:"radio", name:"sn_menu", id:"sn_m08", class: "ip00 ip08"}),
			v('input', {type:"radio", name:"sn_menu", id:"sn_m09", class: "ip00 ip08 ip09"}),
			v('input', {type:"radio", name:"sn_menu", id:"sn_m10", class: "ip00 ip08 ip09 ip10"}),
			v('input', {type:"radio", name:"sn_menu", id:"sn_m11", class: "ip00 ip08 ip11"}),
			v('div', {id: "sn_menu_icon"}, [
				v('label', {classes:css.sn_menu_open, for:"sn_m00", title:"Menu"}, [
					v('div', {classes:css.bar}, [])
					]),
				v('label', {classes:css.sn_menu_close, for:"sn_mXX"}, [])
				]),

			v('div', {id: "sn_menu_panel"}, [
				v('div', {id: "sn_menu_left"}, [
					v('h1', {}, ['SKY']),
					v('div', {id:'social'}, [
						v('a', {href:"https://www.facebook.com/StuCSSplay"}, [v('i', {class:"fa fa-facebook social"})]),
						v('a', {href:"https://www.twitter.com/StuCSSplay"}, [v('i', {class:"fa fa-twitter social"})])
						]),
					v('p', {}, [w(Link, { key: 'directory', to: 'directory'}, ['Link router'])]),
					v('p', {}, ['edwinspire'])
					]),

				v('div', {id: "sn_menu_right"}, [
					v('div', {id:"sn_menu"}, [
						v('p', {}, [v('a', {href:"http://www.cssplay.co.uk/menus/index.html"}, ['Home'])]),
						v('p', {classes: css.sn_m01}, [
							v('label', {for:'sn_m01'}, ['Contactenos']),
							v('label', {for:'sn_m00'}, [])
							]),
						v('div', {}, [
							v('p', {}, [v('a', {href:"https://www.facebook.com/StuCSSplay"}, ['Email'])]),
							v('p', {}, [v('a', {href:"https://www.facebook.com/StuCSSplay"}, ['Telefono'])]),
							v('p', {}, [w(Link, { key: 'Login', to: 'Login'}, ['Prueba Login'])]),
							v('p', {}, [v('a', {href:"https://www.facebook.com/StuCSSplay"}, ['Direccion'])])
							]),
						v('p', {classes: css.sn_m02}, [
							v('label', {for: 'sn_m02'}, ['Resolte']),
							v('label', {for: 'sn_m00'}, [])
							]),

						v('div', {}, [
							v('p', {}, [v('a', {href:"https://www.facebook.com/StuCSSplay"}, ['Ski Hire Facilities'])]),
							v('p', {classes: css.sn_m03}, [
								v('label', {for:'sn_m03'}, ['Main Ski Slopes']),
								v('label', {for:'sn_m02'}, [])
								]),

							v('div', {}, [
								v('p', {}, [v('a', {href:"http://www.cssplay.co.uk/menus/index.html"}, ['Beginners Slopes'])]),
								v('p', {}, [v('a', {href:"http://www.cssplay.co.uk/menus/index.html"}, ['Intermediate Slopes'])]),
								v('p', {classes: css.sn_m04}, [
									v('label', {for:'sn_m04'}, ['Advanced Levels']),
									v('label', {for:'sn_m03'}, [])
									]),
								v('div', {}, [
									v('p', {}, [v('a', {href:"https://www.facebook.com/StuCSSplay"}, ['Local'])]),
									v('p', {}, [v('a', {href:"https://www.facebook.com/StuCSSplay"}, ['Nearby'])]),
									v('p', {}, [v('a', {href:"https://www.facebook.com/StuCSSplay"}, ['With instructor'])]),
									v('p', {}, [v('a', {href:"https://www.facebook.com/StuCSSplay"}, ['Snow'])])
									]),
								v('p', {}, [v('a', {href:"https://www.facebook.com/StuCSSplay"}, ['Expert'])])
								]),
							v('p', {}, [v('a', {href:"https://www.facebook.com/StuCSSplay"}, ['Night Life'])]),
							v('p', {classes: css.sn_m05}, [
								v('label', {for:'sn_m05'}, ['Restaurants']),
								v('label', {for:'sn_m02'}, [])
								]),

							v('div', {}, [
								v('p', {}, [v('a', {href:"https://www.facebook.com/StuCSSplay"}, ['Snow Hotel'])]),
								v('p', {}, [v('a', {href:"https://www.facebook.com/StuCSSplay"}, ['The Snowman'])]),
								v('p', {}, [v('a', {href:"https://www.facebook.com/StuCSSplay"}, ['Ice Cavern'])]),
								v('p', {}, [v('a', {href:"https://www.facebook.com/StuCSSplay"}, ['Ski Inn'])])
								]),
							v('p', {classes: css.sn_m06}, [
								v('label', {for:'sn_m06'}, ['Car Hire']),
								v('label', {for:'sn_m02'}, [])
								]),
							v('div', {}, [
								v('p', {}, [v('a', {href:"https://www.facebook.com/StuCSSplay"}, ['From Airport'])]),
								v('p', {}, [v('a', {href:"https://www.facebook.com/StuCSSplay"}, ['In Resort'])]),
								v('p', {}, [v('a', {href:"https://www.facebook.com/StuCSSplay"}, ['Mutiple Resorts'])])
								])
							]),
						v('p', {}, [v('a', {href:"https://www.facebook.com/StuCSSplay"}, ['Privacy'])])
						])
					])
				])





			]);
}
}
