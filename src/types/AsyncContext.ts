export type ErrorType = /* Error | string | null | undefined | */ unknown;

export interface AsyncContext<T> {
	payload: T | null;
	loading: boolean;
	error: ErrorType;
}
