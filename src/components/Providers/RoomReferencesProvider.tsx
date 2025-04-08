import { RoomReferencesContext } from "@contexts/RoomReferencesContext";
import { useRoomReferences } from "@hooks/useRoomReferences";
import { ReactNode } from "react";

export function RoomReferencesProvider({ children, roomId, memberId }: { children: ReactNode, roomId: string, memberId?: string }) {
	const roomDocumentReference = useRoomReferences(roomId, memberId);
	
	return <RoomReferencesContext.Provider value={roomDocumentReference}>{children}</RoomReferencesContext.Provider>
};