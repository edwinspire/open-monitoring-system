import { w } from '@dojo/framework/core/vdom';
import WidgetBase from '@dojo/framework/core/WidgetBase';
import {auto} from '@dojo/framework/core/diff';
import {diffProperty} from '@dojo/framework/core/decorators/diffProperty';
import watch from '@dojo/framework/core/decorators/watch';
import SBar from '@dojo/widgets/snackbar';

export interface UserPreferencesPropertiesValue{
	name: string;
	value: any;
}

export interface UserPreferencesProperties {
	preference: UserPreferencesPropertiesValue;
	onchanged?(value: any): void;
}

export default class UserPreferences extends WidgetBase<UserPreferencesProperties> {

	@watch() private _openSnack = false;
	@watch() private _MsgSnackBar = '';
	private SnackBarType:"success" | "error" | undefined = 'error';

	constructor() {
		super();
		diffProperty('preference', auto, this.diffFooReaction)(this);
	}

	getLocalUser(){
		var r = {} as any;
		try{
			let localuser = localStorage.getItem('user');
			if(localuser){
				let json_localuser = JSON.parse(localuser);
				if(json_localuser){
					r = json_localuser;
				}
			}
		}catch(e){
			console.error(e);
		}
		console.log(r);
		return r;
	}

	diffFooReaction(previousProperty: any, newProperty: any) {
		console.log(newProperty);
		try{
			let json_localuser = this.getLocalUser();
			switch (newProperty.preference.name) {
				case "default_idvehicle":
				json_localuser.default_idvehicle = newProperty.preference.value;
				break;

				default:
				if(json_localuser && json_localuser.preferences){
					let pref = json_localuser.preferences;
					//console.log(pref, pref[newProperty.preference.name], newProperty.preference.value);
					if(pref[newProperty.preference.name] != newProperty.preference.value){
						pref[newProperty.preference.name] = newProperty.preference.value;
						json_localuser.preferences = pref;
						localStorage.setItem('user', JSON.stringify(json_localuser));
						this.Save();
					}else{
						console.log('No ha cambiado la preferencia')
					}
				}else{
					this.openSnack('La preferencia '+newProperty.preference.name+' no existe', 'error')			
				}
				break;
			}
		}catch(e){
			console.log(e);
			this.openSnack(e, 'error')			
		}
	}

	async Save(){
		var json_localuser = this.getLocalUser();
		if(json_localuser.preferences){
			let f = await fetch('/preferences_u', {
				method: 'POST',
				body: JSON.stringify(json_localuser),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			let data = await f.json();
			console.log(data);
			if(data.iduser && data.rowkey){
				json_localuser.rowkey = data.rowkey;
				localStorage.setItem('user', JSON.stringify(json_localuser));
			}
		}
	}

	openSnack(msg: string, type: "success" | "error" | undefined){
		this._openSnack = true;
		this._MsgSnackBar = msg;
		this.SnackBarType = type;
		setTimeout(()=>{
			this._openSnack = false;
		}, 4000)
	}

	protected render(){
		return w(SBar, {open: this._openSnack, leading: false, type: this.SnackBarType, messageRenderer: () => this._MsgSnackBar});
	}
}