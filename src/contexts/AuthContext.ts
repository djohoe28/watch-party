import { AsyncContext, createDefaultContext } from "../types/AsyncContext"; // LINT: @types ?
import { User } from "firebase/auth";
import { createContext } from "react";


export const AuthContext = createContext<AsyncContext<User>>(createDefaultContext());
