import { User } from "firebase/auth";
import { createContext } from "react";
import { AsyncContext, createDefaultContext } from "../types/AsyncContext"; // LINT: @types ?

export const AuthContext = createContext<AsyncContext<User>>(
	createDefaultContext()
);
