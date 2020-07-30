import {
    writable
} from 'svelte/store';

export const User = writable();
export const IdAccount = writable();
export const IdVehicle = writable();

export class APPLocalStorage{
getUser(){
    return JSON.parse(localStorage.getItem('User'));
}
getPreferences(){
    return this.getUser().preferences;
}

setUser(user){
    localStorage.setItem('User', JSON.stringify(user));
}

}
//export const IdVehicle = writable();