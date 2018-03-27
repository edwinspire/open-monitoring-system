/**
 * ArrayLike represents a generic object which has a `length` and is number index based
 */
export interface ArrayLike<T> {
	length: number;
	[n: number]: T;
}

/**
 * Thenable represents any object with a callable `then` property.
 */
export interface Thenable<T> {
	then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
	then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => void): Thenable<U>;
}
