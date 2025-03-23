import { User } from "firebase/auth";
import { createContext, ReactNode } from "react";
import { AsyncContext, createDefaultContext } from "../types/AsyncContext";
import { useAuthState } from "../hooks/useAuthState";

const UserContext = createContext<AsyncContext<User>>(createDefaultContext());

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
	const userContext = useAuthState();
	return <UserContext.Provider value={userContext}>{children}</UserContext.Provider>;
}

export default UserContext;