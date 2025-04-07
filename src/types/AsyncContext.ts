export type ErrorType = Error | string | null | undefined;

export interface AsyncContext<T> {
	payload: T | null;
	loading: boolean;
	error: ErrorType;
}

export const createDefaultContext = <T>(): AsyncContext<T> => {
	return { payload: null, loading: true, error: null };
};
