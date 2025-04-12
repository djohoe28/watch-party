import { ErrorDisplay } from "@components/ErrorDisplay";
import { Skeleton, Typography } from "@mui/material";
import { useContext, useMemo } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { RoomReferencesContext } from "@contexts/RoomReferencesContext";

export function RoomTitle() {
	// Contexts
	const roomRefsContext = useContext(RoomReferencesContext);
	// Memos (Derived Contexts)
	const roomRef = useMemo(() => roomRefsContext?.room, [roomRefsContext?.room]);
	// Hooks
	const [documentData, documentLoading, documentError /* , _ */] = useDocumentData(roomRef);

	if (documentError) return <ErrorDisplay error={documentError} />;
	return documentLoading
		? <Skeleton />
		: <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
			{documentData?.title ?? "Untitled Room"}
		</Typography>
}