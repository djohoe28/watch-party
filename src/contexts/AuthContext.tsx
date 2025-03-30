import { User } from "firebase/auth";
import { createContext, ReactNode } from "react";
import { AsyncContext, createDefaultContext } from "../types/AsyncContext";
import { useAuthState } from "../hooks/useAuthState";

const AuthContext = createContext<AsyncContext<User>>(createDefaultContext());

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
	const authContext = useAuthState();
	return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
}

export default AuthContext;