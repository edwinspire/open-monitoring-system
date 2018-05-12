import { Evented } from '@dojo/core/Evented';
import { EventObject } from '@dojo/core/interfaces';
export interface InjectorEventMap {
    invalidate: EventObject<'invalidate'>;
}
export declare class Injector<T = any> extends Evented<InjectorEventMap> {
    private _payload;
    constructor(payload: T);
    get(): T;
    set(payload: T): void;
}
export default Injector;
