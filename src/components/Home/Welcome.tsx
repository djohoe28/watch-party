import { AuthContext } from "@contexts/AuthContext";
import { Alert, Skeleton, Typography } from "@mui/material";
import { useContext } from "react";

export function Welcome() {
	const authContext = useContext(AuthContext);
	if(!authContext) return <Alert severity="error">Failed to authorize User.</Alert>;
	return authContext.loading ? <Skeleton /> : <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
			Welcome, {authContext?.payload?.isAnonymous ? "Anonymous" : authContext?.payload?.displayName}!
		</Typography>
}