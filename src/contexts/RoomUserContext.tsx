import { createContext, ReactNode } from "react";
import { FirestoreDocumentContextType } from "../types/FirestoreContextType";
import UserDocument from "../models/Firestore/UserDocument.model";
import UserModel from "../models/User.model";
import { User } from "firebase/auth";
import { useRoomUserDocument } from "../hooks/useRoomUserDocument";
import { AsyncContext } from "../types/AsyncContext";
import { UsersContextType } from "./UsersContext";

export type RoomUserContextType = FirestoreDocumentContextType<UserModel, UserDocument>;

export const RoomUserContext = createContext<RoomUserContextType | null>(null);

export const RoomUserContextProvider = ({ children, usersRef, authContext: auth }: { children: ReactNode, usersRef: UsersContextType, authContext: AsyncContext<User> }) => {
	const roomUserContext = useRoomUserDocument(usersRef, auth);
	return <RoomUserContext.Provider value={roomUserContext}>{children}</RoomUserContext.Provider>
};