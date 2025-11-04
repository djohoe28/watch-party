import { ErrorType } from "@mytypes/ErrorType";

export interface AsyncContext<T> {
	payload: T | undefined;
	loading: boolean;
	error: ErrorType;
}
