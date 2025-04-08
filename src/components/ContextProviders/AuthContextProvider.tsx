import { ReactNode } from "react";
import AuthContext from "../../contexts/AuthContext";
import { useAuthState } from "../../hooks/useAuthState";

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
	const authContext = useAuthState();
	return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
}