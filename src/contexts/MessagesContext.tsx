import { createContext, ReactNode } from "react";
import MessageDocument from "../models/Firestore/MessageDocument.model";
import { useRoomMessagesQuery } from "../hooks/useRoomMessagesQuery";
import { FirestoreQueryContextType } from "../types/FirestoreContextType";
import { DocumentReference } from "firebase/firestore";

// TODO: Is Messages used outside of RoomContext? Of MessageList?
export const MessagesContext = createContext<FirestoreQueryContextType<MessageDocument, MessageDocument> | null>(null);

export const MessagesContextProvider = ({ children, roomRef }: { children: ReactNode, roomRef: DocumentReference }) => {
	const messagesContext = useRoomMessagesQuery(roomRef);
	return <MessagesContext.Provider value={messagesContext}>{children}</MessagesContext.Provider>
};