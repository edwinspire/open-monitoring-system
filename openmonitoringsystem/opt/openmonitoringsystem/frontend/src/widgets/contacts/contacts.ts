// import { DNode } from '@dojo/widget-core/interfaces';
import theme from '@dojo/themes/dojo';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import  Button  from '@dojo/widgets/button';
import { w, v } from '@dojo/widget-core/d';
//import * as css from './styles/contacts.m.css';
import  Calendar  from '@dojo/widgets/calendar';

export default class Contacts extends WidgetBase {


	protected render() {

		return v('div', {}, ["Hola mundo W", 
w(Button, {theme, 
	type: 'submit',
	key: 'b1',
	value: 'foo'
}, [ 'Submit' ]),

w(Calendar, {theme
	//month: this.state.month,
	//selectedDate: this.state.selectedDate,
	//year: this.state.year,
	//onMonthChange: (month: number) => { this.setState({ 'month': month }); },
	//onYearChange: (year: number) => { this.setState({ 'year': year }); },
	
})


			]
			);
	}
}
