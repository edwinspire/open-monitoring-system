/**
 * The interfaces to the `@dojo/loader` AMD loader
 */

export interface Config {
	/**
	 * The base URL that the loader will use to resolve modules
	 */
	baseUrl?: string;

	/**
	 * A map of module identifiers and their replacement meta data
	 */
	map?: ModuleMap;

	/**
	 * An array of packages that the loader should use when resolving a module ID
	 */
	packages?: Package[];

	/**
	 * A map of paths to use when resolving modules names
	 */
	paths?: { [ path: string ]: string; };

	/**
	 * A map of packages that the loader should use when resolving a module ID
	 */
	pkgs?: { [ path: string ]: Package; };
}

export interface Define {
	/**
	 * Define a module
	 *
	 * @param moduleId the MID to use for the module
	 * @param dependencies an array of MIDs this module depends upon
	 * @param factory the factory function that will return the module
	 */
	(moduleId: string, dependencies: string[], factory: Factory): void;

	/**
	 * Define a module
	 *
	 * @param dependencies an array of MIDs this module depends upon
	 * @param factory the factory function that will return the module
	 */
	(dependencies: string[], factory: Factory): void;

	/**
	 * Define a module
	 *
	 * @param factory the factory function that will return the module
	 */
	(factory: Factory): void;

	/**
	 * Define a module
	 *
	 * @param value the value for the module
	 */
	(value: any): void;

	/**
	 * Meta data about this particular AMD loader
	 */
	amd: { [prop: string]: string | number | boolean };
}

export interface Factory {
	/**
	 * The module factory
	 *
	 * @param modules The arguments that represent the resolved versions of the module dependencies
	 */
	(...modules: any[]): any;
}

export interface Has {
	/**
	 * Determine if a feature is present
	 *
	 * @param name the feature name to check
	 */
	(name: string): any;

	/**
	 * Register a feature test
	 *
	 * @param name The name of the feature to register
	 * @param value The test for the feature
	 * @param now If `true` the test will be executed immediatly, if not, it will be lazily executed
	 * @param force If `true` the test value will be overwritten if already registered
	 */
	add(name: string, value: (global: Window, document?: HTMLDocument, element?: HTMLDivElement) => any,
		now?: boolean, force?: boolean): void;
	add(name: string, value: any, now?: boolean, force?: boolean): void;
}

export interface ModuleMap extends ModuleMapItem {
	[ sourceMid: string ]: ModuleMapReplacement;
}

export interface ModuleMapItem {
	[ mid: string ]: any;
}

export interface ModuleMapReplacement extends ModuleMapItem {
	[ findMid: string ]: string;
}

export interface Package {
	/**
	 * The path to the root of the package
	 */
	location?: string;

	/**
	 * The main module of the package (defaults to `main.js`)
	 */
	main?: string;

	/**
	 * The package name
	 */
	name?: string;
}

export interface Require {
	/**
	 * Resolve a list of module dependencies and pass them to the callback
	 *
	 * @param dependencies The array of MIDs to resolve
	 * @param callback The function to invoke with the resolved dependencies
	 */
	(dependencies: string[], callback: RequireCallback): void;

	/**
	 * Resolve and return a single module (compatability with CommonJS `require`)
	 *
	 * @param moduleId The module ID to resolve and return
	 */
	<ModuleType>(moduleId: string): ModuleType;

	/**
	 * Take a relative MID and return an absolute MID
	 *
	 * @param moduleId The relative module ID to resolve
	 */
	toAbsMid(moduleId: string): string;

	/**
	 * Take a path and resolve the full URL for the path
	 *
	 * @param path The path to resolve and return as a URL
	 */
	toUrl(path: string): string;
}

export interface RequireCallback {
	/**
	 * The `require` callback
	 *
	 * @param modules The arguments that represent the resolved versions of dependencies
	 */
	(...modules: any[]): void;
}

export interface RootRequire extends Require {
	/**
	 * The minimalist `has` API integrated with the `@dojo/loader`
	 */
	has: Has;

	/**
	 * Register an event listener
	 *
	 * @param type The event type to listen for
	 * @param listener The listener to call when the event is emitted
	 */
	on(type: SignalType, listener: any): { remove: () => void };

	/**
	 * Configure the loader
	 *
	 * @param config The configuration to apply to the loader
	 */
	config(config: Config): void;

	/**
	 * Return internal values of loader for debug purposes
	 *
	 * @param name The name of the internal label
	 */
	inspect?(name: string): any;

	/**
	 * If running in the node environment, a reference to the original NodeJS `require`
	 */
	nodeRequire?(id: string): any;

	/**
	 * Undefine a module, based on absolute MID that should be removed from the loader cache
	 */
	undef(moduleId: string): void;
}

/**
 * The signal type for the `require.on` API
 */
export type SignalType = 'error';
