import { WithFieldValue } from "firebase/firestore";

export type WithFieldValueWithoutMetadata<T> = WithFieldValue<Omit<T, "id" | "ref">>;
