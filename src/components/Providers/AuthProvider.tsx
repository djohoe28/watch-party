import { ErrorDisplay } from "@components/Utilities/ErrorDisplay";
import { AuthContext } from "@contexts/AuthContext";
import { useAuthState } from "@hooks/useAuthState";
import { Skeleton } from "@mui/material";
import { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
	// Hooks
	const { payload: authContext, loading, error } = useAuthState();

	if (error) return <ErrorDisplay error={error} />;
	return loading ? <Skeleton /> : <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
}