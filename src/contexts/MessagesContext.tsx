import { createContext, ReactNode } from "react";
import MessageDocument from "../models/Firestore/MessageDocument.model";
import { useRoomMessagesQuery } from "../hooks/useRoomMessagesQuery";
import { FirestoreQueryContextType } from "../types/FirestoreContextType";
import { RoomDocumentReference } from "../models/Firestore/RoomDocument.model";

export type MessagesContextType = FirestoreQueryContextType<MessageDocument, MessageDocument>;

// TODO: Is Messages used outside of RoomContext? Of MessageList?
export const MessagesContext = createContext<MessagesContextType | null>(null);

export const MessagesContextProvider = ({ children, roomRef }: { children: ReactNode, roomRef: RoomDocumentReference }) => {
	const messagesContext = useRoomMessagesQuery(roomRef);
	return <MessagesContext.Provider value={messagesContext}>{children}</MessagesContext.Provider>
};