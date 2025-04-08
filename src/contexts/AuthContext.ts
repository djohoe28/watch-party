import { User } from "firebase/auth";
import { createContext } from "react";
import { AsyncContext, createDefaultContext } from "../types/AsyncContext";

export const AuthContext = createContext<AsyncContext<User>>(createDefaultContext());
