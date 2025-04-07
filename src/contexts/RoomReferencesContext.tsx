import { createContext, ReactNode } from "react";
import { RoomReferences, useRoomReferences } from "../hooks/useRoomReferences";

export const RoomReferencesContext = createContext<RoomReferences | null>(null); // LINT: undefined?

export const RoomReferencesContextProvider = ({ children, roomId, memberId }: { children: ReactNode, roomId: string, memberId?: string }) => {
	const roomDocumentReference = useRoomReferences(roomId, memberId);
	return <RoomReferencesContext.Provider value={roomDocumentReference}>{children}</RoomReferencesContext.Provider>
};