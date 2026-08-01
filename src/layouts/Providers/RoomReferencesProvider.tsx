import { RoomReferencesContext } from "@contexts/RoomReferencesContext";
import { useMemberSettings } from "@hooks/useMemberSettings";
import { useRoomReferences } from "@hooks/useRoomReferences";
import { ErrorDisplay } from "@layouts/components/ErrorDisplay";
import { Skeleton } from "@mui/material";
import { ErrorType } from "@mytypes/ErrorType";
import { firestoreDb } from "@services/Firebase/Firestore.service";
import { runTransaction, serverTimestamp } from "firebase/firestore";
import { ReactNode, useEffect, useState } from "react";

export function RoomReferencesProvider({ children, roomId, memberId }: { children: ReactNode, roomId: string, memberId?: string }) {
	// Hooks
	const roomReferences = useRoomReferences(roomId, memberId);
	// NOTE: Ensures the caller's own member document exists as soon as the room is entered
	// (not only once they open Member Settings), since Firestore rules gate room/message
	// read & write on that document's existence.
	const { loading: memberLoading, error: memberError } = useMemberSettings(roomReferences?.member);
	// States
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<ErrorType>(null); // TODO: | null ?
	// Effects
	useEffect(() => {
		// HACK
		// Ensures that the room document is created before rendering the children.
		// This is necessary because the room document is created in the useRoomReferences hook,
		// but we need to wait for it to be created before rendering the children.
		// NOTE: memberId must be defined to ensure authorization.
		// NOTE: Uses a transaction (rather than a get-then-set check) so that two clients
		// racing to create the same brand-new room (or React StrictMode's double effect
		// invocation) can't have their loser reclassified from a 'create' into an 'update' -
		// which Firestore rules would then reject, since the loser isn't a member yet.
		// On conflict, Firestore retries the transaction; the retry sees the room already
		// exists and skips writing entirely.
		if (roomReferences?.room && memberId) {
			const roomRef = roomReferences.room;
			runTransaction(firestoreDb, async (transaction) => {
				const snapshot = await transaction.get(roomRef);
				if (!snapshot.exists()) {
					transaction.set(roomRef, { createdAt: serverTimestamp() });
				}
			}).then(() => {
				setLoading(false);
				setError(null);
			}).catch((err: ErrorType) => { setError(err); });
		}
	}, [roomReferences?.room])

	if (error) return <ErrorDisplay error={error} />;
	if (memberError) return <ErrorDisplay error={memberError} />;
	return (loading || memberLoading)
		? <Skeleton />
		: <RoomReferencesContext.Provider value={roomReferences}>{children}</RoomReferencesContext.Provider>
};