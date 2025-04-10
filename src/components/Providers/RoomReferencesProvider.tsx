import { RoomReferencesContext } from "@contexts/RoomReferencesContext";
import { useRoomReferences } from "@hooks/useRoomReferences";
import { ErrorType } from "../../types/AsyncContext"; // TODO: @types ?
import { getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { ReactNode, useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import { ErrorDisplay } from "@components/ErrorDisplay";

export function RoomReferencesProvider({ children, roomId, memberId }: { children: ReactNode, roomId: string, memberId?: string }) {
	// Hooks
	const roomReferences = useRoomReferences(roomId, memberId);
	// States
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<ErrorType | null>(null);
	// Effects
	useEffect(() => {
		// HACK
		// Ensures that the room document is created before rendering the children.
		// This is necessary because the room document is created in the useRoomReferences hook,
		// but we need to wait for it to be created before rendering the children.
		// NOTE: memberId must be defined to ensure authorization.
		if (roomReferences?.room && memberId) {
			getDoc(roomReferences.room).then((doc) => {
				if (doc.exists()) {
					setLoading(false)
				} else {
					setDoc(roomReferences.room, {
						createdAt: serverTimestamp(),
					}).then(() => {
						setLoading(false);
						setError(null);
					}).catch((err: ErrorType) => setError(err));
				}
			}).catch((err: ErrorType) => setError(err));
		}
	}, [roomReferences?.room])

	if (error) return <ErrorDisplay error={error} />;
	return loading
		? <Skeleton />
		: <RoomReferencesContext.Provider value={roomReferences}>{children}</RoomReferencesContext.Provider>
};