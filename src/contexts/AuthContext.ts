import { User } from "firebase/auth";
import { createContext } from "react";
import { AsyncContext, createDefaultContext } from "../types/AsyncContext";

const AuthContext = createContext<AsyncContext<User>>(createDefaultContext());

export default AuthContext;