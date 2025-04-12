import { WithFieldValue } from "firebase/firestore";

export type WithFieldValueWithoutId<T> = WithFieldValue<Omit<T, "id">>;
