import { createContext, ReactNode } from "react";
import { FirestoreCollectionContextType } from "../types/FirestoreContextType";
import UserDocument from "../models/Firestore/UserDocument.model";
import { useRoomUsersCollection } from "../hooks/useRoomUsersCollection";
import { DocumentReference } from "firebase/firestore";
import UserModel from "../models/User.model";

export const UsersContext = createContext<FirestoreCollectionContextType<UserModel, UserDocument> | null>(null);

export const UsersContextProvider = ({ children, roomRef }: { children: ReactNode, roomRef: DocumentReference }) => {
	const usersContext = useRoomUsersCollection(roomRef);
	return <UsersContext.Provider value={usersContext}>{children}</UsersContext.Provider>
};