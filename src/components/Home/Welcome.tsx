import { ErrorDisplay } from "@components/Utilities/ErrorDisplay";
import { AuthContext } from "@contexts/AuthContext";
import { Skeleton, Typography } from "@mui/material";
import { useContext } from "react";

export function Welcome() {
	const authContext = useContext(AuthContext);
	if (authContext.error) return <ErrorDisplay error={authContext.error} />;
	return authContext.loading ? <Skeleton /> : <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
		Welcome, {authContext?.payload?.isAnonymous ? "Anonymous" : authContext?.payload?.displayName}!
	</Typography>
}