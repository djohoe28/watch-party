import { ErrorDisplay } from "@components/Utilities/ErrorDisplay";
import { RoomDataContext } from "@contexts/RoomDataContext";
import { RoomReferencesContext } from "@contexts/RoomReferencesContext";
import { Skeleton } from "@mui/material";
import { ReactNode, useContext, useMemo } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";

export function RoomDataProvider({ children }: { children: ReactNode }) {
	// Contexts
	// HACK: Nested Context, but otherwise you need another Room wrapper...
	const roomRefsContext = useContext(RoomReferencesContext);
	const roomRef = useMemo(() => roomRefsContext?.room, [roomRefsContext?.room]);
	// Hooks
	const [data, loading, error] = useDocumentData(roomRef); // TODO: { snapshotOptions: { serverTimestamps: "estimate" } } ?

	if (error) return <ErrorDisplay error={error} />;
	return loading
		? <Skeleton />
		: <RoomDataContext.Provider value={data}>{children}</RoomDataContext.Provider>
};