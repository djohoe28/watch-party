import { createContext, ReactNode } from "react";
import RoomDocument from "../models/Firestore/RoomDocument.model";
import { useRoomDocument } from "../hooks/useRoomDocument";
import { FirestoreDocumentContextType } from "../types/FirestoreContextType";

export type RoomContextType = FirestoreDocumentContextType<RoomDocument, RoomDocument>;

export const RoomContext = createContext<RoomContextType | null>(null);

export const RoomContextProvider = ({ children, roomId }: { children: ReactNode, roomId: string }) => {
	const roomContext = useRoomDocument(roomId);
	return <RoomContext.Provider value={roomContext}>{children}</RoomContext.Provider>
};