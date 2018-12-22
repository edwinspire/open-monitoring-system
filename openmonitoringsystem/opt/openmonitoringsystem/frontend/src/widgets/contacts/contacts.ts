// import { DNode } from '@dojo/widget-core/interfaces';
import theme from '@dojo/themes/dojo';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import  Button  from '@dojo/widgets/button';
import { w, v } from '@dojo/widget-core/d';
//import * as css from './styles/contacts.m.css';
import  Calendar  from '@dojo/widgets/calendar';

/*
import { ProjectorMixin } from '@dojo/framework/widget-core/mixins/Projector';
import { createFetcher } from '@dojo/widgets/grid/utils';
import Grid from '@dojo/widgets/grid';



const columnConfig = [
	{
		id: 'one',
		title: 'Column One',
		sortable: true,
		filterable: true
	},
	{
		id: 'two',
		title: 'Column Two'
	}
];

const gridData: any[] = [
	{ one: '0', two: '0' },
	{ one: '1', two: '1' },
	{ one: '2', two: '2' },
	{ one: '3', two: '3' },
	{ one: '4', two: '4' },
	{ one: '5', two: '5' },
	{ one: '6', two: '6' }
];


const Projector = ProjectorMixin(Grid);
const projector = new Projector();
projector.setProperties({
	columnConfig,
	fetcher: createFetcher(gridData)
});
projector.append();

*/


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
