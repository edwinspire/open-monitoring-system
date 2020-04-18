import { w } from '@dojo/framework/core/vdom';
import WidgetBase from '@dojo/framework/core/WidgetBase';
import {auto} from '@dojo/framework/core/diff';
import {diffProperty} from '@dojo/framework/core/decorators/diffProperty';
import Select from '@dojo/widgets/select';
import watch from '@dojo/framework/core/decorators/watch';

export interface SelectFromURLProperties {
	url: string;
	label: string;
	value: string;
	params?: any,
	onSelect?(OptionLabel: string, OptionValue: string, OptionDisabled: boolean): void;
}

export interface SelectOption{
	label: string;
	value: string;
	disabled: boolean;	
}

export default class SelectFromURL extends WidgetBase<SelectFromURLProperties> {

	private Options: SelectOption[] = [];
	private OptionsLabels: string[] = [];
	private OptionValue:string = '';

	@watch() private OptionLabel:string = '';

	constructor() {
		super();
		diffProperty('value', auto, this.diffFooReaction)(this);
	}

	diffFooReaction(previousProperty: any, newProperty: any) {
		this.internalValue = newProperty.value;
	}


	get internalValue(): string {
		return this.OptionValue;
	}

	set internalValue(newValue: string) {
		console.log('Set value ', newValue, newValue.length);
		if (newValue) {
			this.Options.forEach((option, index)=>{
				if(option.value == newValue){
					this.OptionValue = option.value;
					this.OptionLabel = option.label;
					this.properties.onSelect && this.properties.onSelect(option.label, option.value, option.disabled);					
				}
			});			
		}else{
			console.log(newValue+" is not valid.");
		}
	}


	public async onAttach(){
		try{
			let f = await fetch(this.properties.url, {method: 'POST', body: JSON.stringify(this.properties.params),	headers: {'Content-Type': 'application/json'}});
			if(f.status == 200){
				let d = await f.json();
				this.Options = d as SelectOption[];
				this.OptionsLabels = [];
				await this.Options.forEach((option, index)=>{
					this.OptionsLabels.push(option.label);
					if(this.Options.length == index+1){
						this.internalValue = this.properties.value;
						console.log('Invalida para volver a renderisar.');
						this.invalidate();
					}
				});
			}else if(f.status == 401){
				window.location.href = "/#login";
			}
		}catch(e){
			console.log(e);
			this.invalidate();
		}
	}


	protected render(){
		return w(Select, {
			label: this.properties.label,
			options: this.OptionsLabels,
			useNativeElement: true,
			key: 'simple',
			value: this.OptionLabel,
			onChange: (d: string)=>{
				console.log(this.Options, d);
				this.Options.forEach((option, index)=>{
					if(option.label == d){
						this.internalValue = option.value;
					}
				});
			}
		}, []);
	}
}