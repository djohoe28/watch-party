import { Alert, Skeleton, Typography } from "@mui/material"
import { useContext, useMemo } from "react";
import { RoomReferencesContext } from "../contexts/RoomReferencesContext";
import { useDocumentData } from "react-firebase-hooks/firestore";

export const RoomTitle = () => {
	// Contexts
	const roomRefsContext = useContext(RoomReferencesContext);
	// Memos (Derived Contexts)
	const roomRef = useMemo(() => roomRefsContext?.room, [roomRefsContext?.room]);
	// Hooks
	const [documentData, documentLoading, documentError, _] = useDocumentData(roomRef);

	if (documentError) return <Alert severity="error">{documentError.toString()}</Alert>;
	return documentLoading
		? <Skeleton />
		: <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
			{documentData?.title}
		</Typography>
}