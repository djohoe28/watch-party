import { createContext, ReactNode } from "react";
import MessageDocument from "../models/Firestore/MessageDocument.model";
import { useRoomMessagesQuery } from "../hooks/useRoomMessagesQuery";
import { FirestoreQueryContextType } from "../types/FirestoreContextType";

// TODO: Is Messages used outside of RoomContext? Of MessageList?
export const MessagesContext = createContext<FirestoreQueryContextType<MessageDocument, MessageDocument> | null>(null);

export const MessagesContextProvider = ({ children, roomId }: { children: ReactNode, roomId: string }) => {
	const messagesContext = useRoomMessagesQuery(roomId);
	return <MessagesContext.Provider value={messagesContext}>{children}</MessagesContext.Provider>
};