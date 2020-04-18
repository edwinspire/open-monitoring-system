import { w } from '@dojo/framework/core/vdom';
import WidgetBase from '@dojo/framework/core/WidgetBase';
//import {auto} from '@dojo/framework/core/diff';
//import {diffProperty} from '@dojo/framework/core/decorators/diffProperty';
import Lb from '@dojo/widgets/listbox';
//import watch from '@dojo/framework/core/decorators/watch';

interface CustomOption {
	disabled?: boolean;
	label?: string;
	selected?: boolean;
	value: string;
}

export interface SelectFromURLProperties {
	url: string;
	label: string;
	value: string;
	params?: any,
	onSelect?(OptionLabel: string, OptionValue: string, OptionDisabled: boolean): void;
}

export default class SelectFromURL extends WidgetBase<SelectFromURLProperties> {

	private Options: CustomOption[] = [];
	//private OptionsLabels: string[] = [];
	private _Index: number = 0;
//	private OptionValue:string = '';

//	@watch() private OptionLabel:string = '';

	constructor() {
		super();
//		diffProperty('value', auto, this.diffFooReaction)(this);
	}

/*
	diffFooReaction(previousProperty: any, newProperty: any) {
		this.internalValue = newProperty.value;
	}
*/
/*
	get internalValue(): string {
		return this.OptionValue;
	}
*/
/*
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
	*/


	public async onAttach(){
		try{
			let f = await fetch(this.properties.url, {method: 'POST', body: JSON.stringify(this.properties.params),	headers: {'Content-Type': 'application/json'}});
			if(f.status == 200){
				let d = await f.json();
				this.Options = d as CustomOption[];
				//this.OptionsLabels = [];
				console.log(this.Options);
				await this.Options.forEach((option, index)=>{
					//this.OptionsLabels.push(option.label);
					if(this.Options.length == index+1){
						//this.internalValue = this.properties.value;
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
		return w(Lb, {
			key: 'listbox2',
			activeIndex: this._Index,
			widgetId: 'listbox2',
			optionData: this.Options,
			multiselect: false,
			getOptionLabel: (option: CustomOption) => option.label,
			getOptionDisabled: (option: CustomOption) => !!option.disabled,
			getOptionSelected: (option: CustomOption) => !!option.selected,
			onActiveIndexChange: (index: number) => {
				this._Index = index;
				this.invalidate();
			},
			onOptionSelect: (option: any, index: number) => {
				this.Options[index].selected = !this.Options[index].selected;
				this.Options = [...this.Options];
				this.invalidate();
			}
		}, []);
	}
}