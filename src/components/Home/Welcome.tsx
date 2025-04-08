import { AuthContext } from "@contexts/AuthContext";
import { Typography } from "@mui/material";
import { useContext } from "react";

export function Welcome() {
	const authContext = useContext(AuthContext);
	return <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
			Welcome, {!authContext.payload ? "Guest" : authContext?.payload?.isAnonymous ? "Anonymous" : authContext?.payload?.displayName}!
		</Typography>
}