import { AuthContext } from "@contexts/AuthContext";
import { useAuthState } from "@hooks/useAuthState";
import { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
	const authContext = useAuthState();
	return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
}