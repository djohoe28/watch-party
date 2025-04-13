import { ErrorDisplay } from "@components/Utilities/ErrorDisplay";
import { RoomDataContext } from "@contexts/RoomDataContext";
import { RoomDocumentReference } from "@models/DB/RoomDocument.model";
import { Skeleton } from "@mui/material";
import { ReactNode } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";

export function RoomDataProvider({ children, roomRef }: { children: ReactNode, roomRef: RoomDocumentReference | undefined }) {
	// Hooks
	const [data, loading, error] = useDocumentData(roomRef);

	if (error) return <ErrorDisplay error={error} />;
	return loading
		? <Skeleton />
		: <RoomDataContext.Provider value={data}>{children}</RoomDataContext.Provider>
};