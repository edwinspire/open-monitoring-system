/**
 * An interface for an object which provides a cancelable event API.  By calling the
 * `.preventDefault()` method on the object, the event should be cancelled and not
 * proceed any further
 */
export interface EventCancelableObject<T extends string, U> {
	/**
	 * Can the event be canceled?
	 */
	readonly cancelable: boolean;

	/**
	 * Was the event canceled?
	 */
	readonly defaultPrevented: boolean;

	/**
	 * Cancel the event
	 */
	preventDefault(): void;

	/**
	 * The target for the event
	 */
	readonly target: U;

	/**
	 * The type of the event
	 */
	readonly type: T;
}

export interface EventErrorObject<T> {
	/**
	 * The error that is the subject of this event
	 */
	readonly error: Error;

	/**
	 * The target for the event
	 */
	readonly target: T;

	/**
	 * The type of the event
	 */
	readonly type: 'error';
}

/**
 * The base event object, which provides a `type` property
 */
export interface EventObject {
	/**
	 * The type of the event
	 */
	readonly type: string;
}

/**
 * An event object which has a typed target
 */
export interface EventTargettedObject<T> {
	/**
	 * The target of the event
	 */
	readonly target: T;

	/**
	 * The type of the event
	 */
	readonly type: string;
}

/**
 * An event object which has a string literal type
 */
export interface EventTypedObject<T extends string> {
	/**
	 * The type of the event
	 */
	readonly type: T;
}

/**
 * A generic definition for a factory function which, given an optional set of options will
 * return an instance of the supplied generic type
 */
export interface Factory<T, O> {
	/**
	 * Create an instance
	 *
	 * @param options The options used to create the instance
	 */
	(options?: O): T;

	/**
	 * The prototype that will be used when constructing the instance
	 */
	prototype: T;
}

/**
 * Used for inserting an item into a posistion
 */
export type InsertPosition = number | 'first' | 'last' | 'before' | 'after';

/**
 * Used through the toolkit as a consistent API to manage how callers can "cleanup"
 * when doing a function.
 */
export interface Handle {
	/**
	 * Perform the destruction/cleanup logic associated with this handle
	 */
	destroy(): void;
}

/**
 * A general interface that can be used to renference a general index map of values of a particular type
 */
export interface Hash<T> {
	[ id: string ]: T;
}

/**
 * A base map of styles where each key is the name of the style attribute and the value is a string
 * which represents the style
 */
export interface StylesMap {
	[style: string]: string;
}
