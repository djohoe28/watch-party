import { createContext, ReactNode } from "react";
import UserModel from "../models/User.model";
import { UsersCollectionReference } from "../models/Firestore/UsersCollection.model";
import { useCollectionData } from "react-firebase-hooks/firestore";

export const UsersContext = createContext<UserModel[] | null | undefined>(null);

export const UsersContextProvider = ({ children, usersRef }: { children: ReactNode, usersRef: UsersCollectionReference | null | undefined }) => {
	const [collectionData, collectionLoading, collectionError, _] = useCollectionData(usersRef);
	// LINT: Leverage loading, error?
	return <UsersContext.Provider value={collectionData}>{children}</UsersContext.Provider>
};