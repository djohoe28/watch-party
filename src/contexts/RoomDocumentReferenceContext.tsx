import { createContext, ReactNode } from "react";
import { RoomDocumentReference } from "../models/Firestore/RoomDocument.model";
import { useRoomDocumentReference } from "../hooks/useRoomDocumentReference";

export const RoomDocumentReferenceContext = createContext<RoomDocumentReference | null>(null);

export const RoomDocumentReferenceContextProvider = ({ children, roomId }: { children: ReactNode, roomId: string }) => {
	const roomDocumentReference = useRoomDocumentReference(roomId);
	return <RoomDocumentReferenceContext.Provider value={roomDocumentReference}>{children}</RoomDocumentReferenceContext.Provider>
};