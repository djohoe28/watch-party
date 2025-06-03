import { AuthUserContext } from "@contexts/AuthContext";
import { useAuthState } from "@hooks/useAuthState";
import { ErrorDisplay } from "@layouts/components/ErrorDisplay";
import { Skeleton } from "@mui/material";
import { ReactNode } from "react";

export function AuthUserProvider({ children }: { children: ReactNode }) {
	// Hooks
	const { payload: authUser, loading, error } = useAuthState();

	if (error) return <ErrorDisplay error={error} />;
	return loading ? <Skeleton /> : <AuthUserContext.Provider value={authUser}>{children}</AuthUserContext.Provider>;
}