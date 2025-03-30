import { createContext, ReactNode } from "react";
import MessageDocument from "../models/Firestore/MessageDocument.model";
import { useRoomMessagesQuery } from "../hooks/useRoomMessagesQuery";
import { FirestoreQueryContextType } from "../types/FirestoreContextType";
import { RoomContextType } from "./RoomContext";

export type MessagesContextType = FirestoreQueryContextType<MessageDocument, MessageDocument>;

// TODO: Is Messages used outside of RoomContext? Of MessageList?
export const MessagesContext = createContext<MessagesContextType | null>(null);

export const MessagesContextProvider = ({ children, roomContext }: { children: ReactNode, roomContext: RoomContextType }) => {
	const messagesContext = useRoomMessagesQuery(roomContext);
	return <MessagesContext.Provider value={messagesContext}>{children}</MessagesContext.Provider>
};