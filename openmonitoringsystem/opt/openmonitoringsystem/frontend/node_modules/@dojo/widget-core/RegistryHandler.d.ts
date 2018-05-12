import { Evented } from '@dojo/core/Evented';
import { EventObject } from '@dojo/core/interfaces';
import { Constructor, RegistryLabel, WidgetBaseInterface } from './interfaces';
import { Registry, RegistryItem } from './Registry';
import { Injector } from './Injector';
export interface RegistryHandlerEventMap {
    invalidate: EventObject<'invalidate'>;
}
export declare class RegistryHandler extends Evented<RegistryHandlerEventMap> {
    private _registry;
    private _registryWidgetLabelMap;
    private _registryInjectorLabelMap;
    protected baseRegistry?: Registry;
    constructor();
    base: Registry;
    define(label: RegistryLabel, widget: RegistryItem): void;
    defineInjector(label: RegistryLabel, injector: Injector): void;
    has(label: RegistryLabel): boolean;
    hasInjector(label: RegistryLabel): boolean;
    get<T extends WidgetBaseInterface = WidgetBaseInterface>(label: RegistryLabel, globalPrecedence?: boolean): Constructor<T> | null;
    getInjector<T extends Injector>(label: RegistryLabel, globalPrecedence?: boolean): T | null;
    private _get(label, globalPrecedence, getFunctionName, labelMap);
}
export default RegistryHandler;
