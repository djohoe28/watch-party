import { Skeleton, Typography } from "@mui/material"
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { useRoomDocumentData } from "../hooks/useRoomDocumentData";
import { RoomDocumentReferenceContext } from "../contexts/RoomDocumentReferenceContext";

export const RoomTitle = () => {
	const authContext = useContext(AuthContext); // TODO: Use User instead of UserID?
	const roomRef = useContext(RoomDocumentReferenceContext);
	const roomDocument = useRoomDocumentData(roomRef);
	return <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
		{roomDocument.loading ? <Skeleton /> : roomDocument.error ? roomDocument.error.toString() : roomDocument.data?.title}
		{authContext.payload && ` (${authContext.payload?.uid})`}
	</Typography>
}