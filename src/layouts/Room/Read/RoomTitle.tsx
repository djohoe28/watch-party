import { RoomDataContext } from "@contexts/RoomDataContext";
import { Skeleton, Typography } from "@mui/material";
import { useContext } from "react";

export function RoomTitle() {
	// Contexts
	const roomDataContext = useContext(RoomDataContext);
	return !roomDataContext
		? <Skeleton />
		: <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
			{roomDataContext.title ?? "Untitled Room"}
		</Typography>
}