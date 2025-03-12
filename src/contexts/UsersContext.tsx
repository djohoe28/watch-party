import { createContext, ReactNode } from "react";
import { FirestoreCollectionContextType } from "../types/FirestoreContextType";
import UserDocument from "../models/Firestore/UserDocument.model";
import { useRoomUsersCollection } from "../hooks/useRoomUsersCollection";

export const UsersContext = createContext<FirestoreCollectionContextType<UserDocument, UserDocument> | null>(null);

export const MessagesContextProvider = ({ children, roomId }: { children: ReactNode, roomId: string }) => {
	const usersContext = useRoomUsersCollection(roomId);
	return <UsersContext.Provider value={usersContext}>{children}</UsersContext.Provider>
};