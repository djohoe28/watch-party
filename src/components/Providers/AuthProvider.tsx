import { ReactNode } from "react";
import AuthContext from "../../contexts/AuthContext";
import { useAuthState } from "../../hooks/useAuthState";

export function AuthProvider({ children }: { children: ReactNode }) {
	const authContext = useAuthState();
	return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
}