import { createContext, ReactNode } from "react";
import { RoomReferences, useRoomReferences } from "../hooks/useRoomReferences";

export const RoomReferencesContext = createContext<RoomReferences | null>(null); // LINT: undefined?

export const RoomReferencesContextProvider = ({ children, roomId, userId }: { children: ReactNode, roomId: string, userId?: string }) => {
	const roomDocumentReference = useRoomReferences(roomId, userId);
	return <RoomReferencesContext.Provider value={roomDocumentReference}>{children}</RoomReferencesContext.Provider>
};