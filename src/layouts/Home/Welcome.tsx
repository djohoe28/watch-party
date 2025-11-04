import { AuthUserContext } from "@contexts/AuthContext";
import { Typography } from "@mui/material";
import { useContext } from "react";

export function Welcome() {
	const authContext = useContext(AuthUserContext);
	return <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
		Welcome, {authContext?.isAnonymous ? "Anonymous" : authContext?.displayName}!
	</Typography>
}