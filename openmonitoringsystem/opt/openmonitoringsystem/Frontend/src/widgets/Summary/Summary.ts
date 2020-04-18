import { v, w } from '@dojo/framework/core/vdom';
import WidgetBase from '@dojo/framework/core/WidgetBase';
import * as css from './Summary.m.css';;
import Card from '@dojo/widgets/card';
import Icon from '.././Icon/Icon';


export default class Summary extends WidgetBase {

	private TotalContacts:string = '0';
	private TotalVehicles:string = '0';

	async onAttach() {
		const res = await fetch("/summary",{method: 'POST', body: JSON.stringify({idaccount: localStorage.getItem('idaccount')}), headers: {'Content-Type': 'application/json'}});
		console.log(res);
		if(res.status == 200){
			let data = await res.json();
			if(data){
				this.TotalContacts = data.TotalContacts;
				this.TotalVehicles = data.TotalVehicles;
				this.invalidate(); 
			}
		}else if(res.status == 401){
			window.location.href = "/#login";
		}

	}

	protected render(){
		return v('div', { classes: css.container }, [ 
			v('div', {classes: [css.row]}, [
				v('div', {classes: [css.column]}, [
					w(Card, {}, [
						w(Icon, {label: 'CONTACTS', classes: ['fas', 'fa-users'], ShowLabel: true, onClick:()=>{
							window.location.href = "/#contacts";
						}}),
						'Hay '+this.TotalContacts+' contactos'
						])
					]),
				v('div', {classes: [css.column]}, [
					w(Card, {}, [
						w(Icon, {label: 'VEHÍCULOS', classes: ['fas', 'fa-car-side'], ShowLabel: true, onClick:()=>{
							window.location.href = "/#vehicles";
						}}),
						'Hay '+this.TotalVehicles+' Vehículos'
						])
					])


				])
			]);
	}
}