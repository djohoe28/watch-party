export type ErrorType = /* Error | string | null | undefined | */ unknown;

export interface AsyncContext<T> {
	payload: T | undefined;
	loading: boolean;
	error: ErrorType;
}
